// Replace the entire game.js with this updated version
const tg = window.Telegram.WebApp;
tg.expand();

// Game State
let gameState = {
    level: parseInt(localStorage.getItem('userLevel')) || 1,
    coins: parseInt(localStorage.getItem('userCoins')) || 100,
    board: [],
    revealed: 0,
    diamondsFound: 0,
    bombs: 0,
    diamonds: 0,
    gameOver: false
};

// Initialize Game
function initGame() {
    // Determine bombs/diamonds based on level pattern
    const pattern = gameState.level % 3;
    switch(pattern) {
        case 1: // First pattern
            gameState.bombs = 6;
            gameState.diamonds = 19;
            break;
        case 2: // Second pattern
            gameState.bombs = 7;
            gameState.diamonds = 18;
            break;
        case 0: // Third pattern
            gameState.bombs = 8;
            gameState.diamonds = 17;
            break;
    }

    // Update display
    document.getElementById('level-display').textContent = `Level: ${gameState.level}`;
    document.getElementById('coin-balance').textContent = `Coins: ${gameState.coins}`;
    document.getElementById('next-btn').disabled = true;

    generateBoard();
}

function generateBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameState.board = [];
    gameState.revealed = 0;
    gameState.diamondsFound = 0;
    gameState.gameOver = false;

    // Create empty board
    for (let i = 0; i < 25; i++) {
        gameState.board.push({
            isBomb: false,
            isDiamond: false,
            revealed: false
        });
    }

    // Place bombs
    let bombsPlaced = 0;
    while (bombsPlaced < gameState.bombs) {
        const randomIndex = Math.floor(Math.random() * 25);
        if (!gameState.board[randomIndex].isBomb) {
            gameState.board[randomIndex].isBomb = true;
            bombsPlaced++;
        }
    }

    // Place diamonds
    let diamondsPlaced = 0;
    while (diamondsPlaced < gameState.diamonds) {
        const randomIndex = Math.floor(Math.random() * 25);
        if (!gameState.board[randomIndex].isBomb && !gameState.board[randomIndex].isDiamond) {
            gameState.board[randomIndex].isDiamond = true;
            diamondsPlaced++;
        }
    }

    // Create cells
    gameState.board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.className = 'cell';
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', () => handleCellClick(index));
        gameBoard.appendChild(cellElement);
    });
}

// ... [Keep all other existing functions like handleCellClick, gameOver, etc.]

// Fixing button event listeners:
document.getElementById('skip-coin-btn').addEventListener('click', function() {
    if (gameState.coins >= 50) {
        gameState.coins -= 50;
        gameState.level++;
        updateCoins();
        initGame();
    } else {
        tg.showAlert('You need 50 coins to skip!');
    }
});

document.getElementById('restart-btn').addEventListener('click', function() {
    if (gameState.coins >= 5) {
        gameState.coins -= 5;
        updateCoins();
        initGame();
    } else {
        tg.showAlert('You need 5 coins to restart!');
    }
});

// Initialize game
document.addEventListener('DOMContentLoaded', initGame);