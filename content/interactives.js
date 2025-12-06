/* ========================================
   ELEMENTOS INTERACTIVOS Y SISTEMA DE ITEMS
   Fusión de: interactives.js + items.js
   ======================================== */

/* ========================================
   SIDEBAR Y CONTROLES INTERACTIVOS
   ======================================== */

// Estado del sidebar
let isSidebarOpen = false;

// Referencias a elementos del DOM
const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.getElementById('sidebar');
const bookToggleBtn = document.getElementById('bookToggleBtn');
const playerSelectorOverlay = document.getElementById('player-selector-overlay');
const closePlayerSelector = document.getElementById('close-player-selector');
const playerHeadsGrid = document.getElementById('player-heads-grid');

// Toggle sidebar con el botón de esmeralda
if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
        // Toggle estado
        isSidebarOpen = !isSidebarOpen;

        // Aplicar clases
        sidebar.classList.toggle('open');
        toggleBtn.classList.toggle('sidebar-open');

        // Mover también el botón del libro
        if (bookToggleBtn) {
            bookToggleBtn.classList.toggle('sidebar-open');
        }

        console.log('Sidebar:', isSidebarOpen ? 'abierto' : 'cerrado');
    });
}

// Toggle selector de jugadores con el botón de Book_and_Quill
if (bookToggleBtn && playerSelectorOverlay) {
    bookToggleBtn.addEventListener('click', function () {
        console.log('Abriendo selector de jugadores');

        // Genera los grid de cabezas de jugadores porque me da flojera meter .png(s) Extra
        generatePlayerHeadsGrid();

        playerSelectorOverlay.classList.add('active');
    });
}

// Cerrar selector de jugadores
if (closePlayerSelector && playerSelectorOverlay) {
    closePlayerSelector.addEventListener('click', function () {
        playerSelectorOverlay.classList.remove('active');
    });
}

// Genera el grid de cabezas de jugadores usando el array playersData
function generatePlayerHeadsGrid() {
    if (!playerHeadsGrid) return;

    playerHeadsGrid.innerHTML = '';

    // Obtener jugadores de players-data.js
    if (typeof playersData !== 'undefined' && playersData.length > 0) {
        playersData.forEach((player) => {
            const playerBox = document.createElement('div');
            playerBox.className = 'player-head-box';

            //(reemplaza a la imagen estática)
            const headContainer = document.createElement('div');
            headContainer.className = 'player-head-preview';

            const skinUrl = `assets/skins/${player.skinFile}`;

            //(Cara)
            headContainer.style.backgroundImage = `url('${skinUrl}')`;
            headContainer.style.backgroundSize = '800%';
            headContainer.style.backgroundPosition = '14.286% 14.286%';
            headContainer.style.imageRendering = 'pixelated';

            //(Hat layer)
            const hatLayer = document.createElement('div');
            hatLayer.style.position = 'absolute';
            hatLayer.style.top = '0';
            hatLayer.style.left = '0';
            hatLayer.style.width = '100%';
            hatLayer.style.height = '100%';
            hatLayer.style.backgroundImage = `url('${skinUrl}')`;
            hatLayer.style.backgroundSize = '800%';
            hatLayer.style.backgroundPosition = '71.429% 14.286%';
            hatLayer.style.imageRendering = 'pixelated';

            headContainer.appendChild(hatLayer);

            // Nombre del jugador
            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.name;

            playerBox.appendChild(headContainer);
            playerBox.appendChild(nameSpan);

            // Agregar indicador de candado si tiene contraseña o no
            if (window.bookAuth && window.bookAuth.hasPassword(player.id)) {
                playerBox.classList.add('locked');
            }

            // Click para abrir libro de este jugador (Re-ORGANIZADO xd)
            playerBox.addEventListener('click', function () {
                console.log('Abriendo libro de:', player.name);
                playerSelectorOverlay.classList.remove('active');

                // Abre el libro del jugador player.id
                if (typeof openBook === 'function') {
                    openBook(player.id, player.name);
                }
            });

            playerHeadsGrid.appendChild(playerBox);
        });
    } else {
        playerHeadsGrid.innerHTML = '<p style="color: #3d2817; text-align: center;">No hay jugadores disponibles</p>';
    }
}

const availableItems = [
    { id: 'grass_Block', name: 'Bloque de Pasto', src: 'assets/items/grass_Block.png' },
    { id: 'block_of_diamond', name: 'Bloque de Diamante', src: 'assets/items/block_of_diamond.png' },
    { id: 'netherithe_hoe', name: 'Azada de Netherite', src: 'assets/items/Enchanted_Netherite_Hoe.gif' },
    { id: 'emerald_ore', name: 'Ore de Esmeralda', src: 'assets/items/emerald_ore.png' },
    { id: 'slime_block', name: 'Bloque de Slime', src: 'assets/items/slime_block.png' },
    { id: 'music_disc_tears', name: 'Discos de Musica Tears', src: 'assets/items/music_disc_tears.png' },
    { id: 'bottle_o_enchanting', name: 'Botella de Encantamiento', src: 'assets/items/Bottle_o_Enchanting.gif' },
    { id: 'invicon_end_crystal', name: 'Cristal del End', src: 'assets/items/invicon_end_crystal.gif' },
    { id: 'horse_saddle', name: 'Silla de Caballo', src: 'assets/items/horse_saddle.png' },
    { id: 'powder_snow_bucket', name: 'Bote de nieve', src: 'assets/items/powder_snow_bucket.png' },
    { id: 'hearth_of_the_sea', name: 'Corazon del mar', src: 'assets/items/heart_of_the_sea.png' },
    { id: 'TNT', name: 'TNT', src: 'assets/items/TNT.png' },
    { id: 'observer', name: 'Observador', src: 'assets/items/observer.png' },
    { id: 'sculk_sensor', name: 'Sensor de Sculk', src: 'assets/items/sculk_sensor.png' },
    { id: 'bee_nest', name: 'Panal de abejas', src: 'assets/items/Bee_nest.png' },
    { id: 'blue_ice', name: 'Hielo azul', src: 'assets/items/blue_ice.png' },
    { id: 'respawn_anchor', name: 'Nexo de reaparicion', src: 'assets/items/respawn_anchor.png' },
    { id: 'invicon_soul_campfire', name: 'Fogata de arena de almas', src: 'assets/items/invicon_soul_campfire.png' },
    { id: 'pufferfish', name: 'Pez globo', src: 'assets/items/pufferfish.png' },
    { id: 'invicon_bucket_of_axolotl', name: 'Ajolote en una cubeta', src: 'assets/items/invicon_bucket_of_axolotl.png' },
    { id: 'mycelium', name: 'Micelio', src: 'assets/items/mycelium.png' },
    { id: 'tinted_glass', name: 'Cristal opaco', src: 'assets/items/tinted_glass.png' },
    { id: 'crossbow', name: 'Ballesta', src: 'assets/items/crossbow.png' },
    { id: 'wither_skeleton_skull', name: 'Cabeza de esqueleto con wither', src: 'assets/items/wither_skeleton_skull.png' },
    { id: 'splash_potion_of_regeneration', name: 'Poción de regeneración', src: 'assets/items/splash_potion_of_regeneration.png' },
    { id: 'eye_of_ender', name: 'Ojo de ender', src: 'assets/items/eye_of_ender.png' },
    { id: 'ominous_bottle', name: 'Botella oscura', src: 'assets/items/ominous_bottle.png' },
    { id: 'nametag', name: 'Etiqueta', src: 'assets/items/name_tag.png' },
    { id: 'enchanted_book', name: 'Libro de Reparacion', src: 'assets/items/enchanted_book.gif' },
    { id: 'fire_charge', name: 'Carga de fuego', src: 'assets/items/fire_charge.png' },
    { id: 'splash_potion_of_weakness', name: 'Poción de debilidad', src: 'assets/items/splash_potion_of_weakness.png' },
    { id: 'dried_ghast', name: 'Ghast seco', src: 'assets/items/dried_ghast.png' },
    { id: 'gilded_blackstone', name: 'Piedra Negra Aurea', src: 'assets/items/gilded_blackstone.png' },
    { id: 'cobweb', name: 'Telaraña', src: 'assets/items/cobweb.png' },
    { id: 'pale_oak_sapling', name: 'Arbol de roble pálido', src: 'assets/items/pale_oak_sapling.png' },
    { id: 'red_mushroom_block', name: 'Bloque de champiñón rojo', src: 'assets/items/red_mushroom_block.png' },
    { id: 'rabbit_foot', name: 'Pata de conejo', src: 'assets/items/rabbit_foot.png' },
    { id: 'enderchest', name: 'Cofre de ender', src: 'assets/items/ender_chest.png' },
    { id: 'wind_charge', name: 'Carga de viento', src: 'assets/items/wind_charge.png' },
    { id: 'pottery_sherd', name: 'Fragmento de cerámica', src: 'assets/items/pottery_sherd.png' },
    { id: 'turtle_shell', name: 'Casco de Tortuga', src: 'assets/items/turtle_shell.png' },
    { id: 'wolf_armor', name: 'Armadura de lobo', src: 'assets/items/wolf_armor.png' },
];

let currentBoxIndex = -1;
let currentPlayerIndex = -1;

const mapOverlay = document.getElementById('map-overlay');
const mapItemsGrid = document.getElementById('map-items-grid');
const closeMapBtn = document.getElementById('close-map');

// Inicializar grid de items en el libro (página derecha - 6 boxes en grid 3x2)
function initBookItemsGrid(playerIndex) {
    const itemsContainer = document.getElementById('book-items-container');
    if (!itemsContainer) {
        console.warn('book-items-container no encontrado');
        return;
    }

    // Guardar el índice del jugador actual
    currentPlayerIndex = playerIndex;

    itemsContainer.innerHTML = '';

    // Crear 6 recuadros (3 columnas x 2 filas)
    for (let i = 0; i < 6; i++) {
        const box = document.createElement('div');
        box.className = 'item-box';
        box.dataset.index = i;

        // Cargar item guardado
        const savedItemId = loadItem(playerIndex, i);
        if (savedItemId) {
            const item = availableItems.find(it => it.id === savedItemId);
            if (item) {
                box.style.backgroundImage = `url('${item.src}')`;
                box.title = item.name;
            }
        }

        // Click para la apertura del mapa de seleccion (Re-ORGANIZADO xd)
        box.addEventListener('click', function () {
            openMapSelection(playerIndex, i);
        });

        itemsContainer.appendChild(box);
    }

    console.log('Grid de 6 items inicializado para jugador', playerIndex);
}

function openMapSelection(playerIndex, boxIndex) {
    if (!mapOverlay || !mapItemsGrid) {
        console.warn('Overlay o grid del mapa no encontrado');
        return;
    }

    currentBoxIndex = boxIndex;
    currentPlayerIndex = playerIndex;

    mapItemsGrid.innerHTML = '';

    const removeBox = document.createElement('div');
    removeBox.className = 'map-item-box remove-item';
    removeBox.textContent = '';
    removeBox.title = 'Quitar item';
    removeBox.addEventListener('click', function () {
        saveItem(currentPlayerIndex, currentBoxIndex, null);
        updateBookBox(currentBoxIndex, null);
        closeMap();
    });
    mapItemsGrid.appendChild(removeBox);

    // Genera items disponibles etc etc
    availableItems.forEach(item => {
        const itemBox = document.createElement('div');
        itemBox.className = 'map-item-box';
        itemBox.style.backgroundImage = `url('${item.src}')`;
        itemBox.title = item.name;

        itemBox.addEventListener('click', function () {
            saveItem(currentPlayerIndex, currentBoxIndex, item.id);
            updateBookBox(currentBoxIndex, item);
            closeMap();
        });

        mapItemsGrid.appendChild(itemBox);
    });

    mapOverlay.classList.add('active');
    console.log('Mapa de selección abierto para box', boxIndex);
}

function closeMap() {
    if (mapOverlay) {
        mapOverlay.classList.remove('active');
    }
}

function updateBookBox(boxIndex, item) {
    const boxes = document.querySelectorAll('#book-items-container .item-box');
    if (boxes[boxIndex]) {
        if (item) {
            boxes[boxIndex].style.backgroundImage = `url('${item.src}')`;
            boxes[boxIndex].title = item.name;
        } else {
            boxes[boxIndex].style.backgroundImage = '';
            boxes[boxIndex].title = 'Vacío';
        }
    }
}

function saveItem(playerIndex, boxIndex, itemId) {
    try {
        if (itemId) {
            localStorage.setItem(`player_item_${playerIndex}_${boxIndex}`, itemId);
            console.log(`Item ${itemId} guardado para jugador ${playerIndex}, box ${boxIndex}`);
        } else {
            localStorage.removeItem(`player_item_${playerIndex}_${boxIndex}`);
            console.log(`Item removido para jugador ${playerIndex}, box ${boxIndex}`);
        }
    } catch (e) {
        console.warn('Error guardando item', e);
    }
}

function loadItem(playerIndex, boxIndex) {
    try {
        return localStorage.getItem(`player_item_${playerIndex}_${boxIndex}`);
    } catch (e) {
        return null;
    }
}

/*NICIALIZACIÓN*/

document.addEventListener('DOMContentLoaded', function () {
    if (closeMapBtn) {
        closeMapBtn.addEventListener('click', closeMap);
    }

    if (mapOverlay) {
        mapOverlay.addEventListener('click', function (e) {
            if (e.target === mapOverlay) {
                closeMap();
            }
        });
    }

    console.log('Interactives.js cargado (consolidado)');
});

window.initBookItemsGrid = initBookItemsGrid;
