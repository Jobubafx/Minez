const tg = window.Telegram.WebApp;

// DOM Elements
const backBtn = document.getElementById('back-btn');
const soundToggle = document.getElementById('sound-toggle');
const musicToggle = document.getElementById('music-toggle');
const themeSelector = document.getElementById('theme-selector');

// Load saved settings
soundToggle.checked = localStorage.getItem('soundEnabled') !== 'false';
musicToggle.checked = localStorage.getItem('musicEnabled') !== 'false';
themeSelector.value = localStorage.getItem('theme') || 'light';

// Event Listeners
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

soundToggle.addEventListener('change', (e) => {
    localStorage.setItem('soundEnabled', e.target.checked);
});

musicToggle.addEventListener('change', (e) => {
    localStorage.setItem('musicEnabled', e.target.checked);
});

themeSelector.addEventListener('change', (e) => {
    localStorage.setItem('theme', e.target.value);
    document.body.classList.toggle('dark', e.target.value === 'dark');
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.toggle('dark', themeSelector.value === 'dark');
});
