# API de experiencias profesionales

API REST de Node.js, Express y MongoDB. En Render, el mismo servicio también
sirve la aplicación React compilada; la conexión a MongoDB Atlas persiste los
datos incluso cuando el servicio se reinicia.

## Variables de entorno

Consulta [.env.example](./.env.example). `MONGO_URI`, `ADMIN_PASSWORD` y un
`JWT_SECRET` aleatorio con un mínimo de 32 caracteres son obligatorios. No
guardes credenciales reales en Git.

## Rutas

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/health` | Público; indica si MongoDB está conectado |
| POST | `/api/auth/login` | Público; inicia sesión con la contraseña administrativa |
| GET | `/api/auth/session` | Sesión administrativa |
| POST | `/api/auth/logout` | Sesión administrativa |
| GET | `/api/experiencias` | Público |
| GET | `/api/experiencias/:id` | Público |
| POST | `/api/experiencias` | Sesión administrativa |
| PUT | `/api/experiencias/:id` | Sesión administrativa |
| DELETE | `/api/experiencias/:id` | Sesión administrativa |

El inicio de sesión establece una cookie firmada, HttpOnly y con expiración
de ocho horas. Los intentos fallidos están limitados para reducir ataques de
fuerza bruta.

## Ejecución y comprobaciones

```sh
npm ci
npm test
npm start
```

La documentación Swagger está disponible en `/api-docs`.
