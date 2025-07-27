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
    document.getElementById('level-display').textContent = `Level: ${gameState.level}`;
    document.getElementById('coin-balance').textContent = `Coins: ${gameState.coins}`;
    document.getElementById('next-btn').disabled = true;
    
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

// ... (rest of your game.js implementation remains the same)

// Event Listeners
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('restart-btn').addEventListener('click', function() {
    if (gameState.coins >= 5) {
        gameState.coins -= 5;
        updateCoins();
        initGame();
        tg.showAlert("Restarted! -5 coins");
    } else {
        tg.showAlert("Not enough coins to restart!");
    }
});

// Initialize game
document.addEventListener('DOMContentLoaded', initGame);
