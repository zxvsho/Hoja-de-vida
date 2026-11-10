require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


// ---------- Autenticación (JWT) ----------
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASSWORD_HASH) {
  console.error('Faltan JWT_SECRET, ADMIN_USER o ADMIN_PASSWORD_HASH en .env');
  process.exit(1);
}

app.post('/api/auth/login', async (req, res) => {
  const { usuario, password } = req.body || {};
  const okUser = typeof usuario === 'string' && usuario === ADMIN_USER;
  const okPass = typeof password === 'string' && (await bcrypt.compare(password, ADMIN_PASSWORD_HASH));
  if (!okUser || !okPass) return res.status(401).json({ error: 'Credenciales inválidas' });
  const token = jwt.sign({ sub: usuario }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '2h' });
  res.json({ token });
});

// Protege las rutas de escritura; el GET sigue siendo público
const requireAuth = (req, res, next) => {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE
app.post('/api/experiencias', requireAuth, async (req, res) => {
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
app.put('/api/experiencias/:id', requireAuth, async (req, res) => {
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
app.delete('/api/experiencias/:id', requireAuth, async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
    const exp = await Experiencia.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ error: 'No encontrada' });
    res.json({ mensaje: 'Experiencia eliminada' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Conexión + arranque
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => console.log(`API en http://localhost:${PORT} | Swagger en http://localhost:${PORT}/api-docs`));
  })
  .catch((err) => console.error('Error de conexión:', err));
