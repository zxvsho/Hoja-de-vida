# Hoja de vida

Sitio web en React y Vite. El sitio público se publica en GitHub Pages; la API
Express puede alojarse en Render con MongoDB Atlas para que el CRUD funcione
sin dejar un servidor activo en tu computadora.

## GitHub Pages

El workflow [Deploy portfolio to GitHub Pages](./.github/workflows/pages.yml)
compila React/Vite y publica `dist/` cada vez que se actualiza `main`. La página
está en <https://zxvsho.github.io/Hoja-de-vida/>. Usa rutas con `#` para que
las páginas internas funcionen al recargar GitHub Pages.

GitHub Pages solo sirve archivos estáticos: no ejecuta Node.js ni MongoDB. Las
páginas de inicio, perfil, estudios y contacto funcionan sin un servidor API.
La página de experiencias necesita la API para obtener el listado; `/admin`
necesita además la API y su contraseña administrativa.

## API en Render + datos en MongoDB Atlas

1. Crea un cluster de MongoDB Atlas y un usuario de base de datos. Copia la URI
   de conexión de Atlas.
2. Despliega este repositorio en Render usando el Blueprint
   [render.yaml](./render.yaml):
   [Iniciar despliegue en Render](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2Fzxvsho%2FHoja-de-vida).
3. En Render configura `MONGO_URI` con la URI de Atlas y `ADMIN_PASSWORD` con
   una contraseña larga y exclusiva. Render genera `JWT_SECRET`.
4. En los ajustes del repositorio de GitHub abre **Settings → Secrets and
   variables → Actions → Variables** y crea `VITE_API_URL` con la URL base del
   CRUD, por ejemplo `https://NOMBRE-DEL-SERVICIO.onrender.com/api/experiencias`.
   Esta variable es pública en el JavaScript del sitio; no pongas contraseñas
   ni credenciales de MongoDB ahí.
5. Espera a que termine el despliegue de la API en Render y ejecuta
   **Actions → Deploy portfolio to GitHub Pages → Run workflow** para compilar
   la página con la URL de API correcta.

El Blueprint permite el origen GitHub Pages en CORS. El plan gratuito de Render
puede suspender el servicio tras un periodo sin uso; la primera solicitud puede
tardar mientras se reactiva.

## Desarrollo local

Requiere Node.js 20.19 o posterior y MongoDB. En `api/.env`, configura
`MONGO_URI`, `ADMIN_PASSWORD` y un `JWT_SECRET` aleatorio de al menos 32
caracteres usando como guía [api/.env.example](./api/.env.example).

Inicia la API desde `api/` con `npm ci && npm run dev` y Vite desde la raíz con
`npm ci && npm run dev`. Vite redirige `/api` a la API local. No se requiere
`VITE_API_URL` para desarrollo; la variable del repositorio se usa para la
compilación de GitHub Pages.

## Rutas

- `/` — inicio.
- `/sobre-mi` — perfil personal.
- `/estudios` — formación académica.
- `/experiencias` — listado público cargado desde la API.
- `/contacto` — datos y formulario de contacto de demostración.
- `/admin` — acceso protegido para crear, editar y eliminar experiencias.

Las operaciones de escritura de la API requieren una sesión administrativa
HttpOnly. Las experiencias se pueden consultar públicamente. No compartas la
contraseña de administración ni la URI de MongoDB.

## Compilación y pruebas

```sh
npm run build
npm --prefix api test
```

## Evidencia del CRUD

El PDF incluye capturas de la administración y del listado público verificadas
en un navegador local contra una API conectada a MongoDB temporal:
[Descargar evidencia-hoja-de-vida.pdf](./evidencia-hoja-de-vida.pdf).
