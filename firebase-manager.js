const firebaseConfig = {
    apiKey: "AIzaSyA7XGmwfkM4N-os170HDKx9CT94Ru1mI9M",
    authDomain: "minelistener.firebaseapp.com",
    databaseURL: "https://minelistener-default-rtdb.firebaseio.com",
    projectId: "minelistener",
    storageBucket: "minelistener.firebasestorage.app",
    messagingSenderId: "385210301004",
    appId: "1:385210301004:web:5406f2dbf19f1c793492e9",
    measurementId: "G-22DSKDCSDT"
};

let db;
const GlobalState = {
    skins: {},
    items: {},
    passwords: {}
};

function initFirebaseSystem() {
    if (typeof firebase === 'undefined') {
        console.error("❌ El SDK de Firebase no está cargado.");
        alert("Falta cargar las librerías de Firebase en index.html");
        return;
    }

    try {

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        db = firebase.database();
        console.log("🔥 Base de Datos Global Conectada.");


        setupListeners();
    } catch (e) {
        console.error("Error inicializando Firebase:", e);
        console.warn("Asegúrate de haber configurado las claves API en firebase-manager.js");
    }
}

function setupListeners() {
    // 1. SKINS
    db.ref('skins').on('value', (snapshot) => {
        GlobalState.skins = snapshot.val() || {};
        console.log('🔄 Skins sincronizadas desde la nube.');
        refreshSkinUI();
    });

    db.ref('items').on('value', (snapshot) => {
        GlobalState.items = snapshot.val() || {};
        console.log('🔄 Items sincronizados desde la nube.');
        refreshItemsUI();
    });

    db.ref('passwords').on('value', (snapshot) => {
        GlobalState.passwords = snapshot.val() || {};
        console.log('🔄 Contraseñas sincronizadas.');
        // Refrescar UI de candados
        if (typeof generatePlayerHeadsGrid === 'function') generatePlayerHeadsGrid();
    });
}

function refreshSkinUI() {
    if (typeof generatePlayerHeadsGrid === 'function') generatePlayerHeadsGrid();
    if (typeof initPayersGrid === 'function') initPayersGrid();

    if (typeof currentViewedPlayerId !== 'undefined' && currentViewedPlayerId !== -1) {
        if (typeof openPlayerViewer === 'function') openPlayerViewer(currentViewedPlayerId);
    }
}

function refreshItemsUI() {

    if (typeof currentPlayerIndex !== 'undefined' && currentPlayerIndex >= 0) {
        if (typeof initBookItemsGrid === 'function') initBookItemsGrid(currentPlayerIndex);
    }
}


window.getCustomSkin = function (playerId) {

    return GlobalState.skins[`player_${playerId}`] || null;
};

window.saveCustomSkinGlobal = function (playerId, skinData) {
    if (!db) return;
    const key = `player_${playerId}`;
    if (skinData) {
        db.ref('skins/' + key).set(skinData).catch(console.error);
    } else {
        db.ref('skins/' + key).remove().catch(console.error);
    }

    localStorage.setItem(`player_custom_skin_${playerId}`, skinData || '');
};

// --- ITEMS ---
window.getGlobalItem = function (playerIndex, boxIndex) {
    const key = `p${playerIndex}_b${boxIndex}`;
    return GlobalState.items[key] || null;
};

window.saveGlobalItem = function (playerIndex, boxIndex, itemId) {
    if (!db) return;
    const key = `p${playerIndex}_b${boxIndex}`;
    if (itemId) {
        db.ref('items/' + key).set(itemId);
    } else {
        db.ref('items/' + key).remove();
    }
};

// --- AUTH ---
window.bookAuthGlobal = {
    hasPassword: function (playerId) {
        return !!GlobalState.passwords[`pw_${playerId}`];
    },
    validate: function (playerId, inputHash) {
        return GlobalState.passwords[`pw_${playerId}`] === inputHash;
    },
    setPassword: function (playerId, hash) {
        if (!db) return;
        db.ref('passwords/pw_' + playerId).set(hash);
    },
    removePassword: function (playerId) {
        if (!db) return;
        db.ref('passwords/pw_' + playerId).remove();
    }
};

document.addEventListener('DOMContentLoaded', initFirebaseSystem);


