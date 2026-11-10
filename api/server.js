require('dotenv').config();
const { createHash, timingSafeEqual } = require('node:crypto');
const path = require('node:path');
const { existsSync } = require('node:fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const cookieName = 'hoja_de_vida_admin';
const sessionDurationMs = 8 * 60 * 60 * 1000;
const jwtSecret = process.env.JWT_SECRET;
const adminPassword = process.env.ADMIN_PASSWORD;

app.set('trust proxy', 1);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const hash = (value) => createHash('sha256').update(value).digest();
const credentialHashesMatch = (provided, expected) =>
  timingSafeEqual(hash(provided), hash(expected));

function getAdminSession(req) {
  try {
    return jwt.verify(req.cookies[cookieName], jwtSecret);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError) {
      return null;
    }
    throw error;
  }
}

function requireAdmin(req, res, next) {
  const session = getAdminSession(req);
  if (!session || session.role !== 'admin') {
    return res.status(401).json({ error: 'Inicia sesión para administrar las experiencias.' });
  }
  next();
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos antes de volver a intentar.' },
});

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});

app.post('/api/auth/login', loginLimiter, (req, res) => {
  if (!adminPassword || !jwtSecret) {
    return res.status(503).json({ error: 'El acceso administrativo no está configurado.' });
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!credentialHashesMatch(password, adminPassword)) {
    return res.status(401).json({ error: 'La contraseña es incorrecta.' });
  }

  const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '8h' });
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: sessionDurationMs,
    path: '/api',
  });
  res.json({ authenticated: true });
});

app.get('/api/auth/session', (req, res) => {
  const session = getAdminSession(req);
  if (!session || session.role !== 'admin') {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
  });
  res.json({ authenticated: false });
});

// Modelo
const experienciaSchema = new mongoose.Schema(
  {
    empresa: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    ubicacion: { type: String, trim: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date },
    actual: { type: Boolean, default: false },
    tecnologias: [{ type: String }],
  },
  { timestamps: true }
);
const Experiencia = mongoose.model('Experiencia', experienciaSchema);

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE
app.post('/api/experiencias', requireAdmin, async (req, res) => {
  try {
    const nueva = await Experiencia.create(req.body);
    res.status(201).json(nueva);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// READ (todas)
app.get('/api/experiencias', async (req, res) => {
  try {
    const lista = await Experiencia.find().sort({ fechaInicio: -1 });
    res.json(lista);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ (una)
app.get('/api/experiencias/:id', async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
    const exp = await Experiencia.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: 'No encontrada' });
    res.json(exp);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE
app.put('/api/experiencias/:id', requireAdmin, async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
    const exp = await Experiencia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exp) return res.status(404).json({ error: 'No encontrada' });
    res.json(exp);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE
app.delete('/api/experiencias/:id', requireAdmin, async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
    const exp = await Experiencia.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ error: 'No encontrada' });
    res.json({ mensaje: 'Experiencia eliminada' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta de API no encontrada.' });
});

const frontendDirectory = path.resolve(__dirname, '../dist');
if (existsSync(path.join(frontendDirectory, 'index.html'))) {
  app.use(express.static(frontendDirectory));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDirectory, 'index.html'));
  });
}

// Conexión + arranque
const PORT = process.env.PORT || 3000;
const requiredEnvironment = ['MONGO_URI', 'ADMIN_PASSWORD', 'JWT_SECRET'];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);
function start() {
  if (missingEnvironment.length > 0) {
    throw new Error(`Faltan variables obligatorias: ${missingEnvironment.join(', ')}.`);
  }
  if (Buffer.byteLength(jwtSecret) < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 bytes.');
  }

  return mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS) || 10000,
    })
    .then(() => {
      console.log('MongoDB conectado');
      return app.listen(PORT, () =>
        console.log(`Sitio y API en http://localhost:${PORT} | Swagger en http://localhost:${PORT}/api-docs`),
      );
    });
}

if (require.main === module) {
  start().catch((error) => {
    console.error(`No se pudo iniciar la aplicación: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
