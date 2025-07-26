const tg = window.Telegram.WebApp;
tg.expand();

// DOM Elements
const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const coinBalance = document.getElementById('coin-balance');
const backBtn = document.getElementById('back-btn');
const skipAdBtn = document.getElementById('skip-ad-btn');
const skipCoinBtn = document.getElementById('skip-coin-btn');
const restartBtn = document.getElementById('restart-btn');
const nextBtn = document.getElementById('next-btn');

// Game State
let gameState = {
    level: parseInt(localStorage.getItem('userLevel')) || 1,
    coins: parseInt(localStorage.getItem('userCoins')) || 100,
    board: [],
    revealed: 0,
    diamondsFound: 0,
    bombs: 0,
    diamonds: 0,
    gameOver: false,
    adCounter: 0
};

// Initialize Game
function initGame() {
    levelDisplay.textContent = `Level: ${gameState.level}`;
    coinBalance.textContent = `Coins: ${gameState.coins}`;
    nextBtn.disabled = true;
    
    // Set bombs/diamonds based on level
    if ((gameState.level >= 1 && gameState.level <= 25) || 
        (gameState.level >= 51 && gameState.level <= 75) ||
        (gameState.level >= 101 && gameState.level <= 125)) {
        gameState.bombs = 5;
        gameState.diamonds = 20;
    } else {
        gameState.bombs = 8;
        gameState.diamonds = 17;
    }
    
    generateBoard();
}

function generateBoard() {
    gameBoard.innerHTML = '';
    gameState.board = [];
    gameState.revealed = 0;
    gameState.diamondsFound = 0;
    gameState.gameOver = false;
    
    // Create empty board
    for (let i = 0; i < 25; i++) {
        gameState.board.push({ isBomb: false, isDiamond: false, revealed: false });
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

function handleCellClick(index) {
    if (gameState.gameOver || gameState.board[index].revealed) return;
    
    const cell = gameState.board[index];
    cell.revealed = true;
    gameState.revealed++;
    
    const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
    
    if (cell.isBomb) {
        cellElement.classList.add('bomb');
        cellElement.textContent = '💣';
        gameOver(false);
    } else if (cell.isDiamond) {
        cellElement.classList.add('diamond');
        cellElement.textContent = '💎';
        gameState.diamondsFound++;
        
        const requiredDiamonds = gameState.bombs === 5 ? 6 : 5;
        if (gameState.diamondsFound >= requiredDiamonds) {
            gameOver(true);
        }
    } else {
        cellElement.classList.add('revealed');
    }
}

function gameOver(isWin) {
    gameState.gameOver = true;
    
    if (isWin) {
        gameState.coins += 10;
        updateCoins();
        nextBtn.disabled = false;
        tg.showAlert(`Level Complete! +10 Coins!`);
    }
    
    // Reveal all cells
    gameState.board.forEach((cell, index) => {
        const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell.isBomb) {
            cellElement.classList.add('bomb');
            cellElement.textContent = '💣';
        } else if (cell.isDiamond) {
            cellElement.classList.add('diamond');
            cellElement.textContent = '💎';
        }
    });
}

function updateCoins() {
    coinBalance.textContent = `Coins: ${gameState.coins}`;
    localStorage.setItem('userCoins', gameState.coins);
    localStorage.setItem('userLevel', gameState.level);
}

// Event Listeners
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

skipAdBtn.addEventListener('click', () => {
    tg.showPopup({
        title: 'Skip Level',
        message: 'Watch an ad to skip this level?',
        buttons: [
            {id: 'cancel', type: 'cancel'},
            {id: 'watch', type: 'default', text: 'Watch Ad'}
        ]
    }, (buttonId) => {
        if (buttonId === 'watch') {
            gameState.level++;
            initGame();
        }
    });
});

skipCoinBtn.addEventListener('click', () => {
    if (gameState.coins >= 50) {
        gameState.coins -= 50;
        gameState.level++;
        updateCoins();
        initGame();
    } else {
        tg.showAlert('You need 50 coins to skip!');
    }
});

restartBtn.addEventListener('click', () => {
    initGame();
});

nextBtn.addEventListener('click', () => {
    if (gameState.coins >= 10) {
        gameState.coins -= 10;
        gameState.level++;
        updateCoins();
        initGame();
    } else {
        tg.showPopup({
            title: 'Not Enough Coins',
            message: 'You need 10 coins to proceed. Watch an ad to get 5 coins?',
            buttons: [
                {id: 'close', type: 'cancel'},
                {id: 'watch', type: 'default', text: 'Watch Ad'}
            ]
        }, (buttonId) => {
            if (buttonId === 'watch') {
                gameState.coins += 5;
                updateCoins();
                tg.showAlert('+5 Coins!');
            }
        });
    }
});

// Initialize game
document.addEventListener('DOMContentLoaded', initGame);
