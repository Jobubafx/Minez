document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let diamondsCollected = 0;
    const DIAMONDS_TO_WIN = 4;
    const totalCells = 25;
    let gameBoard = [];
    
    // DOM elements
    const diamondCounter = document.querySelector('.diamond-counter');
    const winScreen = document.getElementById('win-screen');
    const gameBoardElement = document.getElementById('game-board');
    const diamondCountElement = document.querySelector('.diamond-count');

    // Initialize game
    function initGame() {
        // Reset game state
        diamondsCollected = 0;
        gameBoard = [];
        gameBoardElement.innerHTML = '';
        updateDiamondCounter();
        
  function initGame() {
    // ... existing code ...
    
    // Generate diamonds (4 random positions instead of 6)
    const diamondPositions = [];
    while (diamondPositions.length < DIAMONDS_TO_WIN) {  // Now uses DIAMONDS_TO_WIN (4)
        const randomPos = Math.floor(Math.random() * totalCells);
        if (!diamondPositions.includes(randomPos)) {
            diamondPositions.push(randomPos);
        }
    }
    
    // ... rest of the code ...
}

        // Create game board
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.dataset.hasDiamond = diamondPositions.includes(i);
            cell.addEventListener('click', handleCellClick);
            gameBoardElement.appendChild(cell);
        }
    }

    // Handle cell clicks
    function handleCellClick(e) {
        const cell = e.target;
        const hasDiamond = cell.dataset.hasDiamond === 'true';
        const alreadyRevealed = cell.classList.contains('revealed');

        if (alreadyRevealed) return;

        if (hasDiamond) {
            // Diamond found!
            diamondsCollected++;
            cell.classList.add('revealed', 'diamond-found');
            
            // Visual feedback
            setTimeout(() => {
                cell.innerHTML = '💎';
                cell.classList.add('pulse');
                updateDiamondCounter();
                
                // Check win condition
                if (diamondsCollected >= DIAMONDS_TO_WIN) {
                    setTimeout(showWinScreen, 1000);
                }
            }, 200);
        } else {
            // Regular cell
            cell.classList.add('revealed');
        }
    }

    // Update counter display
    function updateDiamondCounter() {
        diamondCountElement.textContent = `${diamondsCollected}/${DIAMONDS_TO_WIN}`;
        diamondCounter.classList.add('counter-pop');
        setTimeout(() => diamondCounter.classList.remove('counter-pop'), 300);
    }

    // Show win screen
    function showWinScreen() {
        winScreen.style.display = 'flex';
        setTimeout(() => winScreen.classList.add('visible'), 10);
    }

    // Win screen buttons
    document.getElementById('play-again-btn').addEventListener('click', () => {
        winScreen.classList.remove('visible');
        setTimeout(() => {
            winScreen.style.display = 'none';
            initGame();
        }, 300);
    });

    document.getElementById('next-level-btn').addEventListener('click', () => {
        // Add level progression logic here
        winScreen.classList.remove('visible');
        setTimeout(() => {
            winScreen.style.display = 'none';
            initGame();
        }, 300);
    });

    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Initialize the game
    initGame();
});