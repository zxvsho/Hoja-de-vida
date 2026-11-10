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

## Despliegue en Vercel

Vercel puede alojar el sitio React y la API bajo el mismo dominio. El archivo
[vercel.json](./vercel.json) configura el build, las rutas hash y la función
serverless de la API. MongoDB Atlas sigue siendo necesario para guardar los
datos.

1. Crea un cluster en MongoDB Atlas y un usuario de base de datos. En **Network
   Access**, permite el acceso desde Vercel; en planes sin IP estática suele
   usarse `0.0.0.0/0`, por lo que debes proteger la base con credenciales
   fuertes y limitar los permisos del usuario.
2. En Vercel selecciona **Add New → Project**, importa
   `zxvsho/Hoja-de-vida` desde GitHub y deja la raíz del proyecto como `./`.
   Vercel detectará `vercel.json`; no cambies el directorio raíz.
3. Antes de desplegar, agrega estas variables del proyecto en Vercel para
   Production (y Preview si también quieres probar allí):
   - `MONGO_URI`: URI de conexión de Atlas, con la contraseña del usuario
     incluida.
   - `ADMIN_PASSWORD`: contraseña administrativa larga y exclusiva.
   - `JWT_SECRET`: secreto aleatorio de al menos 32 caracteres.
4. Pulsa **Deploy**. Vercel instala las dependencias de la web y de la API,
   construye React y publica la función en `/api/*`.
5. Abre `https://TU-PROYECTO.vercel.app/api/health`. Debe responder JSON con
   `"status":"ok"` y `"database":"connected"`. Luego abre
   `https://TU-PROYECTO.vercel.app/#/experiencias` y
   `https://TU-PROYECTO.vercel.app/#/admin`.

No hace falta configurar `VITE_API_URL`: el sitio llama a `/api` en el mismo
dominio. No pongas `MONGO_URI`, `ADMIN_PASSWORD` ni `JWT_SECRET` en GitHub,
en el código ni en variables `VITE_*`.

## Desarrollo local

Requiere Node.js 20.19 o posterior y MongoDB. En `backend/.env`, configura
`MONGO_URI`, `ADMIN_PASSWORD` y un `JWT_SECRET` aleatorio de al menos 32
caracteres usando como guía [backend/.env.example](./backend/.env.example).

Instala dependencias con `npm ci` en la raíz y `npm --prefix backend ci`.
Luego inicia la API con `npm --prefix backend run dev` y Vite con `npm run dev`
en dos terminales. Vite redirige `/api` a la API local. No se requiere
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
npm --prefix backend test
```

## Evidencia del CRUD

El PDF incluye capturas de la administración y del listado público verificadas
en un navegador local contra una API conectada a MongoDB temporal:
[Descargar evidencia-hoja-de-vida.pdf](./evidencia-hoja-de-vida.pdf).
