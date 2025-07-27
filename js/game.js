document.addEventListener('DOMContentLoaded', function() {
    // Game configuration
    const DIAMONDS_TO_WIN = 4;  // Changed to 4 diamonds
    const totalCells = 25;
    
    // Game state
    let diamondsCollected = 0;
    let gameBoard = [];
    
    // DOM elements
    const diamondCounter = document.querySelector('.diamond-counter');
    const diamondCountElement = document.querySelector('.diamond-count');
    const winScreen = document.getElementById('win-screen');
    const gameBoardElement = document.getElementById('game-board');

    // Initialize game with 4 diamonds
    function initGame() {
        diamondsCollected = 0;
        gameBoardElement.innerHTML = '';
        updateDiamondCounter();
        
        // Place exactly 4 diamonds
        const diamondPositions = [];
        while (diamondPositions.length < DIAMONDS_TO_WIN) {
            const randomPos = Math.floor(Math.random() * totalCells);
            if (!diamondPositions.includes(randomPos)) {
                diamondPositions.push(randomPos);
            }
        }

        // Create cells
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.dataset.hasDiamond = diamondPositions.includes(i);
            cell.addEventListener('click', handleCellClick);
            gameBoardElement.appendChild(cell);
        }
    }

    function handleCellClick(e) {
        const cell = e.target;
        if (cell.classList.contains('revealed')) return;
        
        cell.classList.add('revealed');
        
        if (cell.dataset.hasDiamond === 'true') {
            diamondsCollected++;
            cell.classList.add('diamond-found');
            
            setTimeout(() => {
                cell.innerHTML = '💎';
                cell.classList.add('pulse');
                updateDiamondCounter();
                
                if (diamondsCollected >= DIAMONDS_TO_WIN) {
                    setTimeout(showWinScreen, 800);
                }
            }, 200);
        }
    }

    function updateDiamondCounter() {
        diamondCountElement.textContent = `${diamondsCollected}/${DIAMONDS_TO_WIN}`;
        diamondCounter.classList.add('counter-pop');
        setTimeout(() => diamondCounter.classList.remove('counter-pop'), 300);
    }

    // ... rest of your existing game.js code (win screen, buttons, etc) ...
    
    initGame();
});