/* INSTRUCCIONES:
   1. Abre index.html en tu navegador
   2. Abre la consola del navegador (F12)
   3. Copia y pega este código completo en la consola
   4. Presiona Enter
   
   Esto eliminará todas las contraseñas almacenadas.
   ============================================= */

(function resetAllPasswords() {
    console.log('🔄 Iniciando reinicio de contraseñas...');

    let removedCount = 0;

    const keys = Object.keys(localStorage);

    for (let key of keys) {
        if (key.startsWith('player_password_')) {
            localStorage.removeItem(key);
            removedCount++;
            console.log(`Removida: ${key}`);
        }
    }

    if (removedCount > 0) {
        console.log(`Se eliminaron ${removedCount} contraseña(s)`);
        console.log('Todas las contraseñas han sido reiniciadas');
    } else {
        console.log('ℹNo se encontraron contraseñas para eliminar');
    }

    // Listar contraseñas restantes (debería estar vacío)
    const remainingPasswords = Object.keys(localStorage).filter(k => k.startsWith('player_password_'));
    if (remainingPasswords.length === 0) {
        console.log('Verificación: No quedan contraseñas almacenadas');
    } else {
        console.warn('Advertencia: Aún quedan contraseñas:', remainingPasswords);
    }
})();
