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