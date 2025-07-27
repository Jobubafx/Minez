const tg = window.Telegram.WebApp;
tg.expand();

// Game State
const gameState = {
    level: parseInt(localStorage.getItem('userLevel')) || 1,
    coins: parseInt(localStorage.getItem('userCoins')) || 50,
    board: [],
    revealed: 0,
    diamondsFound: 0,
    bombs: 0,
    diamonds: 0,
    gameOver: false
};

// Initialize Game
function initGame() {
    // Update display
    document.getElementById('level-display').textContent = `Level: ${gameState.level}`;
    document.getElementById('coin-balance').textContent = `Coins: ${gameState.coins}`;
    document.getElementById('next-btn').disabled = true;
    
    // Set difficulty
    gameState.bombs = gameState.level % 2 === 0 ? 8 : 5;
    gameState.diamonds = gameState.level % 2 === 0 ? 17 : 20;
    
    // Generate board
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameState.board = Array(25).fill(null);
    gameState.revealed = 0;
    gameState.diamondsFound = 0;
    gameState.gameOver = false;
    
    // Place bombs
    let bombsPlaced = 0;
    while (bombsPlaced < gameState.bombs) {
        const randomIndex = Math.floor(Math.random() * 25);
        if (gameState.board[randomIndex] === null) {
            gameState.board[randomIndex] = 'bomb';
            bombsPlaced++;
        }
    }
    
    // Place diamonds
    let diamondsPlaced = 0;
    while (diamondsPlaced < gameState.diamonds) {
        const randomIndex = Math.floor(Math.random() * 25);
        if (gameState.board[randomIndex] === null) {
            gameState.board[randomIndex] = 'diamond';
            diamondsPlaced++;
        }
    }
    
    // Create cells
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        gameBoard.appendChild(cell);
    }
}

// Handle Cell Click
function handleCellClick(index) {
    if (gameState.gameOver || gameState.board[index] === 'revealed') return;
    
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    gameState.board[index] = 'revealed';
    gameState.revealed++;
    
    if (gameState.board[index] === 'bomb') {
        cell.style.backgroundColor = '#ff4444';
        cell.textContent = '💣';
        gameOver(false);
    } else if (gameState.board[index] === 'diamond') {
        cell.style.backgroundColor = '#33ccff';
        cell.textContent = '💎';
        gameState.diamondsFound++;
        
        const requiredDiamonds = gameState.bombs === 5 ? 6 : 5;
        if (gameState.diamondsFound >= requiredDiamonds) {
            gameOver(true);
        }
    } else {
        cell.style.backgroundColor = '#aaddff';
    }
}

// Game Over
function gameOver(isWin) {
    gameState.gameOver = true;
    
    if (isWin) {
        gameState.coins += 10;
        localStorage.setItem('userCoins', gameState.coins);
        document.getElementById('coin-balance').textContent = `Coins: ${gameState.coins}`;
        document.getElementById('next-btn').disabled = false;
    }
    
    // Reveal all cells
    gameState.board.forEach((cell, index) => {
        const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell === 'bomb') {
            cellElement.style.backgroundColor = '#ff4444';
            cellElement.textContent = '💣';
        } else if (cell === 'diamond') {
            cellElement.style.backgroundColor = '#33ccff';
            cellElement.textContent = '💎';
        }
    });
}

// Button Events
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (gameState.coins >= 10) {
        gameState.coins -= 10;
        gameState.level++;
        localStorage.setItem('userCoins', gameState.coins);
        localStorage.setItem('userLevel', gameState.level);
        initGame();
    } else {
        alert('Not enough coins!');
    }
});

document.getElementById('restart-btn').addEventListener('click', () => {
    if (gameState.coins >= 5) {
        gameState.coins -= 5;
        localStorage.setItem('userCoins', gameState.coins);
        document.getElementById('coin-balance').textContent = `Coins: ${gameState.coins}`;
        initGame();
    } else {
        alert('Not enough coins to restart!');
    }
});

// Initialize game
document.addEventListener('DOMContentLoaded', initGame);