// Local Sandbox Game State Machine Configuration
const gameState = {
    score: 0,
    pityCount: 0,
    activeTrend: "Standard Pool",
    boardSize: 4,
    tilesPool: ["🎵", "🎬", "💎", "🔥"], // Representing dynamic cultural icons
    matrix: [],
    selectedTile: null
};

// Initializes the browser board state matrix deterministically
function initBoard() {
    const boardElement = document.getElementById("game-board-matrix");
    if (!boardElement) return;
    boardElement.innerHTML = "";
    gameState.matrix = [];
    gameState.selectedTile = null;

    for (let r = 0; r < gameState.boardSize; r++) {
        gameState.matrix[r] = [];
        for (let c = 0; c < gameState.boardSize; c++) {
            // Pick a random token from our active cultural target index
            const token = gameState.tilesPool[Math.floor(Math.random() * gameState.tilesPool.length)];
            gameState.matrix[r][c] = token;

            const tile = document.createElement("div");
            tile.className = "grid-tile flex items-center justify-center text-3xl bg-gray-900/60 rounded-xl border border-white/5 cursor-pointer select-none shadow-md font-bold";
            tile.innerText = token;
            tile.dataset.row = r;
            tile.dataset.col = c;
            
            // Register interaction point hook
            tile.onclick = () => executeTileInteraction(r, c);
            boardElement.appendChild(tile);
        }
    }
}

function executeTileInteraction(row, col) {
    const boardElement = document.getElementById("game-board-matrix");
    const tiles = boardElement.children;

    if (!gameState.selectedTile) {
        gameState.selectedTile = { row, col };
        highlightSelectedTile(row, col, true);
        return;
    }

    const prevRow = gameState.selectedTile.row;
    const prevCol = gameState.selectedTile.col;
    highlightSelectedTile(prevRow, prevCol, false);

    const isAdjacent = Math.abs(prevRow - row) + Math.abs(prevCol - col) === 1;

    if (isAdjacent) {
        // Swap tokens in matrix
        const temp = gameState.matrix[prevRow][prevCol];
        gameState.matrix[prevRow][prevCol] = gameState.matrix[row][col];
        gameState.matrix[row][col] = temp;

        // Update DOM display
        updateBoardDisplay();

        // Basic match simulation action trigger
        gameState.score += 1500;
        document.getElementById("game-score").innerText = gameState.score.toLocaleString();
        
        // Fire off visual juice pipeline
        triggerDopamineFlash();
        synthesizeVoiceTrigger("Boom! Unbelievable Combo Sequence.");
    } else {
        // Single tap or re-select
        gameState.score += 250;
        document.getElementById("game-score").innerText = gameState.score.toLocaleString();
        triggerDopamineFlash();
    }

    gameState.selectedTile = null;
}

function highlightSelectedTile(row, col, isSelected) {
    const boardElement = document.getElementById("game-board-matrix");
    const index = row * gameState.boardSize + col;
    if (boardElement && boardElement.children[index]) {
        if (isSelected) {
            boardElement.children[index].classList.add("tile-selected");
        } else {
            boardElement.children[index].classList.remove("tile-selected");
        }
    }
}

function updateBoardDisplay() {
    const boardElement = document.getElementById("game-board-matrix");
    if (!boardElement) return;

    for (let r = 0; r < gameState.boardSize; r++) {
        for (let c = 0; c < gameState.boardSize; c++) {
            const index = r * gameState.boardSize + c;
            if (boardElement.children[index]) {
                boardElement.children[index].innerText = gameState.matrix[r][c];
            }
        }
    }
}

function triggerDopamineFlash() {
    const flash = document.getElementById("dopamine-flash-mask");
    if (!flash) return;
    flash.style.opacity = "0.4";
    setTimeout(() => { flash.style.opacity = "0"; }, 80);
}

function synthesizeVoiceTrigger(textPayload) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any pending utterances
        const utterance = new SpeechSynthesisUtterance(textPayload);
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

function triggerGachaPull() {
    gameState.pityCount++;
    if (gameState.pityCount >= 80) {
        gameState.pityCount = 0;
        alert("✨ ULTRA RARE METAHUMAN UNLOCKED! ✨");
        synthesizeVoiceTrigger("Ultra Rare MetaHuman Unlocked!");
    }
    const pityEl = document.getElementById("pity-counter");
    if (pityEl) {
        pityEl.innerText = `${gameState.pityCount} / 80`;
    }
    triggerDopamineFlash();
}

// Kick off board construction upon document completion
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initBoard);
} else {
    initBoard();
}
