const tg = window.Telegram.WebApp;

// DOM Elements
const backBtn = document.getElementById('back-btn');
const buyBtns = document.querySelectorAll('.buy-btn');

// Event Listeners
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

buyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const amount = parseInt(btn.dataset.amount);
        const price = parseFloat(btn.dataset.price);
        
        tg.showPopup({
            title: 'Confirm Purchase',
            message: `Buy ${amount} coins for $${price}?`,
            buttons: [
                {id: 'cancel', type: 'cancel'},
                {id: 'buy', type: 'default', text: 'Buy'}
            ]
        }, (buttonId) => {
            if (buttonId === 'buy') {
                const currentCoins = parseInt(localStorage.getItem('userCoins')) || 100;
                localStorage.setItem('userCoins', currentCoins + amount);
                tg.showAlert(`Purchase complete! You received ${amount} coins.`);
            }
        });
    });
});

// Initialize ads
function initAds() {
    const topAdScript = document.createElement('script');
    topAdScript.src = 'https://example.com/monetag.js';
    topAdScript.setAttribute('data-ad-unit', 'TOP_BANNER');
    document.getElementById('ad-top').appendChild(topAdScript);
    
    const bottomAdScript = document.createElement('script');
    bottomAdScript.src = 'https://example.com/monetag.js';
    bottomAdScript.setAttribute('data-ad-unit', 'BOTTOM_BANNER');
    document.getElementById('ad-bottom').appendChild(bottomAdScript);
}

document.addEventListener('DOMContentLoaded', initAds);
