let isSidebarOpen = false;


const toggleBtn = document.getElementById('toggleBtn');
const sidebar = document.getElementById('sidebar');
const bookToggleBtn = document.getElementById('bookToggleBtn');
const playerSelectorOverlay = document.getElementById('player-selector-overlay');
const closePlayerSelector = document.getElementById('close-player-selector');
const playerHeadsGrid = document.getElementById('player-heads-grid');

if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
        isSidebarOpen = !isSidebarOpen;

        sidebar.classList.toggle('open');
        toggleBtn.classList.toggle('sidebar-open');

        if (bookToggleBtn) {
            bookToggleBtn.classList.toggle('sidebar-open');
        }
    });
}

if (bookToggleBtn && playerSelectorOverlay) {
    bookToggleBtn.addEventListener('click', function () {
        generatePlayerHeadsGrid();
        playerSelectorOverlay.classList.add('active');
    });
}

if (closePlayerSelector && playerSelectorOverlay) {
    closePlayerSelector.addEventListener('click', function () {
        playerSelectorOverlay.classList.remove('active');
    });
}

function generatePlayerHeadsGrid() {
    if (!playerHeadsGrid) return;

    playerHeadsGrid.innerHTML = '';

    if (typeof playersData !== 'undefined' && playersData.length > 0) {
        playersData.forEach((player) => {
            const playerBox = document.createElement('div');
            playerBox.className = 'player-head-box';

            const headContainer = document.createElement('div');
            headContainer.className = 'player-head-preview';

            let skinUrl = `assets/skins/${player.skinFile}`;
            if (typeof getCustomSkin === 'function') {
                const customSkin = getCustomSkin(player.id);
                if (customSkin) {
                    skinUrl = customSkin;
                }
            }

            headContainer.style.backgroundImage = `url('${skinUrl}')`;
            headContainer.style.backgroundSize = '800%';
            headContainer.style.backgroundPosition = '14.286% 14.286%';
            headContainer.style.imageRendering = 'pixelated';

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

            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.name;

            playerBox.appendChild(headContainer);
            playerBox.appendChild(nameSpan);

            if (window.bookAuth && window.bookAuth.hasPassword(player.id)) {
                playerBox.classList.add('locked');
            }
            playerBox.addEventListener('click', function () {
                playerSelectorOverlay.classList.remove('active');

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
    { id: 'grass_Block', name: 'Bloque de Pasto', src: 'assets/items/Grass_Block.png' },
    { id: 'block_of_diamond', name: 'Bloque de Diamante', src: 'assets/items/Block_of_Diamond.png' },
    { id: 'netherithe_hoe', name: 'Azada de Netherite', src: 'assets/items/Enchanted_Netherite_Hoe.gif' },
    { id: 'emerald_ore', name: 'Ore de Esmeralda', src: 'assets/items/Emerald_Ore.png' },
    { id: 'slime_block', name: 'Bloque de Slime', src: 'assets/items/Slime_Block.png' },
    { id: 'music_disc_tears', name: 'Discos de Musica Tears', src: 'assets/items/Music_Disc_Tears.png' },
    { id: 'bottle_o_enchanting', name: 'Botella de Encantamiento', src: 'assets/items/Bottle_o_Enchanting.gif' },
    { id: 'invicon_end_crystal', name: 'Cristal del End', src: 'assets/items/Invicon_End_Crystal.gif' },
    { id: 'horse_saddle', name: 'Silla de Caballo', src: 'assets/items/Horse_Saddle.png' },
    { id: 'powder_snow_bucket', name: 'Bote de nieve', src: 'assets/items/Powder_Snow_Bucket.png' },
    { id: 'hearth_of_the_sea', name: 'Corazon del mar', src: 'assets/items/Heart_of_the_Sea.png' },
    { id: 'TNT', name: 'TNT', src: 'assets/items/TNT.png' },
    { id: 'observer', name: 'Observador', src: 'assets/items/Observer.png' },
    { id: 'sculk_sensor', name: 'Sensor de Sculk', src: 'assets/items/Sculk_Sensor.png' },
    { id: 'bee_nest', name: 'Panal de abejas', src: 'assets/items/Bee_Nest.png' },
    { id: 'blue_ice', name: 'Hielo azul', src: 'assets/items/Blue_Ice.png' },
    { id: 'respawn_anchor', name: 'Nexo de reaparicion', src: 'assets/items/Respawn_Anchor.png' },
    { id: 'invicon_soul_campfire', name: 'Fogata de arena de almas', src: 'assets/items/Invicon_Soul_Campfire.png' },
    { id: 'pufferfish', name: 'Pez globo', src: 'assets/items/Pufferfish.png' },
    { id: 'invicon_bucket_of_axolotl', name: 'Ajolote en una cubeta', src: 'assets/items/Invicon_Bucket_of_Axolotl.png' },
    { id: 'mycelium', name: 'Micelio', src: 'assets/items/Mycelium.png' },
    { id: 'tinted_glass', name: 'Cristal opaco', src: 'assets/items/Tinted_Glass.png' },
    { id: 'crossbow', name: 'Ballesta', src: 'assets/items/Crossbow.png' },
    { id: 'wither_skeleton_skull', name: 'Cabeza de esqueleto con wither', src: 'assets/items/Wither_Skeleton_Skull.png' },
    { id: 'splash_potion_of_regeneration', name: 'Poción de regeneración', src: 'assets/items/Splash_Potion_of_Regeneration.png' },
    { id: 'eye_of_ender', name: 'Ojo de ender', src: 'assets/items/Eye_of_Ender.png' },
    { id: 'ominous_bottle', name: 'Botella oscura', src: 'assets/items/Ominous_Bottle.png' },
    { id: 'nametag', name: 'Etiqueta', src: 'assets/items/Name_Tag.png' },
    { id: 'enchanted_book', name: 'Libro de Reparacion', src: 'assets/items/Enchanted_Book.gif' },
    { id: 'fire_charge', name: 'Carga de fuego', src: 'assets/items/Fire_Charge.png' },
    { id: 'splash_potion_of_weakness', name: 'Poción de debilidad', src: 'assets/items/Splash_Potion_of_Weakness.png' },
    { id: 'dried_ghast', name: 'Ghast seco', src: 'assets/items/Dried_Ghast.png' },
    { id: 'gilded_blackstone', name: 'Piedra Negra Aurea', src: 'assets/items/Gilded_Blackstone.png' },
    { id: 'cobweb', name: 'Telaraña', src: 'assets/items/Cobweb.png' },
    { id: 'pale_oak_sapling', name: 'Arbol de roble pálido', src: 'assets/items/Pale_Oak_Sapling.png' },
    { id: 'red_mushroom_block', name: 'Bloque de champiñón rojo', src: 'assets/items/Red_Mushroom_Block.png' },
    { id: 'rabbit_foot', name: 'Pata de conejo', src: 'assets/items/Rabbit_Foot.png' },
    { id: 'enderchest', name: 'Cofre de ender', src: 'assets/items/Ender_Chest.png' },
    { id: 'wind_charge', name: 'Carga de viento', src: 'assets/items/Wind_Charge.png' },
    { id: 'pottery_sherd', name: 'Fragmento de cerámica', src: 'assets/items/Pottery_Sherd.png' },
    { id: 'turtle_shell', name: 'Casco de Tortuga', src: 'assets/items/Turtle_Shell.png' },
    { id: 'wolf_armor', name: 'Armadura de lobo', src: 'assets/items/Wolf_Armor.png' },
];

let currentBoxIndex = -1;
let currentPlayerIndex = -1;

const mapOverlay = document.getElementById('map-overlay');
const mapItemsGrid = document.getElementById('map-items-grid');
const closeMapBtn = document.getElementById('close-map');

function initBookItemsGrid(playerIndex) {
    const itemsContainer = document.getElementById('book-items-container');
    if (!itemsContainer) {
        return;
    }

    currentPlayerIndex = playerIndex;

    itemsContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const box = document.createElement('div');
        box.className = 'item-box';
        box.dataset.index = i;

        const savedItemId = loadItem(playerIndex, i);
        if (savedItemId) {
            const item = availableItems.find(it => it.id === savedItemId);
            if (item) {
                box.style.backgroundImage = `url('${item.src}')`;
                box.title = item.name;
            }
        }

        box.addEventListener('click', function () {
            openMapSelection(playerIndex, i);
        });

        itemsContainer.appendChild(box);
    }
}

function openMapSelection(playerIndex, boxIndex) {
    if (!mapOverlay || !mapItemsGrid) {
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
    if (typeof window.saveGlobalItem === 'function') {
        window.saveGlobalItem(playerIndex, boxIndex, itemId);
    } else {
        // Fallback local si Firebase no está listo
        try {
            if (itemId) {
                localStorage.setItem(`player_item_${playerIndex}_${boxIndex}`, itemId);
            } else {
                localStorage.removeItem(`player_item_${playerIndex}_${boxIndex}`);
            }
        } catch (e) { }
    }
}

function loadItem(playerIndex, boxIndex) {
    if (typeof window.getGlobalItem === 'function') {
        // Intentar obtener global (prioridad)
        const globalItem = window.getGlobalItem(playerIndex, boxIndex);
        if (globalItem !== undefined) return globalItem; // Puede ser null
    }

    // Fallback lectura local
    try {
        return localStorage.getItem(`player_item_${playerIndex}_${boxIndex}`);
    } catch (e) {
        return null;
    }
}


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
});

window.initBookItemsGrid = initBookItemsGrid;

