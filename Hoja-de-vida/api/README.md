# API Experiencias Profesionales

CRUD de experiencias para la hoja de vida. Node.js + Express + MongoDB (Mongoose).

## Uso

```bash
npm install
cp .env.example .env
npm run dev
```

Documentación y pruebas con Swagger: http://localhost:3000/api-docs

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/experiencias | Crear |
| GET | /api/experiencias | Listar |
| GET | /api/experiencias/:id | Obtener una |
| PUT | /api/experiencias/:id | Actualizar |
| DELETE | /api/experiencias/:id | Eliminar |

## Ejemplo (POST)

```json
{
  "empresa": "Empresa SAS",
  "cargo": "Desarrollador Backend",
  "descripcion": "Desarrollo de APIs REST",
  "ubicacion": "Cartagena, Colombia",
  "fechaInicio": "2025-01-15",
  "fechaFin": "2025-06-30",
  "actual": false,
  "tecnologias": ["Node.js", "Express", "MongoDB"]
}
```

## Autenticación (JWT)

`GET` es público; `POST`, `PUT` y `DELETE` requieren `Authorization: Bearer <token>`.

```bash
npm run hash -- "tu-clave"     # copia el resultado en ADMIN_PASSWORD_HASH (.env)
```

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/auth/login | Body `{ "usuario", "password" }` → `{ "token" }` |
