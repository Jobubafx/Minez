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
    // ... (keep your existing init code)
}

function showInterstitialAd() {
    return new Promise((resolve) => {
        window.adCompleteCallback = () => resolve(true);
        window.adErrorCallback = () => resolve(false);
        console.log("Monetag interstitial triggered");
    });
}

// Skip Level with Ad
document.getElementById('skip-ad-btn').addEventListener('click', async function() {
    const adCompleted = await showInterstitialAd();
    if (adCompleted) {
        gameState.level++;
        initGame();
        tg.showAlert("Level skipped!");
    } else {
        tg.showAlert("Ad not available - try again later");
    }
});

// Restart Level (costs 5 coins)
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

// Game Over with Ad every 3 levels
async function gameOver(isWin) {
    gameState.gameOver = true;
    
    if (isWin) {
        gameState.coins += 10;
        updateCoins();
        document.getElementById('next-btn').disabled = false;
        
        // Show ad every 3 levels
        if (gameState.level % 3 === 0) {
            await showInterstitialAd();
        }
        
        tg.showAlert(`Level Complete! +10 Coins!`);
    }
    
    // ... (rest of your gameOver code)
}

// ... (keep other existing functions)
