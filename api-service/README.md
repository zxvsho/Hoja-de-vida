# API independiente para Vercel

Esta API implementa el CRUD de experiencias profesionales como funciones
serverless de Vercel. No utiliza MongoDB: los registros se guardan en un Blob
privado de Vercel.

## Desplegar como proyecto independiente

1. Importa el repositorio `zxvsho/Hoja-de-vida` en Vercel.
2. En **Root Directory**, elige `api-service` (solo ese nombre, relativo a la
   raíz del repositorio). No elijas `api` ni `backend`.
3. Vercel detectará `api-service/vercel.json`; no hace falta configurar un
   comando de build.
4. Crea un Blob **privado** desde **Storage → Create Database → Blob** y
   conéctalo al proyecto para Production. Vercel agrega
   `BLOB_READ_WRITE_TOKEN` automáticamente.
5. En **Settings → Environment Variables**, configura para Production:
   - `ADMIN_PASSWORD`: contraseña administrativa larga y exclusiva.
   - `JWT_SECRET`: secreto aleatorio de al menos 32 caracteres.
   - `CORS_ORIGIN`: `https://zxvsho.github.io` (añade el origen del frontend si
     también se sirve desde otro dominio, separados por comas).
6. Despliega o vuelve a desplegar. La API base será
   `https://NOMBRE-DEL-PROYECTO.vercel.app/api`.

No agregues `MONGO_URI`: esta versión no usa MongoDB. El almacenamiento Blob
puede generar cargos si se exceden los límites incluidos en tu plan de Vercel.

## Conectar el frontend

Configura `VITE_API_URL` como
`https://NOMBRE-DEL-PROYECTO.vercel.app/api/experiencias` en el entorno de
compilación del frontend y vuelve a publicarlo. El login usa el mismo dominio
de API y cookies seguras.

Comprueba `https://NOMBRE-DEL-PROYECTO.vercel.app/api/health`: debe responder
`{"status":"ok","storage":"connected"}`. La API ofrece sesión de administrador
y operaciones GET, POST, PUT y DELETE bajo `/api/experiencias`.

## Pruebas

```sh
npm ci
npm test
```
