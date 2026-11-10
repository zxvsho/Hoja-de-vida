# Hoja de Vida

Sitio de hoja de vida en **Vue 3 (Vite)** + API de experiencias (Express, MongoDB, JWT).

```
api/        API REST (CRUD experiencias + login JWT)
frontend/   Sitio Vue 3 con panel administrativo en /admin
```

## Ejecutar

**API**
```bash
cd api && npm install && cp .env.example .env
npm run hash -- "tu-clave"   # pega el resultado en ADMIN_PASSWORD_HASH
npm run dev                  # http://localhost:3000  (Swagger: /api-docs)
```

**Frontend**
```bash
cd frontend && npm install && npm run dev   # http://localhost:5173
```
Vite reenvía `/api` a `localhost:3000`.

## GitHub Pages
El workflow `.github/workflows/pages.yml` compila y publica `frontend/`. Pasos: *Settings → Pages → Source: GitHub Actions*, y en *Settings → Secrets and variables → Actions → Variables* crea `VITE_API_URL` con la URL pública HTTPS de la API (sin `/api`). En la API, `CORS_ORIGIN=https://zxvsho.github.io`. Las rutas usan hash (`#/admin`) para que funcionen en Pages.

## Rutas
`/` · `/sobre-mi` · `/estudios` · `/experiencias` · `/contacto` · `/login` · `/admin` (protegida)
