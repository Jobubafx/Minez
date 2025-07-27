const tg = window.Telegram.WebApp;
tg.expand();

// ... (keep your existing setup code)

document.getElementById('bonus-btn').addEventListener('click', async function() {
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
        tg.showAlert('Bonus already claimed today!');
    }
});

function showInterstitialAd() {
    return new Promise((resolve) => {
        window.adCompleteCallback = () => resolve(true);
        window.adErrorCallback = () => resolve(false);
    });
}
