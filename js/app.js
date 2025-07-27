const tg = window.Telegram.WebApp;
tg.expand();

// Initialize elements
const menuBtn = document.getElementById('menu-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

// Toggle dropdown menu
menuBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('visible');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('visible');
    }
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
    alert('Daily bonus claimed!');
});