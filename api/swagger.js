const experiencia = {
  type: 'object',
  properties: {
    empresa: { type: 'string', example: 'Empresa SAS' },
    cargo: { type: 'string', example: 'Desarrollador Backend' },
    descripcion: { type: 'string', example: 'Desarrollo de APIs REST con Node.js y MongoDB' },
    ubicacion: { type: 'string', example: 'Cartagena, Colombia' },
    fechaInicio: { type: 'string', format: 'date', example: '2025-01-15' },
    fechaFin: { type: 'string', format: 'date', example: '2025-06-30' },
    actual: { type: 'boolean', example: false },
    tecnologias: { type: 'array', items: { type: 'string' }, example: ['Node.js', 'Express', 'MongoDB'] },
  },
};

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'ID de MongoDB (ObjectId)',
};

const body = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Experiencia' } } } };
const ok = (d) => ({ description: d, content: { 'application/json': { schema: { $ref: '#/components/schemas/Experiencia' } } } });

module.exports = {
  openapi: '3.0.0',
  info: { title: 'API Experiencias Profesionales', version: '1.0.0', description: 'CRUD de experiencias para la hoja de vida' },
  servers: [{ url: '/' }],
  components: { schemas: { Experiencia: experiencia } },
  paths: {
    '/api/experiencias': {
      post: { summary: 'Crear experiencia', requestBody: body, responses: { 201: ok('Creada'), 400: { description: 'Datos inválidos' } } },
      get: { summary: 'Listar experiencias', responses: { 200: { description: 'Lista', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Experiencia' } } } } } } },
    },
    '/api/experiencias/{id}': {
      get: { summary: 'Obtener una experiencia', parameters: [idParam], responses: { 200: ok('Encontrada'), 400: { description: 'ID inválido' }, 404: { description: 'No encontrada' } } },
      put: { summary: 'Actualizar experiencia', parameters: [idParam], requestBody: body, responses: { 200: ok('Actualizada'), 400: { description: 'ID o datos inválidos' }, 404: { description: 'No encontrada' } } },
      delete: { summary: 'Eliminar experiencia', parameters: [idParam], responses: { 200: { description: 'Eliminada' }, 400: { description: 'ID inválido' }, 404: { description: 'No encontrada' } } },
    },
  },
};
