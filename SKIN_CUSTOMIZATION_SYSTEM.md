# Sistema de Personalización de Skins

## 📋 Descripción

Se ha agregado un sistema completo de personalización de skins de Minecraft al **visor de estadísticas del jugador**. Los jugadores ahora pueden cambiar su skin de dos formas:

1. **📁 Subir desde archivo local** - Cargar un archivo PNG de skin de Minecraft
2. **🆔 Cargar por UUID** - Obtener automáticamente la skin desde los servidores de Mojang usando el UUID del jugador

## 🔐 Seguridad

El sistema **requiere autenticación con contraseña** del libro personal:
- Si el libro del jugador tiene contraseña establecida, se solicitará antes de permitir el cambio de skin
- Solo el jugador que conoce la contraseña puede modificar su skin
- Sin contraseña, el cambio de skin es libre

## ✨ Características

### Interfaz
- Botón **"👤 Cambiar Skin"** en el **visor de jugador** (debajo del nombre y modelo 3D)
- Panel modal elegante con dos opciones de carga
- Vista previa de la skin antes de aplicarla
- Mensajes de error y éxito claros
- Protección con contraseña integrada

### Funcionalidades
- ✅ **Subir archivo PNG**: Valida dimensiones (64x64 o 64x32), formato PNG
- ✅ **Cargar por UUID**: Obtiene la skin directamente desde Mojang
- ✅ **Vista previa**: Muestra la skin antes de confirmar
- ✅ **Persistencia**: Guarda la skin en localStorage
- ✅ **Restaurar original**: Botón para volver a la skin por defecto
- ✅ **Actualización automática**: El avatar en el selector de jugadores se actualiza

## 🎨 Archivos Modificados/Creados

### Nuevos Archivos
- **`skin-manager.js`** - Sistema completo de gestión de skins
  - Funciones de carga, validación y guardado
  - Integración con API de Mojang
  - Manejo de localStorage
  - Verificación de contraseña integrada

### Archivos Modificados
- **`index.html`**
  - Agregado botón de skin al player viewer (línea 89)
  - Agregado overlay completo de carga de skins (líneas 125-165)
  - Agregado script `skin-manager.js` (línea 212)
  - **Eliminado** botón de skin del panel del libro

- **`styles.css`**
  - Estilos para `.change-skin-btn` (botón en el player viewer)
  - Estilos completos para `.skin-upload-overlay` y todos sus componentes
  - ~240 líneas nuevas de CSS

- **`interactives.js`**
  - Modificado `generatePlayerHeadsGrid()` para usar skins personalizadas
  - Verifica si existe `getCustomSkin()` y la usa si está disponible

- **`render/player-viewer.js`**
  - Agregada variable global `currentViewedPlayerId` para track del jugador actual
  - Modificada `openPlayerViewer()` para guardar el ID del jugador
  - Limpieza del ID cuando se cierra el viewer

## 🔧 Uso

### Para el Jugador

1. Haz clic en el botón de esmeralda (costado izquierdo) para abrir el sidebar de jugadores
2. Haz clic en el avatar de cualquier jugador para abrir su **visor de estadísticas**
3. En el visor, haz clic en el botón **"👤 Cambiar Skin"** (debajo del modelo 3D y nombre)
4. **Si el libro tiene contraseña**: Se te pedirá ingresarla antes de continuar
5. Elige una opción:

#### Opción A: Subir desde Archivo
1. Clic en "Seleccionar Archivo"
2. Elige un archivo PNG de skin de Minecraft (64x64 o 64x32px)
3. Verifica la vista previa
4. Clic en "Aplicar Skin"

#### Opción B: Cargar por UUID
1. Ingresa el UUID de Minecraft (con o sin guiones)
   - Ejemplo: `069a79f4-44e9-4726-a5be-fca90e38aaf5`
   - O: `069a79f444e94726a5befca90e38aaf5`
2. Clic en "Cargar Skin"
3. Verifica la vista previa (mostrará el nombre del jugador)
4. Clic en "Aplicar Skin"

#### Restaurar Skin Original
- Clic en "Restaurar Skin Original" para volver a tu skin por defecto

### Para Desarrolladores

#### Obtener UUID de un Jugador

Puedes obtener el UUID usando la API de Mojang:
```javascript
// Por nombre de usuario
fetch('https://api.mojang.com/users/profiles/minecraft/USERNAME')
  .then(r => r.json())
  .then(data => console.log(data.id)); // UUID sin guiones
```

#### API Pública

El sistema expone las siguientes funciones globales:

```javascript
// Abrir el panel de carga de skins
window.openSkinUploadOverlay();

// Cerrar el panel
window.closeSkinUploadOverlay();

// Obtener skin personalizada de un jugador (retorna null si no tiene)
window.getCustomSkin(playerIndex);
```

## 💾 Almacenamiento

Las skins personalizadas se guardan en **localStorage** con la clave:
```
player_custom_skin_${playerIndex}
```

El valor es un **Data URL** (base64) de la imagen PNG.

### Ejemplo de Entrada en localStorage:
```
Key: player_custom_skin_0
Value: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

## 🔐 Seguridad

- ✅ Validación de formato de imagen (solo PNG)
- ✅ Validación de dimensiones (64x64 o 64x32)
- ✅ Límites de tamaño de localStorage (~5-10MB)
- ⚠️ CORS: La API de Mojang permite requests desde cualquier origen
- ⚠️ Las skins se guardan localmente (no se sincronizan entre dispositivos)

## 🌐 API de Mojang Utilizada

El sistema usa las siguientes endpoints de Mojang:

1. **Obtener perfil del jugador**
   ```
   GET https://sessionserver.mojang.com/session/minecraft/profile/{UUID}
   ```
   - Retorna: Información del perfil incluyendo texturas

2. **Estructura de Respuesta**
   ```json
   {
     "id": "UUID",
     "name": "PlayerName",
     "properties": [
       {
         "name": "textures",
         "value": "BASE64_ENCODED_JSON"
       }
     ]
   }
   ```

3. **Texturas Decodificadas** (Base64)
   ```json
   {
     "textures": {
       "SKIN": {
         "url": "http://textures.minecraft.net/texture/..."
       }
     }
   }
   ```

## 🐛 Manejo de Errores

El sistema maneja los siguientes errores:

- ❌ Archivo no es PNG
- ❌ Dimensiones incorrectas (no 64x64 ni 64x32)
- ❌ UUID no encontrado
- ❌ Error de red al cargar desde Mojang
- ❌ Error al guardar en localStorage (límite excedido)

Todos los errores se muestran al usuario en el panel con estilo de Minecraft.

## 📱 Compatibilidad

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Navegadores móviles
- ⚠️ Requiere localStorage habilitado

## 🎯 Características Futuras (Posibles)

- [ ] Sincronización de skins entre dispositivos (requiere backend)
- [ ] Galería de skins preestablecidas
- [ ] Editor de skins en línea
- [ ] Importar skin desde nombre de usuario (no solo UUID)
- [ ] Historial de skins usadas

## 💡 Notas Técnicas

### Renderizado de Skins
Las skins de Minecraft tienen dos capas:
1. **Capa base** (cara): Posición UV `14.286% 14.286%`
2. **Capa overlay** (sombrero/accesorios): Posición UV `71.429% 14.286%`

Ambas se renderizan con `image-rendering: pixelated` para mantener el estilo de Minecraft.

### Formato de Skin de Minecraft
- **64x64**: Formato completo con overlay
- **64x32**: Formato antiguo sin overlay (se soporta por compatibilidad)

---

**Fecha de Implementación**: 2025-12-06  
**Versión**: 1.0.0  
**Autor**: Sistema de personalización para UHC Mindustry 2025
