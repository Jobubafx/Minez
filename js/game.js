const tg = window.Telegram.WebApp;
tg.expand();

// Game State
const gameState = {
    level: 1,
    coins: 100,
    board: Array(25).fill(null),
    revealed: 0,
    gameOver: false
};

// Initialize Game
function initGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Clear existing cells
    
    // Create 5x5 grid
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        gameBoard.appendChild(cell);
    }
    
    // Update game info
    document.getElementById('level-display').textContent = `Level: ${gameState.level}`;
    document.getElementById('coin-balance').textContent = `Coins: ${gameState.coins}`;
}

// Handle Cell Click
function handleCellClick(index) {
    if (gameState.gameOver) return;
    
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.style.backgroundColor = '#aaddff';
    cell.textContent = '?'; // Temporary reveal
    gameState.revealed++;
    
    // Simple win condition for testing
    if (gameState.revealed >= 5) {
        gameState.gameOver = true;
        document.getElementById('next-btn').disabled = false;
        alert('Level complete! Click Next to continue');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Button Event Listeners
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('next-btn').addEventListener('click', () => {
    gameState.level++;
    gameState.revealed = 0;
    gameState.gameOver = false;
    document.getElementById('next-btn').disabled = true;
    initGame();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    if (gameState.coins >= 5) {
        gameState.coins -= 5;
        document.getElementById('coin-balance').textContent = `Coins: ${gameState.coins}`;
        gameState.revealed = 0;
        gameState.gameOver = false;
        initGame();
    } else {
        alert('Not enough coins!');
    }
});