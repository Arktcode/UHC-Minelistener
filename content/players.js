/* ========================================
   SISTEMA DE JUGADORES - DATOS Y LÓGICA
   Fusión de: players-data.js + payers.js
   ======================================== */

/* ========================================
   DATOS DE JUGADORES
   ======================================== */

// Información detallada de cada jugador si es que hay excepciones ps...
const playersData = [
    {
        id: 0,
        name: 'Cynder',
        skinFile: '1.png',
        role: 'SD Usuario',
        kills: 0,
        deaths: 0 / 3,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida'
    },
    {
        id: 1,
        name: 'x84_Keeper',
        skinFile: '2.png',
        role: 'Administrador',
        kills: 0,
        deaths: 0 / 3,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida.'
    },
    {
        id: 2,
        name: 'Arksource',
        skinFile: '5.png',
        role: 'Organizador',
        kills: 0,
        deaths: 0 / 3,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida.'
    },
    {
        id: 3,
        name: 'Smite',
        skinFile: '6.png',
        role: 'SD Usuario',
        kills: 0,
        deaths: 0 / 3,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida.'
    },
    {
        id: 4,
        name: 'Leomax',
        skinFile: '11.png',
        role: 'SD Usuario',
        kills: 0,
        deaths: 0 / 3,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida.'
    },
    {
        id: 5,
        name: 'Softaxy',
        skinFile: '13.png',
        role: 'SD Usuario',
        kills: 0,
        deaths: 0 / 3,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida.'
    },
    {
        id: 6,
        name: 'Player 7',
        skinFile: '7.png',
        role: 'Participante',
        kills: 0,
        deaths: 0,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida.'
    },
    {
        id: 7,
        name: 'Player 8',
        skinFile: '8.png',
        role: 'Participante',
        kills: 0,
        deaths: 0,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida.'
    },
    {
        id: 8,
        name: 'Player 9',
        skinFile: '9.png',
        role: 'Participante',
        kills: 0,
        deaths: 0,
        wins: 0,
        team: 'Morado',
        status: 'Activo',
        description: 'Nuevo participante.'
    },
    {
        id: 9,
        name: 'Player 10',
        skinFile: '10.png',
        role: 'Participante',
        kills: 0,
        deaths: 0,
        wins: 0,
        team: 'Morado',
        status: 'Activo',
        description: 'Nuevo participante.'
    },
    {
        id: 10,
        name: 'Player 14',
        skinFile: '14.png',
        role: 'Participante',
        kills: 0,
        deaths: 0,
        wins: 0,
        team: 'Naranja',
        status: 'Activo',
        description: 'Nuevo participante.'
    },
    {
        id: 11,
        name: 'inkandarius',
        skinFile: '15.png',
        role: 'SD Usuario',
        kills: 0,
        deaths: 0 / 3,
        wins: 0,
        team: 'Indefinido',
        status: 'Activo',
        description: 'Temporalmente no Establecida.'
    }
];

function getPlayerData(playerId) {
    return playersData.find(p => p.id === playerId) || null;
}

function getPlayerDataByName(playerName) {
    return playersData.find(p => p.name === playerName) || null;
}

const payersGrid = document.getElementById('payers-grid');

async function initPayersGrid() {
    if (!payersGrid) return;

    payersGrid.innerHTML = '';

    for (let i = 0; i < 20; i++) {
        const box = document.createElement('div');
        box.className = 'payer-box';
        box.dataset.index = i;

        if (i < playersData.length) {
            const player = playersData[i];
            const skinUrl = `assets/skins/${player.skinFile}`;

            const skinView = document.createElement('div');
            skinView.className = 'payer-skin-view';
            skinView.style.backgroundImage = `url('${skinUrl}')`;
            box.appendChild(skinView);

            const hatView = document.createElement('div');
            hatView.className = 'payer-hat-view';
            hatView.style.backgroundImage = `url('${skinUrl}')`;
            box.appendChild(hatView);

            const infoOverlay = document.createElement('div');
            infoOverlay.className = 'payer-info-overlay';

            const nameTag = document.createElement('div');
            nameTag.className = 'payer-name';
            nameTag.textContent = player.name;
            infoOverlay.appendChild(nameTag);


            const statusDot = document.createElement('div');
            statusDot.className = 'payer-status-dot';
            if (player.status === 'Activo') {
                statusDot.classList.add('active');
            }
            infoOverlay.appendChild(statusDot);

            box.appendChild(infoOverlay);

            box.title = `Ver perfil de ${player.name}`;
            box.dataset.playerName = player.name;
            box.style.cursor = 'pointer';

            box.addEventListener('click', function () {
                if (typeof openPlayerViewer === 'function') {
                    openPlayerViewer(player.id);
                }
            });

        } else {
            box.classList.add('empty');
            box.title = 'Espacio vacío';
        }

        payersGrid.appendChild(box);
    }

    console.log('Payers grid Premium inicializado con', playersData.length, 'jugadores');
}

document.addEventListener('DOMContentLoaded', function () {
    initPayersGrid();
    console.log('Players.js cargado (consolidado)');
});

function startCountdown() {

    const countDownDate = new Date("December 26, 2025 18:00:00").getTime();

    const x = setInterval(function () {

        const now = new Date().getTime();

        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const elDays = document.getElementById("days");
        const elHours = document.getElementById("hours");
        const elMinutes = document.getElementById("minutes");
        const elSeconds = document.getElementById("seconds");

        if (elDays) elDays.innerText = days < 10 ? "0" + days : days;
        if (elHours) elHours.innerText = hours < 10 ? "0" + hours : hours;
        if (elMinutes) elMinutes.innerText = minutes < 10 ? "0" + minutes : minutes;
        if (elSeconds) elSeconds.innerText = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            clearInterval(x);
            if (elDays) elDays.innerText = "00";
            if (elHours) elHours.innerText = "00";
            if (elMinutes) elMinutes.innerText = "00";
            if (elSeconds) elSeconds.innerText = "00";
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
    startCountdown();
});
