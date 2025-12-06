# UHC Mindustry 2025

Website con temática de Minecraft para el evento UHC Mindustry 2025.

## Características

- Contador regresivo para el evento
- Sistema de perfiles de jugadores con renderizado 3D de skins
- Sistema de libros personales con autenticación por contraseña
- Diseño temático de Minecraft con bloques del Nether
- Totalmente responsive

## Requisitos

Este es un sitio web estático que funciona con:
- HTML5
- CSS3
- JavaScript (Vanilla)
- Three.js para renderizado 3D

## Despliegue en GitHub Pages

### Opción 1: Desde la interfaz web de GitHub

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Pages**
4. En **Source**, selecciona la rama `main` (o `master`)
5. Asegúrate de que el directorio raíz esté seleccionado como `/ (root)`
6. Haz clic en **Save**
7. Espera unos minutos y tu sitio estará disponible en `https://tu-usuario.github.io/TheFinder25`

### Opción 2: Desde la línea de comandos

```bash
# Inicializar repositorio git (si aún no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: UHC Mindustry 2025 website"

# Agregar el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/TheFinder25.git

# Subir a GitHub
git push -u origin main
```

Después sigue los pasos de la Opción 1 para habilitar GitHub Pages.

## Estructura del Proyecto

```
TheFinder25/
├── index.html              # Página principal
├── styles.css              # Estilos consolidados
├── assets/                 # Recursos (imágenes, iconos, items)
│   ├── images/            # Imágenes de bloques de Minecraft
│   ├── items/             # Items y objetos del juego
│   ├── icons/             # Iconos
│   └── webp/              # Imágenes WebP optimizadas
├── render/                # Renderizadores personalizados
│   ├── minecraft-skin-renderer.js
│   └── player-viewer.js
├── players.js             # Datos y lógica de jugadores
├── interactives.js        # Interacciones del sitio
├── book.js                # Sistema de libros
├── book-auth.js           # Autenticación de libros
└── reset-passwords.js     # Utilidad para resetear contraseñas
```

## Uso

Una vez desplegado, los usuarios pueden:
- Ver el contador regresivo para el evento
- Explorar perfiles de jugadores haciendo clic en sus avatares
- Acceder a libros personales (con contraseña si está protegido)
- Agregar items a su libro personal

## Desarrollo Local

Para probar el sitio localmente:

1. Simplemente abre `index.html` en tu navegador, o
2. Usa un servidor local como `Live Server` en VS Code, o
3. Ejecuta `python -m http.server 8000` en la carpeta del proyecto

## Licencia

Este proyecto es de código abierto y está disponible para uso personal.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

