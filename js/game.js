const tg = window.Telegram.WebApp;
tg.expand();

// Initialize game board
const gameBoard = document.getElementById('game-board');

// Create 5x5 grid
for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = '';
    gameBoard.appendChild(cell);
}

// Navigation
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});