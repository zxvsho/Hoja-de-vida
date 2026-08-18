# Hoja de Vida — Miguel

Sitio web de 4 páginas (Inicio, Sobre mí, Estudios, Contacto) con HTML, CSS,
imágenes y navegación entre páginas.

## Estructura
```
hoja-de-vida/
├── index.html
├── sobre-mi.html
├── estudios.html
├── contacto.html
├── css/estilos.css
└── img/perfil.png
```

## Antes de publicar
Edita `contacto.html` y reemplaza correo, LinkedIn, GitHub y ubicación por
tus datos reales.

## Publicar en GitHub Pages (enlace público)
1. Crea una cuenta en https://github.com si no tienes.
2. Crea un repositorio nuevo, por ejemplo `hoja-de-vida` (público).
3. Sube estos archivos al repositorio (arrastra la carpeta completa en
   "Add file → Upload files", o usa git — ver abajo).
4. Ve a **Settings → Pages** en tu repositorio.
5. En "Source" elige la rama `main` y la carpeta `/ (root)`, luego Save.
6. Espera 1-2 minutos y tu sitio quedará en:
   `https://tu-usuario.github.io/hoja-de-vida/`
7. Comparte ese enlace — cualquiera con él podrá verla.

## Alternativa por terminal (git)
```bash
cd hoja-de-vida
git init
git add .
git commit -m "Hoja de vida personal"
git branch -M main
git remote add origin https://github.com/tu-usuario/hoja-de-vida.git
git push -u origin main
```
Luego repite los pasos 4-6 de arriba.
