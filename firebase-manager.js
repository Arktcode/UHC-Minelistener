// ==========================================
// GESTOR DE BASE DE DATOS GLOBAL (FIREBASE)
// ==========================================

// IMPORTANTE: REEMPLAZA ESTO CON TUS PROPIAS CREDENCIALES DE FIREBASE
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un proyecto (o usa uno existente).
// 3. Añade una Web App y copia el objeto "firebaseConfig".
// 4. Habilita "Realtime Database" en modo de prueba (lectura/escritura true).

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

// Variables internas
let db;
const GlobalState = {
    skins: {},
    items: {},
    passwords: {}
};

// Inicialización del sistema
function initFirebaseSystem() {
    if (typeof firebase === 'undefined') {
        console.error("❌ El SDK de Firebase no está cargado.");
        alert("Falta cargar las librerías de Firebase en index.html");
        return;
    }

    try {
        // Evitar reinicializar si ya existe
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        db = firebase.database();
        console.log("🔥 Base de Datos Global Conectada.");

        // Iniciar escuchas en tiempo real
        setupListeners();
    } catch (e) {
        console.error("Error inicializando Firebase:", e);
        console.warn("Asegúrate de haber configurado las claves API en firebase-manager.js");
    }
}

// Escuchar cambios en tiempo real
function setupListeners() {
    // 1. SKINS
    db.ref('skins').on('value', (snapshot) => {
        GlobalState.skins = snapshot.val() || {};
        console.log('🔄 Skins sincronizadas desde la nube.');
        refreshSkinUI();
    });

    // 2. ITEMS (Inventarios de libros)
    db.ref('items').on('value', (snapshot) => {
        GlobalState.items = snapshot.val() || {};
        console.log('🔄 Items sincronizados desde la nube.');
        refreshItemsUI();
    });

    // 3. PASSWORDS (Contraseñas de libros)
    db.ref('passwords').on('value', (snapshot) => {
        GlobalState.passwords = snapshot.val() || {};
        console.log('🔄 Contraseñas sincronizadas.');
        // Refrescar UI de candados
        if (typeof generatePlayerHeadsGrid === 'function') generatePlayerHeadsGrid();
    });
}

// Callbacks de actualización de UI
function refreshSkinUI() {
    if (typeof generatePlayerHeadsGrid === 'function') generatePlayerHeadsGrid();
    if (typeof initPayersGrid === 'function') initPayersGrid();

    // Si el visor 3D está abierto, recargar skin
    // Logica existente en player-viewer.js se apoya en getCustomSkin, que actualizaremos
    if (typeof currentViewedPlayerId !== 'undefined' && currentViewedPlayerId !== -1) {
        if (typeof openPlayerViewer === 'function') openPlayerViewer(currentViewedPlayerId);
    }
}

function refreshItemsUI() {
    // Si hay un libro abierto, recargar sus items
    // Necesitamos saber qué libro está abierto. Usaremos una variable global si existe, 
    // o inferiremos del contexto global si existe 'currentPlayerIndex' en interactives.js
    if (typeof currentPlayerIndex !== 'undefined' && currentPlayerIndex >= 0) {
        if (typeof initBookItemsGrid === 'function') initBookItemsGrid(currentPlayerIndex);
    }
}

// ==========================================
// API PÚBLICA (Funciones Globales)
// ==========================================

// --- SKINS ---
window.getCustomSkin = function (playerId) {
    // Devuelve del caché sincronizado
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
    // Actualizamos backup local por si acaso falla internet
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

// Auto-iniciar al cargar el script
document.addEventListener('DOMContentLoaded', initFirebaseSystem);

