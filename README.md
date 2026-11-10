# Hoja de vida

Sitio web en React y Vite, servido junto con la API Express. Las experiencias
se guardan en MongoDB Atlas: una vez desplegado, el sitio y su API funcionan
sin dejar un servidor activo en tu computadora.

## Publicar en internet (Render + MongoDB Atlas)

1. Crea un cluster de MongoDB Atlas y un usuario de base de datos. En el acceso
   de red de Atlas permite la conexión desde Render; en el plan gratuito de
   Render normalmente se requiere permitir `0.0.0.0/0`, por lo que debes usar
   una contraseña larga y exclusiva para el usuario de base de datos.
2. En Render importa el repositorio de GitHub como un **Blueprint**. Render
   detecta [render.yaml](./render.yaml), compila React y ejecuta la API en el
   mismo servicio.
3. En la configuración del servicio, introduce `MONGO_URI` con la URI de Atlas
   y define una `ADMIN_PASSWORD` larga y exclusiva. Render genera
   automáticamente `JWT_SECRET`; nunca guardes estos valores en el repositorio.
4. Cuando finalice el despliegue, abre `https://zxvsho-hoja-de-vida.onrender.com`.
   La API está en `/api/experiencias`, el estado en `/api/health`, Swagger en
   `/api-docs` y el panel administrativo en `/admin`.

[Iniciar el despliegue en Render](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2Fzxvsho%2FHoja-de-vida)

El plan gratuito de Render puede suspender el servicio tras un periodo sin uso;
la primera visita posterior puede tardar mientras vuelve a arrancar. Para
mantenerlo siempre activo se necesita un plan de alojamiento que no suspenda
el servicio.

## Desarrollo local

Requiere Node.js 20.19 o posterior y una URI de MongoDB. En `api/.env`, configura
`MONGO_URI`, `ADMIN_PASSWORD` y un `JWT_SECRET` aleatorio de al menos 32
caracteres usando como guía [api/.env.example](./api/.env.example).

En una terminal inicia la API:

```sh
cd api
npm ci
npm run dev
```

En otra terminal, desde la raíz, inicia Vite:

```sh
npm ci
npm run dev
```

Vite redirige `/api` a la API local. No se requiere `VITE_API_URL` durante el
desarrollo ni en el despliegue de Render.

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
