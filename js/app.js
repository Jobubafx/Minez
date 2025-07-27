const tg = window.Telegram.WebApp;
tg.expand();

// Initialize user data
const userData = {
    username: tg.initDataUnsafe?.user?.username || 'Player',
    coins: localStorage.getItem('userCoins') || 50,
    level: localStorage.getItem('userLevel') || 1
};

// Display username
document.getElementById('username-display').textContent = `Welcome, ${userData.username}!`;

// Menu toggle
document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('dropdown-menu').classList.toggle('visible');
});

// Navigation
document.getElementById('start-btn').addEventListener('click', () => {
    window.location.href = 'game.html';
});

document.getElementById('shop-btn').addEventListener('click', () => {
    window.location.href = 'shop.html';
});

document.getElementById('settings-btn').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

// Daily Bonus
document.getElementById('bonus-btn').addEventListener('click', () => {
    const lastClaimed = localStorage.getItem('lastBonusClaim');
    const today = new Date().toDateString();
    
    if (lastClaimed !== today) {
        userData.coins += 50;
        localStorage.setItem('userCoins', userData.coins);
        localStorage.setItem('lastBonusClaim', today);
        alert('Daily bonus claimed! +50 coins');
    } else {
        alert('Bonus already claimed today!');
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('dropdown-menu');
    if (!e.target.closest('#menu-btn') && !e.target.closest('.dropdown-menu')) {
        dropdown.classList.remove('visible');
    }
});

// Game state variables
let diamondsCollected = 0;
const DIAMONDS_TO_WIN = 6;
let gameBoard = []; // This would contain your cell data

// When a cell is clicked
function handleCellClick(cellIndex) {
    const cell = gameBoard[cellIndex];
    
    // If cell contains a diamond
    if (cell.hasDiamond) {
        diamondsCollected++;
        cell.hasDiamond = false;
        updateDiamondDisplay();
        
        // Check win condition
        if (diamondsCollected >= DIAMONDS_TO_WIN) {
            handleWin();
        }
    }
    
    // Update cell visual state
    updateCellVisuals(cellIndex);
}

function updateDiamondDisplay() {
    document.getElementById('diamond-counter').textContent = 
        `${diamondsCollected}/${DIAMONDS_TO_WIN} Diamonds`;
}

function handleWin() {
    // Show win message/effects
    alert('Congratulations! You collected 6 diamonds and won the game!');
    
    // Reset game or advance to next level
    resetGame();
}

function resetGame() {
    diamondsCollected = 0;
    initializeGameBoard();
    updateDiamondDisplay();
}

// Example initialization
function initializeGame() {
    // Set up game board with random diamonds
    gameBoard = Array(25).fill().map((_, i) => ({
        index: i,
        hasDiamond: Math.random() < 0.2, // 20% chance to be diamond
        revealed: false
    }));
    
    // Create diamond counter in your HTML
    const counter = document.createElement('div');
    counter.id = 'diamond-counter';
    counter.className = 'diamond-counter';
    counter.textContent = `0/${DIAMONDS_TO_WIN} Diamonds`;
    document.querySelector('.game-info').appendChild(counter);
    
    // Add CSS for diamond counter
    const style = document.createElement('style');
    style.textContent = `
        .diamond-counter {
            font-weight: bold;
            color: #4a76a8;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);
}