// SISTEMA DE AUTENTICACIÓN PARA LIBROS (SHA-256)

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function setPlayerPassword(playerIndex, password) {
    if (!password || password.length < 4) {
        return false;
    }

    const hashedPassword = await hashPassword(password);

    // Global
    if (window.bookAuthGlobal) {
        window.bookAuthGlobal.setPassword(playerIndex, hashedPassword);
    } else {
        localStorage.setItem(`book_password_${playerIndex}`, hashedPassword);
    }
    return true;
}

function hasPassword(playerIndex) {
    if (window.bookAuthGlobal) {
        // Asumimos que si bookAuthGlobal existe, los datos ya deberían estar cargados o cargándose
        // Si retorna false podría ser que no tiene password O que no ha cargado. 
        // Pero dado que es caché local sincronizado, es lo mejor que tenemos instatáneamente.
        return window.bookAuthGlobal.hasPassword(playerIndex);
    }
    return localStorage.getItem(`book_password_${playerIndex}`) !== null;
}

async function validatePassword(playerIndex, password) {
    const inputHash = await hashPassword(password);

    if (window.bookAuthGlobal) {
        // Verificar contra global si existe
        if (window.bookAuthGlobal.hasPassword(playerIndex)) {
            return window.bookAuthGlobal.validate(playerIndex, inputHash);
        } else {
            // Si global dice que no tiene password, es true (acceso libre)
            // A menos que estemos offline y tengamos copia local...
            // Por consistencia, si usamos global, confiamos en global.
            return true;
        }
    }

    const storedHash = localStorage.getItem(`book_password_${playerIndex}`);
    if (!storedHash) {
        return true;
    }

    return inputHash === storedHash;
}

function removePassword(playerIndex) {
    if (window.bookAuthGlobal) {
        window.bookAuthGlobal.removePassword(playerIndex);
    } else {
        localStorage.removeItem(`book_password_${playerIndex}`);
    }
}

function showPasswordPrompt(playerIndex, playerName, onSuccess, onCancel) {
    const overlay = document.getElementById('password-prompt-overlay');
    const input = document.getElementById('password-input');
    const errorMsg = document.getElementById('password-error');
    const playerNameDisplay = document.getElementById('password-player-name');

    if (!overlay || !input) {
        return;
    }

    if (playerNameDisplay) {
        playerNameDisplay.textContent = playerName || `Jugador ${playerIndex + 1}`;
    }

    input.value = '';
    if (errorMsg) errorMsg.textContent = '';

    overlay.classList.add('active');
    setTimeout(() => input.focus(), 100);

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

    const confirmBtn = document.getElementById('password-confirm-btn');
    if (confirmBtn) {
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', submitHandler);
    }

    const enterHandler = (e) => {
        if (e.key === 'Enter') {
            submitHandler();
        }
    };
    input.removeEventListener('keypress', enterHandler);
    input.addEventListener('keypress', enterHandler);

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

function showPasswordSettings(playerIndex) {
    const panel = document.getElementById('password-settings-panel');
    const currentPasswordInput = document.getElementById('current-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const settingsError = document.getElementById('password-settings-error');
    const settingsSuccess = document.getElementById('password-settings-success');

    if (!panel) {
        return;
    }

    if (currentPasswordInput) currentPasswordInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
    if (settingsError) settingsError.textContent = '';
    if (settingsSuccess) settingsSuccess.textContent = '';

    panel.dataset.playerIndex = playerIndex;

    const currentPasswordGroup = document.getElementById('current-password-group');
    const newPasswordGroup = document.getElementById('new-password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const verifyBtn = document.getElementById('verify-current-password-btn');
    const saveBtn = document.getElementById('save-password-btn');

    if (hasPassword(playerIndex)) {
        if (currentPasswordGroup) currentPasswordGroup.style.display = 'block';
        if (newPasswordGroup) newPasswordGroup.style.display = 'none';
        if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'none';
        if (verifyBtn) verifyBtn.style.display = 'inline-block';
        if (saveBtn) saveBtn.style.display = 'none';
    } else {
        if (currentPasswordGroup) currentPasswordGroup.style.display = 'none';
        if (newPasswordGroup) newPasswordGroup.style.display = 'block';
        if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'block';
        if (verifyBtn) verifyBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'inline-block';
    }

    panel.classList.add('active');
}

function closePasswordSettings() {
    const panel = document.getElementById('password-settings-panel');
    if (panel) {
        panel.classList.remove('active');
    }
}

async function verifyCurrentPassword() {
    const panel = document.getElementById('password-settings-panel');
    const playerIndex = parseInt(panel.dataset.playerIndex);
    const currentPasswordInput = document.getElementById('current-password-input');
    const settingsError = document.getElementById('password-settings-error');
    const settingsSuccess = document.getElementById('password-settings-success');

    if (settingsError) settingsError.textContent = '';
    if (settingsSuccess) settingsSuccess.textContent = '';

    const currentPassword = (currentPasswordInput?.value || '').trim();

    if (!currentPassword) {
        if (settingsError) settingsError.textContent = 'Ingresa tu contraseña actual';
        return;
    }

    const isValid = await validatePassword(playerIndex, currentPassword);

    if (!isValid) {
        if (settingsError) settingsError.textContent = 'Contraseña incorrecta';
        currentPasswordInput.value = '';
        currentPasswordInput.focus();
        return;
    }

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

    if (currentPasswordInput) currentPasswordInput.disabled = true;

    const newPasswordInput = document.getElementById('new-password-input');
    if (newPasswordInput) {
        setTimeout(() => newPasswordInput.focus(), 100);
    }

    if (settingsSuccess) settingsSuccess.textContent = 'Contraseña verificada';
}

async function savePasswordFromSettings(playerIndex) {
    const currentPasswordInput = document.getElementById('current-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const settingsError = document.getElementById('password-settings-error');
    const settingsSuccess = document.getElementById('password-settings-success');

    if (settingsError) settingsError.textContent = '';
    if (settingsSuccess) settingsSuccess.textContent = '';

    const newPassword = (newPasswordInput?.value || '').trim();
    const confirmPassword = (confirmPasswordInput?.value || '').trim();

    if (newPassword.length < 4) {
        if (settingsError) settingsError.textContent = 'La contraseña debe tener al menos 4 caracteres';
        return;
    }

    if (newPassword !== confirmPassword) {
        if (settingsError) settingsError.textContent = 'Las contraseñas no coinciden';
        return;
    }

    const success = await setPlayerPassword(playerIndex, newPassword);

    if (success) {
        if (settingsSuccess) settingsSuccess.textContent = '✅ Contraseña guardada correctamente';

        if (currentPasswordInput) {
            currentPasswordInput.value = '';
            currentPasswordInput.disabled = false;
        }
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';

        setTimeout(() => {
            if (typeof generatePlayerHeadsGrid === 'function') {
                const playerSelectorOverlay = document.getElementById('player-selector-overlay');
                if (playerSelectorOverlay && playerSelectorOverlay.classList.contains('active')) {
                    generatePlayerHeadsGrid();
                }
            }
        }, 100);

        setTimeout(() => {
            closePasswordSettings();
        }, 1500);
    }
}

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

    const currentPassword = currentPasswordInput?.value || '';
    const isValid = await validatePassword(playerIndex, currentPassword);

    if (!isValid) {
        if (settingsError) settingsError.textContent = 'Contraseña incorrecta';
        return;
    }

    removePassword(playerIndex);

    if (settingsSuccess) settingsSuccess.textContent = '✅ Contraseña removida';

    if (currentPasswordInput) currentPasswordInput.value = '';

    setTimeout(() => {
        closePasswordSettings();
    }, 1500);
}

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
