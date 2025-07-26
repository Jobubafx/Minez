const tg = window.Telegram.WebApp;
tg.expand();

// DOM Elements
const startBtn = document.getElementById('start-btn');
const menuBtn = document.getElementById('menu-btn');
const bonusBtn = document.getElementById('bonus-btn');
const shopBtn = document.getElementById('shop-btn');
const settingsBtn = document.getElementById('settings-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const usernameDisplay = document.getElementById('username-display');

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
usernameDisplay.textContent = `Welcome, ${userData.username}!`;

// Event Listeners
startBtn.addEventListener('click', () => {
    window.location.href = 'game.html';
});

menuBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hidden');
});

bonusBtn.addEventListener('click', () => {
    const lastBonusDate = localStorage.getItem('lastBonusDate');
    const today = new Date().toDateString();
    
    if (lastBonusDate !== today) {
        userData.coins += 100;
        localStorage.setItem('userCoins', userData.coins);
        localStorage.setItem('lastBonusDate', today);
        tg.showAlert('Daily bonus of 100 coins claimed!');
    } else {
        tg.showAlert('You already claimed your bonus today!');
    }
});

shopBtn.addEventListener('click', () => {
    window.location.href = 'shop.html';
    dropdownMenu.classList.add('hidden');
});

settingsBtn.addEventListener('click', () => {
    window.location.href = 'settings.html';
    dropdownMenu.classList.add('hidden');
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
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initAds();
});
