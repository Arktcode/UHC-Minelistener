// VISOR DE JUGADORES

let currentViewedPlayerId = -1;

const playerViewerOverlay = document.getElementById('player-viewer-overlay');
const closePlayerViewer = document.getElementById('close-player-viewer');
const playerNameDisplay = document.getElementById('player-name-display');
const playerInfoContent = document.getElementById('player-info-content');

function openPlayerViewer(playerId) {
    const playerData = getPlayerData(playerId);

    if (!playerData) {
        return;
    }

    currentViewedPlayerId = playerId;

    if (playerNameDisplay) {
        playerNameDisplay.textContent = playerData.name;
    }

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

    if (playerViewerOverlay) {
        playerViewerOverlay.classList.add('active');
    }

    setTimeout(() => {
        if (typeof initMinecraftSkinRenderer === 'function') {
            let skinToLoad = playerData.skinFile; // Default path (loaded by renderer with assets/skins prefix if not data url)

            // Intentar cargar skin personalizada
            if (typeof getCustomSkin === 'function') {
                const customSkin = getCustomSkin(playerId);
                if (customSkin) {
                    skinToLoad = customSkin;
                }
            } else {
                try {
                    const customSkin = localStorage.getItem(`player_custom_skin_${playerId}`);
                    if (customSkin) skinToLoad = customSkin;
                } catch (e) { }
            }

            initMinecraftSkinRenderer(skinToLoad);
        }
    }, 100);
}

if (closePlayerViewer && playerViewerOverlay) {
    closePlayerViewer.addEventListener('click', function () {
        playerViewerOverlay.classList.remove('active');
        currentViewedPlayerId = -1;
        if (typeof disposeMinecraftSkinRenderer === 'function') {
            disposeMinecraftSkinRenderer();
        }
    });
}

if (playerViewerOverlay) {
    playerViewerOverlay.addEventListener('click', function (e) {
        if (e.target === playerViewerOverlay) {
            playerViewerOverlay.classList.remove('active');
            currentViewedPlayerId = -1;
            if (typeof disposeMinecraftSkinRenderer === 'function') {
                disposeMinecraftSkinRenderer();
            }
        }
    });
}
