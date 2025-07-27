// Initialize Telegram WebApp
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
    coins: parseInt(localStorage.getItem('userCoins')) || 50,
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
    // Update display
    levelDisplay.textContent = `Level: ${gameState.level}`;
    coinBalance.textContent = `Coins: ${gameState.coins}`;
    nextBtn.disabled = true;
    
    // Set bombs/diamonds based on level pattern (19-6, 18-7, 17-8)
    const pattern = (gameState.level - 1) % 3;
    switch(pattern) {
        case 0: // First pattern
            gameState.bombs = 6;
            gameState.diamonds = 19;
            break;
        case 1: // Second pattern
            gameState.bombs = 7;
            gameState.diamonds = 18;
            break;
        case 2: // Third pattern
            gameState.bombs = 8;
            gameState.diamonds = 17;
            break;
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
        
        // Win condition: Find all diamonds
        if (gameState.diamondsFound >= gameState.diamonds) {
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
        
        // Show ad every 3 levels
        if (gameState.level % 3 === 0) {
            showInterstitialAd();
        }
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

function showInterstitialAd() {
    return new Promise((resolve) => {
        // Monetag will handle the ad display
        window.adCompleteCallback = () => resolve(true);
        window.adErrorCallback = () => resolve(false);
        console.log("Triggering Monetag interstitial ad");
    });
}

// Event Listeners
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

skipAdBtn.addEventListener('click', async () => {
    const adCompleted = await showInterstitialAd();
    if (adCompleted) {
        gameState.level++;
        initGame();
    } else {
        tg.showAlert("Couldn't load ad. Please try again.");
    }
});

skipCoinBtn.addEventListener('click', () => {
    if (gameState.coins >= 30) {
        gameState.coins -= 30;
        gameState.level++;
        updateCoins();
        initGame();
    } else {
        tg.showAlert('You need 30 coins to skip!');
    }
});

restartBtn.addEventListener('click', async () => {
    if (gameState.coins >= 5) {
        gameState.coins -= 5;
        updateCoins();
        
        gameState.adCounter++;
        if (gameState.adCounter % 3 === 0) {
            await showInterstitialAd();
        }
        
        initGame();
    } else {
        tg.showAlert('You need 5 coins to restart!');
    }
});

nextBtn.addEventListener('click', () => {
    if (gameState.coins >= 10) {
        gameState.coins -= 10;
        gameState.level++;
        updateCoins();
        initGame();
    } else {
        tg.showAlert('You need 10 coins to proceed!');
    }
});

// Initialize game
document.addEventListener('DOMContentLoaded', initGame);