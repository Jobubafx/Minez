const tg = window.Telegram.WebApp;
tg.expand();

/***********************/
/* USER DATA & SETUP */
/*********************/

// Initialize user data
const userData = {
    username: tg.initDataUnsafe?.user?.username || 'Player',
    coins: localStorage.getItem('userCoins') || 50,
    level: localStorage.getItem('userLevel') || 1
};

// Display username
document.getElementById('username-display').textContent = `Welcome, ${userData.username}!`;

/***********************/
/* DIAMOND GAME STATE */
/*********************/

let diamondsCollected = 0;
const DIAMONDS_TO_WIN = 6;
let gameBoard = [];
const winScreen = document.createElement('div');
const diamondCounter = document.createElement('div');

/***********************/
/* MENU & NAVIGATION */
/*********************/

// Menu toggle
document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('dropdown-menu').classList.toggle('visible');
});

// Navigation handlers
document.getElementById('start-btn').addEventListener('click', () => {
    // Initialize game before navigating if needed
    window.location.href = 'game.html';
});

document.getElementById('shop-btn').addEventListener('click', () => {
    window.location.href = 'shop.html';
});

document.getElementById('settings-btn').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

/***********************/
/* DAILY BONUS */
/***********************/

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

/***********************/
/* DIAMOND GAME LOGIC */
/***********************/

function initializeDiamondGame() {
    // Only initialize if we're on the game page
    if (!window.location.pathname.includes('game.html')) return;
    
    setupWinScreen();
    setupDiamondCounter();
    resetDiamondGame();
    setupGameBoard();
}

function setupWinScreen() {
    winScreen.id = 'win-screen';
    winScreen.innerHTML = `
        <div class="win-content">
            <h2>🎉 You Win! 🎉</h2>
            <p>You collected all 6 diamonds!</p>
            <div class="diamond-celebration">${'💎'.repeat(6)}</div>
            <button id="play-again-btn" class="win-btn">Play Again</button>
            <button id="next-level-btn" class="win-btn">Next Level</button>
        </div>
    `;
    document.body.appendChild(winScreen);
}

function setupDiamondCounter() {
    diamondCounter.id = 'diamond-counter';
    diamondCounter.className = 'diamond-counter';
    diamondCounter.innerHTML = `
        <span class="diamond-icon">💎</span>
        <span class="diamond-count">${diamondsCollected}/${DIAMONDS_TO_WIN}</span>
    `;
    document.querySelector('.game-header').appendChild(diamondCounter);
}

function setupGameBoard() {
    // Create or connect to existing game board
    const boardContainer = document.querySelector('.board-container');
    if (!boardContainer) return;
    
    // Initialize or connect to existing cells
    // ... (your existing board setup code)
}

function handleCellClick(cellIndex) {
    const cell = gameBoard[cellIndex];
    const cellElement = document.querySelector(`.cell[data-index="${cellIndex}"]`);
    
    if (cell.hasDiamond && !cell.revealed) {
        cell.revealed = true;
        diamondsCollected++;
        
        // Animation for diamond collection
        cellElement.classList.add('diamond-found');
        setTimeout(() => {
            cellElement.innerHTML = '💎';
            cellElement.classList.add('pulse');
            
            // Update counter with animation
            diamondCounter.querySelector('.diamond-count').textContent = 
                `${diamondsCollected}/${DIAMONDS_TO_WIN}`;
            diamondCounter.classList.add('counter-pop');
            setTimeout(() => diamondCounter.classList.remove('counter-pop'), 300);
            
            // Check win condition
            if (diamondsCollected >= DIAMONDS_TO_WIN) {
                setTimeout(showWinScreen, 800);
            }
        }, 200);
    }
}

function showWinScreen() {
    winScreen.style.display = 'flex';
    setTimeout(() => winScreen.classList.add('visible'), 10);
    
    // Reward coins for winning
    userData.coins += 100;
    localStorage.setItem('userCoins', userData.coins);
    
    // Animate celebration diamonds
    const celebrationDiamonds = winScreen.querySelectorAll('.diamond-celebration span');
    celebrationDiamonds.forEach((diamond, i) => {
        setTimeout(() => {
            diamond.style.opacity = '1';
            diamond.style.transform = 'translateY(0)';
        }, i * 100);
    });
    
    // Setup button handlers
    document.getElementById('play-again-btn').onclick = resetDiamondGame;
    document.getElementById('next-level-btn').onclick = nextLevel;
}

function resetDiamondGame() {
    // Hide win screen
    winScreen.classList.remove('visible');
    setTimeout(() => winScreen.style.display = 'none', 300);
    
    // Reset game state
    diamondsCollected = 0;
    diamondCounter.querySelector('.diamond-count').textContent = 
        `${diamondsCollected}/${DIAMONDS_TO_WIN}`;
    
    // Create new game board with random diamonds
    gameBoard = Array(25).fill().map((_, i) => ({
        index: i,
        hasDiamond: Math.random() < 0.24, // ~6 diamonds on average
        revealed: false
    }));
    
    // Update UI
    renderBoard();
}

function nextLevel() {
    userData.level++;
    localStorage.setItem('userLevel', userData.level);
    resetDiamondGame();
}

function renderBoard() {
    // Your existing board rendering logic
    // Connect cells to handleCellClick
}

/***********************/
/* STYLES & INIT */
/***********************/

// Add win screen styles
const styleElement = document.createElement('style');
styleElement.textContent = `
    #win-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    /* ... (rest of the CSS styles from your diamond game) ... */
`;
document.head.appendChild(styleElement);

/***********************/
/* INITIALIZATION */
/***********************/

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app components
    // Initialize diamond game if on game page
    if (window.location.pathname.includes('game.html')) {
        initializeDiamondGame();
    }
});