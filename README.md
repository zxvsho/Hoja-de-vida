# Hoja de vida

Sitio web en React y Vite. El sitio público puede publicarse en GitHub Pages o
Vercel. La API independiente se despliega como funciones serverless en Vercel y
guarda los datos en un Blob privado, sin MongoDB ni un servidor local.

## GitHub Pages

El workflow [Deploy portfolio to GitHub Pages](./.github/workflows/pages.yml)
compila React/Vite y publica `dist/` cada vez que se actualiza `main`. La página
está en <https://zxvsho.github.io/Hoja-de-vida/>. Usa rutas con `#` para que
las páginas internas funcionen al recargar GitHub Pages.

GitHub Pages solo sirve archivos estáticos: no ejecuta funciones de servidor ni una base de datos. Las
páginas de inicio, perfil, estudios y contacto funcionan sin un servidor API.
La página de experiencias necesita la API para obtener el listado; `/admin`
necesita además la API y su contraseña administrativa.

## API independiente en Vercel (sin MongoDB)

El proyecto de API está en [api-service/](./api-service/). La carpeta se
despliega por separado, con **Root Directory = `api-service`**. La API usa
funciones serverless de Vercel y Vercel Blob privado para conservar los datos;
no usa MongoDB, Render ni un proceso local.

La API desplegada está en
<https://api-miguel95-cmds-projects.vercel.app>. Su estado se comprueba en
`/api/health`; cuando Blob y las variables de autenticación están configurados,
responde `{"status":"ok","storage":"connected"}`.

Configura `VITE_API_URL` en GitHub Actions Variables y en Vercel para el
frontend con el valor
`https://api-miguel95-cmds-projects.vercel.app/api/experiencias`. No coloques
contraseñas ni tokens Blob en variables `VITE_*`.

Vercel Blob ofrece cuota incluida según el plan; el uso que supere los límites
puede generar cargos. Los detalles para configurar otro despliegue están en
[api-service/README.md](./api-service/README.md).

## Desarrollo local

Requiere Node.js 20.19 o posterior. Inicia el sitio desde la raíz con
`npm ci && npm run dev`. Las pruebas de la API independiente se ejecutan con
`cd api-service && npm ci && npm test`. Para ejecutar las funciones localmente,
usa `vercel dev` desde `api-service/` con el proyecto Vercel vinculado y sus
variables locales.

## Rutas

- `/` — inicio.
- `/sobre-mi` — perfil personal.
- `/estudios` — formación académica.
- `/experiencias` — listado público cargado desde la API.
- `/contacto` — datos y formulario de contacto de demostración.
- `/admin` — acceso protegido para crear, editar y eliminar experiencias.

Las operaciones de escritura de la API requieren una sesión administrativa
HttpOnly. Las experiencias se pueden consultar públicamente. No compartas la
contraseña administrativa ni las credenciales de Vercel Blob.

## Compilación y pruebas

```sh
npm run build
npm --prefix api-service test
```

## Evidencia del CRUD

El PDF incluye capturas de la administración y del listado público verificadas
en un navegador local:
[Descargar evidencia-hoja-de-vida.pdf](./evidencia-hoja-de-vida.pdf).
