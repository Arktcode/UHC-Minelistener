# INSTRUCCIONES PARA SUBIR A GITHUB Y CONFIGURAR GITHUB PAGES

## ✅ CAMBIOS REALIZADOS

Se han hecho los siguientes cambios para preparar el proyecto para GitHub Pages:

1. **Reorganización de archivos**: Se movieron todos los archivos principales (`index.html`, `styles.css`, archivos `.js`) desde la carpeta `content/` a la raíz del proyecto
2. **Creación de archivos Git**: 
   - `.gitignore` - Para excluir archivos innecesarios del repositorio
   - `README.md` - Documentación del proyecto
3. **Inicialización de Git**: Se creó un repositorio Git local con el primer commit

## 📝 PASOS PARA SUBIR A GITHUB

### Paso 1: Crear un repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Configura el repositorio:
   - **Repository name**: `TheFinder25` (o el nombre que prefieras)
   - **Description** (opcional): "UHC Mindustry 2025 - Sitio web oficial del evento"
   - **Public** o **Private**: Elige según tu preferencia
   - ⚠️ **NO inicialices con README, .gitignore o licencia** (ya los tenemos)
5. Haz clic en **"Create repository"**

### Paso 2: Conectar el repositorio local con GitHub

GitHub te mostrará comandos después de crear el repositorio. Usa estos comandos en PowerShell:

```powershell
# Asegúrate de estar en la carpeta del proyecto
cd C:\Users\user\Desktop\TheFinder25

# Agrega el repositorio remoto (reemplaza 'tu-usuario' con tu nombre de usuario de GitHub)
git remote add origin https://github.com/tu-usuario/TheFinder25.git

# Cambia el nombre de la rama a 'main' (si GitHub usa 'main' en lugar de 'master')
git branch -M main

# Sube los archivos a GitHub
git push -u origin main
```

**Nota**: Te pedirá tu usuario y contraseña de GitHub. Si tienes autenticación de dos factores, necesitarás crear un **Personal Access Token** en lugar de usar tu contraseña.

#### Crear un Personal Access Token (si es necesario):

1. Ve a GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Clic en "Generate new token (classic)"
3. Dale un nombre descriptivo (ej: "TheFinder25 Deploy")
4. Selecciona los scopes: `repo` (todos los permisos de repositorio)
5. Clic en "Generate token"
6. **COPIA EL TOKEN INMEDIATAMENTE** (no podrás verlo de nuevo)
7. Usa este token como contraseña cuando Git te la pida

### Paso 3: Configurar GitHub Pages

Una vez que tus archivos estén en GitHub:

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** (Configuración) en la parte superior
3. En el menú lateral izquierdo, busca **"Pages"** (en la sección "Code and automation")
4. En la sección **"Source"**:
   - Selecciona la rama **`main`** (o `master`)
   - Selecciona el directorio **`/ (root)`**
5. Haz clic en **"Save"**
6. GitHub procesará el sitio (esto puede tardar 1-2 minutos)
7. Una vez listo, verás un mensaje con la URL de tu sitio:
   ```
   Your site is live at https://tu-usuario.github.io/TheFinder25/
   ```

### Paso 4: Verificar el sitio

1. Espera 1-2 minutos después de guardar la configuración
2. Visita la URL: `https://tu-usuario.github.io/TheFinder25/`
3. Verifica que todo funcione correctamente

## 🔧 COMANDOS ÚTILES PARA EL FUTURO

### Para hacer cambios en el futuro:

```powershell
# 1. Haz tus cambios en los archivos

# 2. Ve el estado de los cambios
git status

# 3. Agrega los cambios al staging
git add .

# 4. Haz commit con un mensaje descriptivo
git commit -m "Descripción de los cambios realizados"

# 5. Sube los cambios a GitHub
git push

# GitHub Pages actualizará automáticamente el sitio en 1-2 minutos
```

### Para ver el historial de commits:

```powershell
git log --oneline
```

### Para descargar cambios de GitHub (si trabajas desde otro equipo):

```powershell
git pull
```

## ⚠️ PROBLEMAS COMUNES

### Problema: "Permission denied"
**Solución**: Necesitas configurar autenticación. Usa un Personal Access Token como se explicó arriba.

### Problema: El sitio no se ve bien en GitHub Pages
**Solución**: 
- Espera 2-5 minutos, GitHub Pages puede tardar en actualizar
- Verifica que la configuración de Pages apunte a la rama correcta (`main` o `master`)
- Abre la consola del navegador (F12) para ver si hay errores de carga de recursos

### Problema: Errores 404 en imágenes o CSS
**Solución**: 
- Las rutas deben ser relativas (como `assets/images/...`)
- NO uses rutas absolutas como `/assets/...` o `C:/Users/...`
- Verifica que todos los archivos estén en el repositorio con `git status`

## 📱 CONTACTO Y SOPORTE

Si tienes problemas:
1. Revisa los mensajes de error en la consola del navegador (F12)
2. Verifica el estado de GitHub Pages en Settings > Pages
3. Consulta la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages)

---

**¡Listo!** Tu sitio estará disponible en `https://tu-usuario.github.io/TheFinder25/`
