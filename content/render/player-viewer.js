/* 
VISOR DE JUGADORES - LÓGICA
Usa mi renderizador personalizado de Minecraft*/

// Referencias DOM
const playerViewerOverlay = document.getElementById('player-viewer-overlay');
const closePlayerViewer = document.getElementById('close-player-viewer');
const playerNameDisplay = document.getElementById('player-name-display');
const playerInfoContent = document.getElementById('player-info-content');

// Abrir visor de jugador
function openPlayerViewer(playerId) {
    const playerData = getPlayerData(playerId);

    if (!playerData) {
        console.error('No se encontraron datos para el jugador:', playerId);
        return;
    }

    console.log('Abriendo visor para:', playerData.name);

    // Actualizar nombre
    if (playerNameDisplay) {
        playerNameDisplay.textContent = playerData.name;
    }

    // Actualizar información de los personajes (TESTEO)
    if (playerInfoContent) {
        playerInfoContent.innerHTML = `
            <div class="player-info-section">
                <div class="player-info-title">Rol</div>
                <div class="player-info-content">${playerData.role}</div>
            </div>
            
            <div class="player-info-section">
                <div class="player-info-title">Estadísticas</div>
                <div class="player-info-content">
                    <div class="player-stat-row">
                        <span class="player-stat-label">Kills:</span>
                        <span class="player-stat-value">${playerData.kills}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Deaths:</span>
                        <span class="player-stat-value">${playerData.deaths}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">Wins:</span>
                        <span class="player-stat-value">${playerData.wins}</span>
                    </div>
                    <div class="player-stat-row">
                        <span class="player-stat-label">K/D Ratio:</span>
                        <span class="player-stat-value">${(playerData.kills / Math.max(playerData.deaths, 1)).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div class="player-info-section">
                <div class="player-info-title">Equipo</div>
                <div class="player-info-content">${playerData.team}</div>
            </div>
            
            <div class="player-info-section">
                <div class="player-info-title">Estado</div>
                <div class="player-info-content">${playerData.status}</div>
            </div>
            
            <div class="player-info-section">
                <div class="player-info-title">Descripción</div>
                <div class="player-description">${playerData.description}</div>
            </div>
        `;
    }

    // Inicializar renderizador personalizado de Minecraft
    if (typeof initMinecraftSkinRenderer === 'function') {
        initMinecraftSkinRenderer(playerData.skinFile);
    } else {
        console.error('Renderizador de Minecraft no disponible');
    }

    // Mostrar overlay
    if (playerViewerOverlay) {
        playerViewerOverlay.classList.add('active');
    }
}

// Cerrar visor
if (closePlayerViewer && playerViewerOverlay) {
    closePlayerViewer.addEventListener('click', function () {
        playerViewerOverlay.classList.remove('active');
        if (typeof disposeMinecraftSkinRenderer === 'function') {
            disposeMinecraftSkinRenderer();
        }
    });
}

// Cerrar al hacer click fuera del panel
if (playerViewerOverlay) {
    playerViewerOverlay.addEventListener('click', function (e) {
        if (e.target === playerViewerOverlay) {
            playerViewerOverlay.classList.remove('active');
            if (typeof disposeMinecraftSkinRenderer === 'function') {
                disposeMinecraftSkinRenderer();
            }
        }
    });
}

console.log('Player viewer cargado');
