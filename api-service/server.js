const { randomUUID, createHash, timingSafeEqual } = require('node:crypto');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const store = require('./store');

const app = express();
const cookieName = 'hoja_de_vida_admin';
const sessionDurationMs = 8 * 60 * 60 * 1000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'https://zxvsho.github.io')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
const corsOptions = { origin: allowedOrigins, credentials: true };
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

const hash = (value) => createHash('sha256').update(value).digest();
const credentialsMatch = (provided, expected) =>
  timingSafeEqual(hash(provided), hash(expected));

function verifyAdmin(req) {
  try {
    return jwt.verify(req.cookies[cookieName], process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError) {
      return null;
    }
    throw error;
  }
}

function requireAdmin(req, res, next) {
  const session = verifyAdmin(req);
  if (!session || session.role !== 'admin') {
    return res.status(401).json({ error: 'Inicia sesión para administrar las experiencias.' });
  }
  next();
}

function requireAllowedOrigin(req, res, next) {
  const origin = req.get('origin');
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Origen no permitido.' });
  }
  next();
}

function validateExperience(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'El cuerpo de la solicitud debe ser un objeto JSON.';
  }
  if (typeof body.empresa !== 'string' || !body.empresa.trim()) {
    return 'La empresa es obligatoria.';
  }
  if (typeof body.cargo !== 'string' || !body.cargo.trim()) {
    return 'El cargo es obligatorio.';
  }
  if (!body.fechaInicio || Number.isNaN(Date.parse(body.fechaInicio))) {
    return 'La fecha de inicio es obligatoria y debe ser válida.';
  }
  if (body.fechaFin && Number.isNaN(Date.parse(body.fechaFin))) {
    return 'La fecha de finalización debe ser válida.';
  }
  if (body.tecnologias !== undefined && !Array.isArray(body.tecnologias)) {
    return 'Las tecnologías deben enviarse como una lista.';
  }
  return null;
}

function normalizeExperience(body, id) {
  return {
    _id: id,
    id,
    empresa: body.empresa.trim(),
    cargo: body.cargo.trim(),
    descripcion: typeof body.descripcion === 'string' ? body.descripcion.trim() : '',
    ubicacion: typeof body.ubicacion === 'string' ? body.ubicacion.trim() : '',
    fechaInicio: new Date(body.fechaInicio).toISOString(),
    fechaFin: body.actual || !body.fechaFin ? null : new Date(body.fechaFin).toISOString(),
    actual: Boolean(body.actual),
    tecnologias: (body.tecnologias || [])
      .filter((technology) => typeof technology === 'string')
      .map((technology) => technology.trim())
      .filter(Boolean),
    createdAt: body.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos antes de volver a intentar.' },
});

app.get('/api/health', async (req, res) => {
  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(503).json({ status: 'unavailable', error: 'Falta configurar la autenticación.' });
  }
  try {
    await store.checkStorage();
    return res.json({ status: 'ok', storage: 'connected' });
  } catch (error) {
    console.error(`El almacenamiento no está disponible: ${error.message}`);
    return res.status(503).json({ status: 'unavailable', error: 'El almacenamiento de Vercel Blob no está configurado.' });
  }
});

app.post('/api/auth/login', requireAllowedOrigin, loginLimiter, (req, res) => {
  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(503).json({ error: 'El acceso administrativo no está configurado.' });
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!credentialsMatch(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'La contraseña es incorrecta.' });
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    partitioned: true,
    maxAge: sessionDurationMs,
    path: '/api',
  });
  return res.json({ authenticated: true });
});

app.get('/api/auth/session', (req, res) => {
  const session = verifyAdmin(req);
  return res.json({ authenticated: Boolean(session && session.role === 'admin') });
});

app.post('/api/auth/logout', requireAllowedOrigin, (req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    partitioned: true,
    path: '/api',
  });
  return res.json({ authenticated: false });
});

app.get('/api/experiencias', async (req, res) => {
  try {
    return res.json(await store.listExperiences());
  } catch (error) {
    console.error(`No se pudieron leer las experiencias: ${error.message}`);
    return res.status(503).json({ error: 'No se pudieron cargar las experiencias.' });
  }
});

app.get('/api/experiencias/:id', async (req, res) => {
  try {
    const experience = await store.findExperience(req.params.id);
    if (!experience) return res.status(404).json({ error: 'Experiencia no encontrada.' });
    return res.json(experience);
  } catch (error) {
    console.error(`No se pudo leer la experiencia: ${error.message}`);
    return res.status(503).json({ error: 'No se pudo cargar la experiencia.' });
  }
});

app.post('/api/experiencias', requireAllowedOrigin, requireAdmin, async (req, res) => {
  const validationError = validateExperience(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const experience = normalizeExperience(req.body, randomUUID());
    await store.saveExperience(experience);
    return res.status(201).json(experience);
  } catch (error) {
    console.error(`No se pudo crear la experiencia: ${error.message}`);
    return res.status(503).json({ error: 'No se pudo guardar la experiencia.' });
  }
});

app.put('/api/experiencias/:id', requireAllowedOrigin, requireAdmin, async (req, res) => {
  const validationError = validateExperience(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const existing = await store.findExperience(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Experiencia no encontrada.' });
    const experience = normalizeExperience(req.body, req.params.id);
    experience.createdAt = existing.createdAt;
    await store.saveExperience(experience);
    return res.json(experience);
  } catch (error) {
    console.error(`No se pudo actualizar la experiencia: ${error.message}`);
    return res.status(503).json({ error: 'No se pudo actualizar la experiencia.' });
  }
});

app.delete('/api/experiencias/:id', requireAllowedOrigin, requireAdmin, async (req, res) => {
  try {
    const deleted = await store.deleteExperience(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Experiencia no encontrada.' });
    return res.json({ mensaje: 'Experiencia eliminada.' });
  } catch (error) {
    console.error(`No se pudo eliminar la experiencia: ${error.message}`);
    return res.status(503).json({ error: 'No se pudo eliminar la experiencia.' });
  }
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta de API no encontrada.' }));

module.exports = { app, validateExperience };
