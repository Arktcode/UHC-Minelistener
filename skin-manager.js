// Sistema de personalización de skins

let pendingSkinData = null;
let currentSkinPlayerIndex = -1;

function openSkinUploadOverlay() {
    const playerId = typeof currentViewedPlayerId !== 'undefined' ? currentViewedPlayerId : -1;

    if (playerId < 0) {
        return;
    }

    if (window.bookAuth && window.bookAuth.hasPassword(playerId)) {

        const playerData = typeof getPlayerData === 'function' ? getPlayerData(playerId) : null;
        const playerName = playerData ? playerData.name : `Jugador ${playerId}`;

        window.bookAuth.showPasswordPrompt(
            playerId,
            playerName,
            () => {
                actuallyOpenSkinUpload(playerId);
            },
            () => {
            }
        );
    } else {
        actuallyOpenSkinUpload(playerId);
    }
}

function actuallyOpenSkinUpload(playerId) {
    currentSkinPlayerIndex = playerId;
    const overlay = document.getElementById('skin-upload-overlay');
    if (overlay) {
        overlay.classList.add('active');
        clearSkinUploadForm();
    }
}

function closeSkinUploadOverlay() {
    const overlay = document.getElementById('skin-upload-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    pendingSkinData = null;
    currentSkinPlayerIndex = -1;
    clearSkinUploadForm();
}

function clearSkinUploadForm() {
    const fileInput = document.getElementById('skin-file-input');
    const fileName = document.getElementById('skin-file-name');
    const uuidInput = document.getElementById('skin-uuid-input');
    const errorMsg = document.getElementById('skin-upload-error');
    const successMsg = document.getElementById('skin-upload-success');
    const previewContainer = document.getElementById('skin-preview-container');
    const applyBtn = document.getElementById('apply-skin-btn');

    if (fileInput) fileInput.value = '';
    if (fileName) fileName.textContent = '';
    if (uuidInput) uuidInput.value = '';
    if (errorMsg) errorMsg.textContent = '';
    if (successMsg) successMsg.textContent = '';
    if (previewContainer) previewContainer.style.display = 'none';
    if (applyBtn) applyBtn.style.display = 'none';

    pendingSkinData = null;
}

function showSkinError(message) {
    const errorMsg = document.getElementById('skin-upload-error');
    const successMsg = document.getElementById('skin-upload-success');
    if (errorMsg) errorMsg.textContent = message;
    if (successMsg) successMsg.textContent = '';
}

function showSkinSuccess(message) {
    const errorMsg = document.getElementById('skin-upload-error');
    const successMsg = document.getElementById('skin-upload-success');
    if (errorMsg) errorMsg.textContent = '';
    if (successMsg) successMsg.textContent = message;
}

function showSkinPreview(dataUrl) {
    const previewContainer = document.getElementById('skin-preview-container');
    const previewImg = document.getElementById('skin-preview-img');
    const applyBtn = document.getElementById('apply-skin-btn');

    if (previewImg && dataUrl) {
        previewImg.src = dataUrl;
        if (previewContainer) previewContainer.style.display = 'block';
        if (applyBtn) applyBtn.style.display = 'inline-block';
    }
}

function handleSkinFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = document.getElementById('skin-file-name');
    if (fileName) fileName.textContent = `Archivo: ${file.name}`;

    if (!file.type.match('image/png')) {
        showSkinError('❌ Solo se permiten archivos PNG');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            if ((img.width === 64 && (img.height === 64 || img.height === 32))) {
                pendingSkinData = e.target.result;
                showSkinPreview(e.target.result);
                showSkinSuccess('✅ Skin cargada correctamente');
            } else {
                showSkinError(`❌ Dimensiones incorrectas: ${img.width}x${img.height}. Debe ser 64x64 o 64x32`);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function loadSkinByUUID() {
    const uuidInput = document.getElementById('skin-uuid-input');
    if (!uuidInput || !uuidInput.value.trim()) {
        showSkinError('❌ Ingresa un UUID válido');
        return;
    }

    const uuid = uuidInput.value.trim().replace(/-/g, '');

    showSkinSuccess('🔄 Cargando skin...');

    try {
        const profileResponse = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);

        if (!profileResponse.ok) {
            throw new Error('UUID no encontrado');
        }

        const profileData = await profileResponse.json();

        const texturesProperty = profileData.properties.find(prop => prop.name === 'textures');
        if (!texturesProperty) {
            throw new Error('No se encontró información de texturas');
        }

        const texturesData = JSON.parse(atob(texturesProperty.value));
        const skinUrl = texturesData.textures.SKIN.url;

        const skinResponse = await fetch(skinUrl);
        const skinBlob = await skinResponse.blob();

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                pendingSkinData = e.target.result;
                showSkinPreview(e.target.result);
                showSkinSuccess(`✅ Skin cargada de ${profileData.name}`);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(skinBlob);

    } catch (error) {
        showSkinError(`❌ Error: ${error.message}`);
    }
}

function applySkin() {
    if (!pendingSkinData || currentSkinPlayerIndex < 0) {
        showSkinError('❌ No hay skin para aplicar');
        return;
    }

    try {
        localStorage.setItem(`player_custom_skin_${currentSkinPlayerIndex}`, pendingSkinData);

        showSkinSuccess('✅ Skin guardada correctamente');

        setTimeout(() => {
            closeSkinUploadOverlay();
            updatePlayerAvatarInSidebar(currentSkinPlayerIndex);
            updatePlayerViewer3DModel(currentSkinPlayerIndex);
        }, 1000);
    } catch (error) {
        showSkinError('❌ Error al guardar la skin');
    }
}

function resetSkin() {
    if (currentSkinPlayerIndex < 0) return;

    try {
        localStorage.removeItem(`player_custom_skin_${currentSkinPlayerIndex}`);

        showSkinSuccess('✅ Skin restaurada al original');

        setTimeout(() => {
            closeSkinUploadOverlay();
            updatePlayerAvatarInSidebar(currentSkinPlayerIndex);
            updatePlayerViewer3DModel(currentSkinPlayerIndex);
        }, 1000);
    } catch (error) {
        showSkinError('❌ Error al restaurar la skin');
    }
}

function updatePlayerAvatarInSidebar(playerIndex) {
    if (typeof generatePlayerHeadsGrid === 'function') {
        generatePlayerHeadsGrid();
    }
}

function updatePlayerViewer3DModel(playerIndex) {
    if (typeof currentViewedPlayerId !== 'undefined' && currentViewedPlayerId === playerIndex) {
        let skinToLoad;
        if (typeof getPlayerData === 'function' && typeof getCustomSkin === 'function') {
            const playerData = getPlayerData(playerIndex);
            const customSkin = getCustomSkin(playerIndex);
            if (customSkin) {
                skinToLoad = customSkin;
            } else {
                skinToLoad = playerData ? playerData.skinFile : null;
            }
            if (skinToLoad && typeof initMinecraftSkinRenderer === 'function') {
                initMinecraftSkinRenderer(skinToLoad);
            }
        }
    }
}

function getCustomSkin(playerIndex) {

    try {
        return localStorage.getItem(`player_custom_skin_${playerIndex}`);
    } catch (error) {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const skinBtn = document.getElementById('change-skin-btn');
    if (skinBtn) {
        skinBtn.addEventListener('click', openSkinUploadOverlay);
    }

    const closeSkinBtn = document.getElementById('close-skin-upload');
    if (closeSkinBtn) {
        closeSkinBtn.addEventListener('click', closeSkinUploadOverlay);
    }

    const uploadFileBtn = document.getElementById('upload-skin-file-btn');
    const fileInput = document.getElementById('skin-file-input');
    if (uploadFileBtn && fileInput) {
        uploadFileBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleSkinFileSelect);
    }

    const loadUuidBtn = document.getElementById('load-skin-uuid-btn');
    if (loadUuidBtn) {
        loadUuidBtn.addEventListener('click', loadSkinByUUID);
    }

    const applyBtn = document.getElementById('apply-skin-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applySkin);
    }

    const resetBtn = document.getElementById('reset-skin-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSkin);
    }

    const cancelBtn = document.getElementById('cancel-skin-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeSkinUploadOverlay);
    }

    const overlay = document.getElementById('skin-upload-overlay');
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeSkinUploadOverlay();
            }
        });
    }
});

window.openSkinUploadOverlay = openSkinUploadOverlay;
window.closeSkinUploadOverlay = closeSkinUploadOverlay;
window.getCustomSkin = getCustomSkin;
