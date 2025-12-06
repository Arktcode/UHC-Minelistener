// Utility script to reset passwords
(function resetAllPasswords() {
    const keys = Object.keys(localStorage);

    for (let key of keys) {
        if (key.startsWith('player_password_')) {
            localStorage.removeItem(key);
        }
    }
})();
