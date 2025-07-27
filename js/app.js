const tg = window.Telegram.WebApp;
tg.expand();

// Initialize User Data
let userData = {
    username: tg.initDataUnsafe?.user?.username || 'Player',
    coins: localStorage.getItem('userCoins') ? parseInt(localStorage.getItem('userCoins')) : 100,
    level: localStorage.getItem('userLevel') ? parseInt(localStorage.getItem('userLevel')) : 1,
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    musicEnabled: localStorage.getItem('musicEnabled') !== 'false',
    theme: localStorage.getItem('theme') || 'light'
};

// Apply saved theme
document.body.classList.toggle('dark', userData.theme === 'dark');

// Display username
document.getElementById('username-display').textContent = `Welcome, ${userData.username}!`;

// Event Listeners
document.getElementById('start-btn').addEventListener('click', () => {
    window.location.href = 'game.html';
});

document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('dropdown-menu').classList.toggle('hidden');
});

document.getElementById('bonus-btn').addEventListener('click', async () => {
    const lastBonusDate = localStorage.getItem('lastBonusDate');
    const today = new Date().toDateString();
    
    if (lastBonusDate !== today) {
        const adCompleted = await showInterstitialAd();
        if (adCompleted) {
            userData.coins += 100;
            localStorage.setItem('userCoins', userData.coins);
            localStorage.setItem('lastBonusDate', today);
            tg.showAlert('Daily bonus of 100 coins claimed!');
        }
    } else {
        tg.showAlert('You already claimed your bonus today!');
    }
});

document.getElementById('shop-btn').addEventListener('click', () => {
    window.location.href = 'shop.html';
});

document.getElementById('settings-btn').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

function showInterstitialAd() {
    return new Promise((resolve) => {
        window.adCompleteCallback = () => resolve(true);
        window.adErrorCallback = () => resolve(false);
    });
}
