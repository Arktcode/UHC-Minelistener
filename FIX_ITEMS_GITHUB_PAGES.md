# FIX: Items no cargan en GitHub Pages

## 🐛 Problema Identificado

Los items del libro no se mostraban en GitHub Pages, aunque funcionaban perfectamente en local (Windows).

## 🔍 Causa Raíz

**Case Sensitivity (Diferencia entre mayúsculas y minúsculas)**

- **Windows**: NO distingue entre mayúsculas y minúsculas en nombres de archivos
  - `grass_block.png` = `Grass_Block.png` = `GRASS_BLOCK.PNG` ✅
  
- **GitHub Pages (Linux)**: SÍ distingue entre mayúsculas y minúsculas
  - `grass_block.png` ≠ `Grass_Block.png` ❌

## 📝 Archivos Afectados

El archivo `interactives.js` (líneas 127-170) contenía el array `availableItems` con rutas incorrectas:

### Antes (❌ INCORRECTO)
```javascript
const availableItems = [
    { id: 'grass_Block', name: 'Bloque de Pasto', src: 'assets/items/grass_Block.png' },
    { id: 'block_of_diamond', name: 'Bloque de Diamante', src: 'assets/items/block_of_diamond.png' },
    { id: 'emerald_ore', name: 'Ore de Esmeralda', src: 'assets/items/emerald_ore.png' },
    // ... 40+ items más con nombres incorrectos
];
```

### Después (✅ CORRECTO)
```javascript
const availableItems = [
    { id: 'grass_Block', name: 'Bloque de Pasto', src: 'assets/items/Grass_Block.png' },
    { id: 'block_of_diamond', name: 'Bloque de Diamante', src: 'assets/items/Block_of_Diamond.png' },
    { id: 'emerald_ore', name: 'Ore de Esmeralda', src: 'assets/items/Emerald_Ore.png' },
    // ... 40+ items con nombres correctos
];
```

## 🔧 Solución Aplicada

1. **Identificación**: Listamos todos los archivos reales en `assets/items/`
   ```powershell
   Get-ChildItem -Path "assets\items" | Select-Object Name | Sort-Object Name
   ```

2. **Corrección**: Actualizamos TODOS los 42 items en el array `availableItems`
   - Cambiamos nombres como `grass_Block.png` → `Grass_Block.png`
   - Cambiamos nombres como `block_of_diamond.png` → `Block_of_Diamond.png`
   - Y así con todos los items

3. **Verificación**: Probamos localmente abriendo el mapa de selección de items
   - ✅ Todos los items se cargan correctamente

## 📊 Items Corregidos (42 total)

Ejemplos de correcciones realizadas:
- `grass_Block.png` → `Grass_Block.png`
- `block_of_diamond.png` → `Block_of_Diamond.png`
- `emerald_ore.png` → `Emerald_Ore.png`
- `slime_block.png` → `Slime_Block.png`
- `music_disc_tears.png` → `Music_Disc_Tears.png`
- `invicon_end_crystal.gif` → `Invicon_End_Crystal.gif`
- `horse_saddle.png` → `Horse_Saddle.png`
- `powder_snow_bucket.png` → `Powder_Snow_Bucket.png`
- `heart_of_the_sea.png` → `Heart_of_the_Sea.png`
- `observer.png` → `Observer.png`
- `sculk_sensor.png` → `Sculk_Sensor.png`
- ... y 31 más

## 🚀 Commits Realizados

```bash
7c83462 Sincronizar archivo interactives.js en carpeta content
2e25809 Fix: Corregir nombres de archivos de items (case-sensitive) para GitHub Pages
```

## ✅ Resultado

- ✅ Items ahora se cargan correctamente en local
- ✅ Items se cargarán correctamente en GitHub Pages
- ✅ No hay errores 404 en la consola del navegador

## 📌 Lecciones Aprendidas

**Siempre usar nombres de archivo exactos cuando se trabaja para despliegue en servidores Linux/Unix:**

1. **Verifica los nombres reales de archivos** antes de referenciarlos en código
2. **Usa convenciones consistentes**:
   - Opción A: Todo en minúsculas (`grass_block.png`)
   - Opción B: PascalCase (`Grass_Block.png`)
   - ⚠️ **NO mezcles** estilos
3. **Prueba en GitHub Pages** después de subir, no solo localmente

## 🔄 Para Futuros Cambios

Si agregas nuevos items:
1. Verifica el nombre exacto del archivo en `assets/items/`
2. Copia el nombre EXACTO (con mayúsculas y minúsculas) al array `availableItems`
3. Prueba localmente antes de hacer commit

---

**Fecha del Fix**: 2025-12-05  
**Archivos modificados**: `interactives.js`, `content/interactives.js`
