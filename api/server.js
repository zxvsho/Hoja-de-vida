require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(cors());
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

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE
app.post('/api/experiencias', async (req, res) => {
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
app.put('/api/experiencias/:id', async (req, res) => {
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
app.delete('/api/experiencias/:id', async (req, res) => {
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
