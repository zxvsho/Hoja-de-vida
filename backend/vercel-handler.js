const mongoose = require('mongoose');
const { app } = require('./server');

let connectionPromise;

function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS) || 10000,
      })
      .then(() => undefined)
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = async function handler(req, res) {
  const missingEnvironment = ['MONGO_URI', 'ADMIN_PASSWORD', 'JWT_SECRET'].filter(
    (name) => !process.env[name],
  );
  if (missingEnvironment.length > 0) {
    return res.status(500).json({
      error: `Faltan variables obligatorias: ${missingEnvironment.join(', ')}.`,
    });
  }

  if (Buffer.byteLength(process.env.JWT_SECRET) < 32) {
    return res.status(500).json({
      error: 'JWT_SECRET debe tener al menos 32 bytes.',
    });
  }

  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error(`No se pudo conectar con MongoDB: ${error.message}`);
    return res.status(503).json({
      error: 'La API no está disponible. Verifica la conexión con MongoDB.',
    });
  }
};
