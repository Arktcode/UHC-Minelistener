// Copia y pega esto en la consola del navegador (F12) para borrar la skin de Arksource

(function removeArksourceSkin() {
    const arksourceId = 4; // ID de Arksource
    const key = `player_custom_skin_${arksourceId}`;

    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('✅ Skin de Arksource eliminada del localStorage.');
    } else {
        console.log('ℹ No se encontró ninguna skin personalizada para Arksource.');
    }

    console.log('🔄 Recarga la página para ver los cambios.');
})();
