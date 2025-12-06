/* =============================================
   SISTEMA DE AUTENTICACIÓN PARA LIBROS
   ============================================= */

// Función simple de hash usando SHA-256 
// Ya que es el unico que se implementar sin bugs
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Guardar contraseña para un jugador
/*TODO Aqui tambien se puede controlar la cantidad de digitos en la contraseña
Como minimo requerido*/
async function setPlayerPassword(playerIndex, password) {
    if (!password || password.length < 4) {
        console.warn('La contraseña debe tener al menos 4 caracteres');
        return false;
    }

    const hashedPassword = await hashPassword(password);
    localStorage.setItem(`player_password_${playerIndex}`, hashedPassword);
    console.log(`Contraseña establecida para jugador ${playerIndex}`);
    return true;
}

// Verificar si un jugador tiene contraseña
function hasPassword(playerIndex) {
    return localStorage.getItem(`player_password_${playerIndex}`) !== null;
}

// Validar contraseña
async function validatePassword(playerIndex, password) {
    const storedHash = localStorage.getItem(`player_password_${playerIndex}`);
    if (!storedHash) {
        return true; // No hay contraseña, acceso libre
    }

    const inputHash = await hashPassword(password);
    return inputHash === storedHash;
}

// Remover contraseña
function removePassword(playerIndex) {
    localStorage.removeItem(`player_password_${playerIndex}`);
    console.log(`Contraseña removida para jugador ${playerIndex}`);
}

// Mostrar prompt de contraseña
function showPasswordPrompt(playerIndex, playerName, onSuccess, onCancel) {
    const overlay = document.getElementById('password-prompt-overlay');
    const input = document.getElementById('password-input');
    const errorMsg = document.getElementById('password-error');
    const playerNameDisplay = document.getElementById('password-player-name');

    if (!overlay || !input) {
        console.error('Elementos de prompt de contraseña no encontrados');
        return;
    }

    // Configurar UI
    if (playerNameDisplay) {
        playerNameDisplay.textContent = playerName || `Jugador ${playerIndex + 1}`;
    }

    input.value = '';
    if (errorMsg) errorMsg.textContent = '';

    // Mostrar overlay
    overlay.classList.add('active');
    setTimeout(() => input.focus(), 100);

    // Handler para submit
    const submitHandler = async () => {
        const password = input.value;
        const isValid = await validatePassword(playerIndex, password);

        if (isValid) {
            overlay.classList.remove('active');
            if (onSuccess) onSuccess();
        } else {
            if (errorMsg) {
                errorMsg.textContent = 'Contraseña incorrecta';
                input.value = '';
                input.focus();
            }
        }
    };

    // Botón de confirmar
    const confirmBtn = document.getElementById('password-confirm-btn');
    if (confirmBtn) {
        // Remover listeners anteriores...
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', submitHandler);
    }

    // Enter para confirmar
    const enterHandler = (e) => {
        if (e.key === 'Enter') {
            submitHandler();
        }
    };
    input.removeEventListener('keypress', enterHandler);
    input.addEventListener('keypress', enterHandler);

    // Botón cancelar
    const cancelBtn = document.getElementById('password-cancel-btn');
    if (cancelBtn) {
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newCancelBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            if (onCancel) onCancel();
        });
    }
}

// Mostrar panel de configuración de contraseña
function showPasswordSettings(playerIndex) {
    const panel = document.getElementById('password-settings-panel');
    const currentPasswordInput = document.getElementById('current-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const settingsError = document.getElementById('password-settings-error');
    const settingsSuccess = document.getElementById('password-settings-success');

    if (!panel) {
        console.error('Panel de configuración de contraseña no encontrado');
        return;
    }

    // Limpiar campos
    if (currentPasswordInput) currentPasswordInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
    if (settingsError) settingsError.textContent = '';
    if (settingsSuccess) settingsSuccess.textContent = '';

    // Guardar el índice del jugador en el panel para uso posterior
    panel.dataset.playerIndex = playerIndex;

    // Si el jugador tiene contraseña mostrara solo el campo de contraseña actual
    // Los campos de nueva contraseña se mostrarán después de validar
    const currentPasswordGroup = document.getElementById('current-password-group');
    const newPasswordGroup = document.getElementById('new-password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const verifyBtn = document.getElementById('verify-current-password-btn');
    const saveBtn = document.getElementById('save-password-btn');

    if (hasPassword(playerIndex)) {
        // Mostrare solo campo de contraseña actual
        if (currentPasswordGroup) currentPasswordGroup.style.display = 'block';
        if (newPasswordGroup) newPasswordGroup.style.display = 'none';
        if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'none';
        if (verifyBtn) verifyBtn.style.display = 'inline-block';
        if (saveBtn) saveBtn.style.display = 'none';
    } else {
        // Si no tiene contraseña, mostrar directamente los campos de nueva contraseña
        if (currentPasswordGroup) currentPasswordGroup.style.display = 'none';
        if (newPasswordGroup) newPasswordGroup.style.display = 'block';
        if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'block';
        if (verifyBtn) verifyBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'inline-block';
    }

    panel.classList.add('active');
}

// Cerrar panel de configuración
function closePasswordSettings() {
    const panel = document.getElementById('password-settings-panel');
    if (panel) {
        panel.classList.remove('active');
    }
}

// Verificar contraseña actual y mostrar campos de nueva contraseña
async function verifyCurrentPassword() {
    const panel = document.getElementById('password-settings-panel');
    const playerIndex = parseInt(panel.dataset.playerIndex);
    const currentPasswordInput = document.getElementById('current-password-input');
    const settingsError = document.getElementById('password-settings-error');
    const settingsSuccess = document.getElementById('password-settings-success');

    // Limpiar mensajes
    if (settingsError) settingsError.textContent = '';
    if (settingsSuccess) settingsSuccess.textContent = '';

    const currentPassword = (currentPasswordInput?.value || '').trim();

    if (!currentPassword) {
        if (settingsError) settingsError.textContent = 'Ingresa tu contraseña actual';
        return;
    }

    // Validar contraseña actual
    const isValid = await validatePassword(playerIndex, currentPassword);

    if (!isValid) {
        if (settingsError) settingsError.textContent = 'Contraseña incorrecta';
        currentPasswordInput.value = '';
        currentPasswordInput.focus();
        return;
    }

    // Contraseña correcta - mostrar campos de nueva contraseña
    const currentPasswordGroup = document.getElementById('current-password-group');
    const newPasswordGroup = document.getElementById('new-password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const verifyBtn = document.getElementById('verify-current-password-btn');
    const saveBtn = document.getElementById('save-password-btn');

    if (currentPasswordGroup) currentPasswordGroup.style.display = 'block';
    if (newPasswordGroup) newPasswordGroup.style.display = 'block';
    if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'block';
    if (verifyBtn) verifyBtn.style.display = 'none';
    if (saveBtn) saveBtn.style.display = 'inline-block';

    // Deshabilitar el campo de contraseña actual
    if (currentPasswordInput) currentPasswordInput.disabled = true;

    // Enfocarse en el campo de nueva contraseña
    const newPasswordInput = document.getElementById('new-password-input');
    if (newPasswordInput) {
        setTimeout(() => newPasswordInput.focus(), 100);
    }

    if (settingsSuccess) settingsSuccess.textContent = 'Contraseña verificada';
}

// Guardar nueva contraseña desde el panel de configuración
async function savePasswordFromSettings(playerIndex) {
    const currentPasswordInput = document.getElementById('current-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const settingsError = document.getElementById('password-settings-error');
    const settingsSuccess = document.getElementById('password-settings-success');

    // Limpiar mensajes primero
    if (settingsError) settingsError.textContent = '';
    if (settingsSuccess) settingsSuccess.textContent = '';

    // Obtener valores y limpiar espacios
    const newPassword = (newPasswordInput?.value || '').trim();
    const confirmPassword = (confirmPasswordInput?.value || '').trim();

    console.log('Guardando contraseña:', {
        newPasswordLength: newPassword.length,
        confirmPasswordLength: confirmPassword.length,
        match: newPassword === confirmPassword
    });

    // Validaciones
    if (newPassword.length < 4) {
        if (settingsError) settingsError.textContent = 'La contraseña debe tener al menos 4 caracteres';
        return;
    }

    if (newPassword !== confirmPassword) {
        if (settingsError) settingsError.textContent = 'Las contraseñas no coinciden';
        console.error('Passwords do not match:', { newPassword, confirmPassword });
        return;
    }

    // Guardar nueva contraseña
    const success = await setPlayerPassword(playerIndex, newPassword);

    if (success) {
        if (settingsSuccess) settingsSuccess.textContent = 'Contraseña guardada correctamente';

        if (currentPasswordInput) {
            currentPasswordInput.value = '';
            currentPasswordInput.disabled = false;
        }
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';

        // Actualizar indicador en el selector de jugadores si está visible
        setTimeout(() => {
            const playerHeadsGrid = document.getElementById('player-heads-grid');
            if (playerHeadsGrid && typeof generatePlayerHeadsGrid === 'function') {
                // Regenerar grid para mostrar candado
                const playerSelectorOverlay = document.getElementById('player-selector-overlay');
                if (playerSelectorOverlay && playerSelectorOverlay.classList.contains('active')) {
                    generatePlayerHeadsGrid();
                }
            }
        }, 100);

        // Cerrar panel después de 1.5 segundos (no era necesario pero le da toque)
        setTimeout(() => {
            closePasswordSettings();
        }, 1500);
    }
}

// Remover contraseña desde el panel de configuración
async function removePasswordFromSettings(playerIndex) {
    const currentPasswordInput = document.getElementById('current-password-input');
    const settingsError = document.getElementById('password-settings-error');
    const settingsSuccess = document.getElementById('password-settings-success');

    if (settingsError) settingsError.textContent = '';
    if (settingsSuccess) settingsSuccess.textContent = '';

    if (!hasPassword(playerIndex)) {
        if (settingsError) settingsError.textContent = 'No hay contraseña configurada';
        return;
    }

    // Verificar contraseña actual
    const currentPassword = currentPasswordInput?.value || '';
    const isValid = await validatePassword(playerIndex, currentPassword);

    if (!isValid) {
        if (settingsError) settingsError.textContent = 'Contraseña incorrecta';
        return;
    }

    // Remover contraseña
    removePassword(playerIndex);

    if (settingsSuccess) settingsSuccess.textContent = 'Contraseña removida';

    // Limpiar y cerrar
    if (currentPasswordInput) currentPasswordInput.value = '';

    setTimeout(() => {
        closePasswordSettings();
    }, 1500);
}

// Exportar funciones
window.bookAuth = {
    hasPassword,
    validatePassword,
    setPlayerPassword,
    removePassword,
    showPasswordPrompt,
    showPasswordSettings,
    closePasswordSettings,
    verifyCurrentPassword,
    savePasswordFromSettings,
    removePasswordFromSettings
};

console.log('Sistema de autenticación de libros cargado...');
