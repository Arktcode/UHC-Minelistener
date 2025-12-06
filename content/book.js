/* LIBRO - GESTION DE CONTRASEÑAS Y LOGICA ETC*/

// Estado global
let currentPlayer = -1;

// Abrir libro
function openBook(playerIndex, playerName) {
    console.log('📖 Intentando abrir libro para:', playerName, 'índice:', playerIndex);

    // Verificar si el libro tiene contraseña
    if (window.bookAuth && window.bookAuth.hasPassword(playerIndex)) {
        console.log('Libro protegido con contraseña');

        // Mostrar prompt de contraseña
        window.bookAuth.showPasswordPrompt(
            playerIndex,
            playerName,
            () => {
                // Contraseña correcta
                actuallyOpenBook(playerIndex, playerName);
            },
            () => {
                // Cancelado
                console.log('Acceso al libro cancelado');
            }
        );
    } else {
        // No tiene contraseña, abrir directamente
        actuallyOpenBook(playerIndex, playerName);
    }
}

// Función interna para abrir el libro (después de autenticación)
function actuallyOpenBook(playerIndex, playerName) {
    console.log('📖 Abriendo libro para:', playerName, 'índice:', playerIndex);

    currentPlayer = playerIndex;

    const overlay = document.getElementById('book-overlay');
    const panel = document.getElementById('book-panel');
    const title = document.getElementById('book-player-name');
    const textarea = document.getElementById('book-left-text');

    if (!overlay || !panel) {
        console.error('Elementos del libro no encontrados');
        return;
    }

    // Establecer nombre del jugador
    if (title) title.textContent = playerName || `Jugador ${playerIndex + 1}`;

    // Cargar texto guardado
    if (textarea) {
        const savedText = localStorage.getItem(`book_text_${playerIndex}`) || '';
        textarea.value = savedText;
    }

    // Inicializar grid de items (si está disponible la función)
    if (typeof window.initBookItemsGrid === 'function') {
        window.initBookItemsGrid(playerIndex);
    }

    // Mostrar libro
    overlay.classList.add('active');
    panel.classList.add('active');

    console.log('Libro abierto');
}

// Cerrar libro
function closeBook() {
    const overlay = document.getElementById('book-overlay');
    const panel = document.getElementById('book-panel');
    const textarea = document.getElementById('book-left-text');

    // Guardar texto antes de cerrar pq siempre se me borraba
    if (currentPlayer >= 0 && textarea) {
        localStorage.setItem(`book_text_${currentPlayer}`, textarea.value);
        console.log('Texto guardado');
    }

    // Ocultar libro
    if (overlay) overlay.classList.remove('active');
    if (panel) panel.classList.remove('active');

    currentPlayer = -1;
    console.log('Libro cerrado');
}

// Auto-guardar mientras escribe
let saveTimer;
function autoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        const textarea = document.getElementById('book-left-text');
        if (currentPlayer >= 0 && textarea) {
            localStorage.setItem(`book_text_${currentPlayer}`, textarea.value);
            console.log('Auto-guardado');
        }
    }, 1000);
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function () {
    // Botón cerrar
    const closeBtn = document.getElementById('book-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBook);
    }

    // Botón volver
    const backBtn = document.getElementById('book-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            closeBook();
            // Reabrir selector de jugadores
            const playerSelectorOverlay = document.getElementById('player-selector-overlay');
            if (playerSelectorOverlay) {
                playerSelectorOverlay.classList.add('active');
            }
        });
    }

    // Click en overlay para cerrar
    const overlay = document.getElementById('book-overlay');
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeBook();
        });
    }

    // Auto-guardar al escribir
    const textarea = document.getElementById('book-left-text');
    if (textarea) {
        textarea.addEventListener('input', autoSave);
    }

    // ESC para cerrar para hacerlo mas practico :fire:
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('book-overlay');
            if (overlay && overlay.classList.contains('active')) {
                closeBook();
            }
        }
    });

    // Botón de configuración de contraseña
    const passwordBtn = document.getElementById('book-password-btn');
    if (passwordBtn) {
        passwordBtn.addEventListener('click', function () {
            if (currentPlayer >= 0 && window.bookAuth) {
                window.bookAuth.showPasswordSettings(currentPlayer);
            }
        });
    }

    // Botones del panel de configuración de contraseña
    const verifyPasswordBtn = document.getElementById('verify-current-password-btn');
    if (verifyPasswordBtn) {
        verifyPasswordBtn.addEventListener('click', function () {
            if (window.bookAuth) {
                window.bookAuth.verifyCurrentPassword();
            }
        });
    }

    const savePasswordBtn = document.getElementById('save-password-btn');
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', function () {
            if (currentPlayer >= 0 && window.bookAuth) {
                window.bookAuth.savePasswordFromSettings(currentPlayer);
            }
        });
    }

    const removePasswordBtn = document.getElementById('remove-password-btn');
    if (removePasswordBtn) {
        removePasswordBtn.addEventListener('click', function () {
            if (currentPlayer >= 0 && window.bookAuth) {
                window.bookAuth.removePasswordFromSettings(currentPlayer);
            }
        });
    }

    const closePasswordSettingsBtn = document.getElementById('close-password-settings-btn');
    if (closePasswordSettingsBtn) {
        closePasswordSettingsBtn.addEventListener('click', function () {
            if (window.bookAuth) {
                window.bookAuth.closePasswordSettings();
            }
        });
    }

    console.log('Sistema de libro inicializado');
});

// Exportar funciones
window.openBook = openBook;
window.closeBook = closeBook;
