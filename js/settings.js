const tg = window.Telegram.WebApp;

// Load saved settings
const soundToggle = document.getElementById('sound-toggle');
const musicToggle = document.getElementById('music-toggle');
const themeSelector = document.getElementById('theme-selector');

soundToggle.checked = localStorage.getItem('soundEnabled') !== 'false';
musicToggle.checked = localStorage.getItem('musicEnabled') !== 'false';
themeSelector.value = localStorage.getItem('theme') || 'light';

// Apply theme immediately
document.body.classList.toggle('dark', themeSelector.value === 'dark');

// Event listeners
themeSelector.addEventListener('change', function() {
    const isDark = this.value === 'dark';
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('theme', this.value);
});

// Back button
document.getElementById('back-btn').addEventListener('click', function() {
    window.location.href = 'index.html';
});