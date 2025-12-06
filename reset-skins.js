// Script para borrar todas las skins personalizadas del localStorage
(function clearCustomSkins() {
    console.log('🧹 Iniciando limpieza de skins personalizadas...');
    let count = 0;
    const items = Object.keys(localStorage);

    items.forEach(key => {
        if (key.startsWith('player_custom_skin_')) {
            localStorage.removeItem(key);
            count++;
        }
    });

    console.log(`✅ Se han eliminado ${count} skins personalizadas.`);
    console.log('🔄 Por favor, recarga la página para ver los cambios.');
})();
