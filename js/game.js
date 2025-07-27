// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const coinBalance = document.getElementById('coin-balance');
const backBtn = document.getElementById('back-btn');
const skipAdBtn = document.getElementById('skip-ad-btn');
const skipCoinBtn = document.getElementById('skip-coin-btn');
const restartBtn = document.getElementById('restart-btn');

// Game State
let gameState = {
    level: localStorage.getItem('userLevel') ? parseInt(localStorage.getItem('userLevel')) : 1,
    coins: localStorage.getItem('userCoins') ? parseInt(localStorage.getItem('userCoins')) : 0,
    board: [],
    revealed: 0,
    diamondsFound: 0,
    bombs: 0,
    diamonds: 0,
    gameOver: false,
    adCounter: 0,
    lastAdTime: 0
};

// Initialize Game
function initGame() {
    // Update display
    levelDisplay.textContent = `Level: ${gameState.level}`;
    coinBalance.textContent = `Coins: ${gameState.coins}`;
    
    // Determine bombs and diamonds based on level
    if ((gameState.level >= 1 && gameState.level <= 25) || 
        (gameState.level >= 51 && gameState.level <= 75) ||
        (gameState.level >= 101 && gameState.level <= 125) ||
        (gameState.level >= 151 && gameState.level <= 200) ||
        (gameState.level >= 226 && gameState.level <= 250) ||
        (gameState.level >= 301 && gameState.level <= 325) ||
        (gameState.level >= 351 && gameState.level <= 400) ||
        (gameState.level >= 426 && gameState.level <= 450)) {
        gameState.bombs = 5;
        gameState.diamonds = 20;
    } else {
        gameState.bombs = 8;
        gameState.diamonds = 17;
    }
    
    // Generate board
    generateBoard();
    
    // Start timer
    startTimer();
}

// Generate Game Board
function generateBoard() {
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
        const randomIndex = Math.floor(Math.floor(Math.random() * 25));
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

// Handle Cell Click
function handleCellClick(index) {
    if (gameState.gameOver || gameState.board[index].revealed) return;
    
    const cell = gameState.board[index];
    cell.revealed = true;
    gameState.revealed++;
    
    const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
    
    if (cell.isBomb) {
        // Game over
        cellElement.classList.add('bomb');
        cellElement.textContent = '💣';
        gameOver(false);
    } else if (cell.isDiamond) {
        // Found diamond
        cellElement.classList.add('diamond');
        cellElement.textContent = '💎';
        gameState.diamondsFound++;
        
        // Play sound
        playSound('diamond');
        
        // Check win condition
        const requiredDiamonds = gameState.bombs === 5 ? 6 : 5;
        if (gameState.diamondsFound >= requiredDiamonds) {
            gameOver(true);
        }
    } else {
        // Empty cell
        cellElement.classList.add('revealed');
        cellElement.textContent = '';
    }
}

// Game Over
function gameOver(isWin) {
    gameState.gameOver = true;
    
    if (isWin) {
        // Play win sound
        playSound('win');
        
        // Award coins
        const coinsWon = Math.floor(gameState.level * 1.5);
        gameState.coins += coinsWon;
        updateCoins();
        
        // Show win message
        tg.showAlert(`Level Complete! You won ${coinsWon} coins!`);
        
        // Increase level
        gameState.level++;
        localStorage.setItem('userLevel', gameState.level);
        levelDisplay.textContent = `Level: ${gameState.level}`;
        
        // Show ad every 3 levels
        if (gameState.level % 3 === 0) {
            showInterstitialAd();
        }
    } else {
        // Play lose sound
        playSound('lose');
        
        // Show lose message
        tg.showAlert('Game Over! You hit a bomb!');
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

// Update Coins Display
function updateCoins() {
    coinBalance.textContent = `Coins: ${gameState.coins}`;
    localStorage.setItem('userCoins', gameState.coins);
}

// Play Sound
function playSound(type) {
    if (localStorage.getItem('soundEnabled') === 'false') return;
    
    const sound = new Audio();
    sound.src = `assets/sounds/${type}.mp3`;
    sound.play().catch(e => console.log('Sound play failed:', e));
}

// Start Timer
function startTimer() {
    // Timer implementation would go here
}

// Show Interstitial Ad
function showInterstitialAd() {
    // This would be replaced with actual ad implementation
    console.log('Showing interstitial ad');
    // Example with Monetag:
    const adScript = document.createElement('script');
    adScript.src = 'https://example.com/monetag-interstitial.js';
    document.body.appendChild(adScript);
}

// Event Listeners
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

skipAdBtn.addEventListener('click', () => {
    showInterstitialAd();
    setTimeout(() => {
        gameState.level++;
        localStorage.setItem('userLevel', gameState.level);
        initGame();
    }, 1000);
});

skipCoinBtn.addEventListener('click', () => {
    if (gameState.coins >= 50) {
        gameState.coins -= 50;
        updateCoins();
        gameState.level++;
        localStorage.setItem('userLevel', gameState.level);
        initGame();
    } else {
        tg.showAlert('Not enough coins!');
    }
});

restartBtn.addEventListener('click', () => {
    gameState.adCounter++;
    if (gameState.adCounter % 3 === 0) {
        showInterstitialAd();
    }
    initGame();
});

// Initialize ads
function initAds() {
    // Top ad
    const topAdScript = document.createElement('script');
    topAdScript.src = 'https://example.com/monetag.js';
    topAdScript.setAttribute('data-ad-unit', 'TOP_BANNER');
    document.getElementById('ad-top').appendChild(topAdScript);
    
    // Bottom ad
    const bottomAdScript = document.createElement('script');
    bottomAdScript.src = 'https://example.com/monetag.js';
    bottomAdScript.setAttribute('data-ad-unit', 'BOTTOM_BANNER');
    document.getElementById('ad-bottom').appendChild(bottomAdScript);
    
    // Periodic ads
    setInterval(() => {
        const now = Date.now();
        if (now - gameState.lastAdTime > 600000) { // 10 minutes
            showInterstitialAd();
            gameState.lastAdTime = now;
        }
    }, 60000); // Check every minute
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    initAds();
});