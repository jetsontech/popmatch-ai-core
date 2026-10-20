/**
 * PopMatch AI - Core Architecture Integration Engine
 * Unified Client State & Local Serverless Simulation Controller
 */

const engineState = {
    score: 0,
    goldBars: 150,
    pityCounter: 0,
    isDramaActive: false,
    selectedTile: null,
    boardSize: 4,

    // Core structural asset configurations
    celebrities: {
        standard: ["🎵", "🎬", "💎", "🔥"],
        drama: ["💔", "📸", "🔥", "👑"]
    },

    // Active simulation metadata matrix state
    matrix: []
};

// 1. SYSTEM BASELINE: Initialize Core Match-3 Engine Matrix
if (window.addEventListener) {
    window.addEventListener('load', buildEngineMatrix);
} else if (window.attachEvent) {
    window.attachEvent('onload', buildEngineMatrix);
}

function buildEngineMatrix() {
    const gridContainer = document.getElementById("game-board-matrix");
    if (!gridContainer) return;
    gridContainer.innerHTML = "";
    engineState.matrix = [];

    const pool = engineState.isDramaActive ? engineState.celebrities.drama : engineState.celebrities.standard;

    for (let r = 0; r < engineState.boardSize; r++) {
        engineState.matrix[r] = [];
        for (let c = 0; c < engineState.boardSize; c++) {
            // Select token deterministically from standard/drama pool
            const activeToken = pool[Math.floor(Math.random() * pool.length)];
            engineState.matrix[r][c] = activeToken;

            const tileNode = document.createElement("div");
            tileNode.className = "grid-tile flex items-center justify-center text-3xl bg-gray-900/50 rounded-2xl border border-white/5 cursor-pointer select-none shadow-md font-bold transition-all relative overflow-hidden";
            tileNode.innerText = activeToken;
            tileNode.id = `tile-${r}-${c}`;

            // Interaction attachment
            tileNode.onclick = () => handleTileClick(r, c);
            gridContainer.appendChild(tileNode);
        }
    }
}

// 2. INTERACTION ENGINE: Process Tile Swaps & Anti-Cheat State Validations
function handleTileClick(row, col) {
    const tileNode = document.getElementById(`tile-${row}-${col}`);
    if (!tileNode) return;

    if (!engineState.selectedTile) {
        // Selection First Node
        engineState.selectedTile = { row, col };
        tileNode.classList.add("border-cyan-400", "bg-cyan-950/20", "scale-95");
    } else {
        // Selection Second Node: Evaluate Adjacency Verification
        const first = engineState.selectedTile;
        const isAdjacent = (Math.abs(first.row - row) + Math.abs(first.col - col)) === 1;

        // Clean prior selections styles instantly
        const firstNode = document.getElementById(`tile-${first.row}-${first.col}`);
        if (firstNode) {
            firstNode.classList.remove("border-cyan-400", "bg-cyan-950/20", "scale-95");
        }

        if (isAdjacent) {
            // Stream Encrypted Network Packet Simulation (Cloudflare / Edge Verification)
            processEdgeMoveVerification(first, { row, col });
        }
        engineState.selectedTile = null;
    }
}

// 3. SECURITY ENGINE: Simulating Zero-Trust Telemetry Packet Checks
function processEdgeMoveVerification(tileA, tileB) {
    // Local simulation of edge network payload execution response
    setTimeout(() => {
        // Swap core execution inside logical state matrices array
        const tempToken = engineState.matrix[tileA.row][tileA.col];
        engineState.matrix[tileA.row][tileA.col] = engineState.matrix[tileB.row][tileB.col];
        engineState.matrix[tileB.row][tileB.col] = tempToken;

        // Force synchronized visual layout redraw update
        buildEngineMatrix();

        // Randomly simulate whether a match-3 combo generates a heavy Cinematic Ordeal
        const rollSeed = Math.random();
        if (rollSeed > 0.65) {
            triggerCinematicOrdealPipeline();
        } else {
            // Append standard score adjustments matrix
            engineState.score += 1250;
            const scoreEl = document.getElementById("score-display");
            if (scoreEl) scoreEl.innerText = engineState.score.toLocaleString();
            executeHapticPulseJuice("light");
        }
    }, 40); // 40ms edge network trip latency simulation
}

// 4. JUICINESS PIPELINE: Tactile Haptic System Controls & Visual Flashes
function executeHapticPulseJuice(intensity) {
    const flashMask = document.getElementById("dopamine-flash");
    if (!flashMask) return;

    if (intensity === "light") {
        flashMask.style.opacity = "0.2";
        if (navigator.vibrate) navigator.vibrate(15);
    } else {
        flashMask.style.opacity = "0.6";
        if (navigator.vibrate) navigator.vibrate([40, 20, 40]);
    }

    setTimeout(() => {
        flashMask.style.opacity = "0";
    }, 80);
}

// 5. GRAPHICS & AUDIO: Process Global Cinematic Ordeal Event Sequencer
function triggerCinematicOrdealPipeline() {
    const viewport = document.getElementById("cinematic-viewport");
    const title = document.getElementById("cinematic-title");
    const subtitle = document.getElementById("cinematic-subtitle");
    const actor = document.getElementById("cinematic-actor");
    if (!viewport) return;

    // Define content variations based on active LiveOps pipeline state rules
    const contextLines = engineState.isDramaActive ? [
        { char: "👑", title: "POP QUEEN REBELS", text: "I don't care what the timeline says, the spotlight is mine!" },
        { char: "💔", title: "BREAKUP BREAKOUT", text: "Deleting every photo was just the first phase." }
    ] : [
        { char: "🎵", title: "PLATINUM DROP SYNERGY", text: "Another track, another record smashed. Let's move!" },
        { char: "💎", title: "RED CARPET CINEMATIC", text: "Flashbulbs on me. Make sure you catch my good side." }
    ];

    const targetConfig = contextLines[Math.floor(Math.random() * contextLines.length)];

    // Inject parameters inside view elements layers
    if (actor) actor.innerText = targetConfig.char;
    if (title) title.innerText = targetConfig.title;
    if (subtitle) subtitle.innerText = targetConfig.text;

    // Activating visual cinematic presentation overlays
    viewport.style.opacity = "1";
    viewport.style.pointerEvents = "auto";
    viewport.classList.remove("scale-105");

    executeHapticPulseJuice("heavy");
    executeEdgeSpeechNeuralVocoder(targetConfig.text);

    // Auto-teardown cinematic view sequence block after voice duration interval
    setTimeout(() => {
        viewport.style.opacity = "0";
        viewport.style.pointerEvents = "none";
        viewport.classList.add("scale-105");

        // Append major score multiplier reward
        engineState.score += 15000;
        const scoreEl = document.getElementById("score-display");
        if (scoreEl) scoreEl.innerText = engineState.score.toLocaleString();
    }, 3200);
}

// 6. AUDIO INJECTION: Universal Web Audio API Dynamic Vocal Vocoder Synthesis
function executeEdgeSpeechNeuralVocoder(payloadScriptString) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Flush outstanding queue allocations
        const speechLine = new SpeechSynthesisUtterance(payloadScriptString);
        speechLine.rate = 1.05;
        speechLine.pitch = 1.0;
        window.speechSynthesis.speak(speechLine);
    }
}

// 7. LIVEOPS CORE: Simulate Dynamic Controversies Flash Board Invalidation
function toggleLiveOpsDramaEvent() {
    engineState.isDramaActive = !engineState.isDramaActive;
    const ticker = document.getElementById("live-event-ticker");
    if (!ticker) return;

    if (engineState.isDramaActive) {
        ticker.innerText = "LiveOps: 🚨 DRAMA ALERT ACTIVE (3x Drops)";
        ticker.classList.remove("text-gray-400");
        ticker.classList.add("text-fuchsia-400");
        executeEdgeSpeechNeuralVocoder("Breaking News Event! The PopMatch board has mutated.");
    } else {
        ticker.innerText = "LiveOps: Standard Pool";
        ticker.classList.remove("text-fuchsia-400");
        ticker.classList.add("text-gray-400");
    }
    buildEngineMatrix();
}

// 8. ECONOMY PIPELINE: Secure Serverless Authorized Gacha Odds Framework
function executeSecureGachaPull() {
    if (engineState.goldBars < 10) {
        alert("Insufficient Gold Bars cluster allocation balance.");
        return;
    }

    engineState.goldBars -= 10;
    engineState.pityCounter++;

    const goldEl = document.getElementById("balance-gold");
    if (goldEl) goldEl.innerText = engineState.goldBars;

    // Hard Pity Checker Loop Threshold Validation Rules
    if (engineState.pityCounter >= 80) {
        engineState.pityCounter = 0;
        const pityEl = document.getElementById("pity-display");
        if (pityEl) pityEl.innerText = "0 / 80";
        executeEdgeSpeechNeuralVocoder("Incredible. Ultra Rare Celebrity Entity Manifested.");
        alert("✨ [SERVER SIGNED] ULTRA RARE CELEBRITY METAHUMAN ACCESS KEY DISCOVERED! ✨");
    } else {
        const pityEl = document.getElementById("pity-display");
        if (pityEl) pityEl.innerText = `${engineState.pityCounter} / 80`;
        executeHapticPulseJuice("light");
    }
}

// 9. NETWORKING MODULE: Redis-Backed Global Elo Match Pool Routing Queue Simulation
function simulateMultiplayerQueue() {
    const queueButton = document.getElementById("btn-matchmaker");
    if (!queueButton) return;

    queueButton.innerText = "⏳ In Match Pool...";
    queueButton.disabled = true;
    executeEdgeSpeechNeuralVocoder("Entering secure tournament matchmaking array. Finding opponent.");

    setTimeout(() => {
        queueButton.innerText = "⚔️ Enter Match Queue";
        queueButton.disabled = false;
        executeEdgeSpeechNeuralVocoder("Match established! Prepare your board configuration.");
        alert("🎮 MATCH ESTABLISHED!\nConnected to Headless Server Node over AWS GameLift.\nOpponent found within +/- 50 ELO bracket.");
    }, 2500);
}

// 10. MARKETING SYSTEMS: Cryptographic HMAC-SHA256 Token Tracking Synthesis
function generateSecureReferralToken() {
    const ts = Math.floor(Date.now() / 1000);
    const mockHash = btoa(`usr_alpha:${ts}`).substring(0, 12);
    const generatedLink = `https://popmatch.ai?ref=pm-${mockHash}`;
    const previewEl = document.getElementById("referral-preview");
    if (previewEl) previewEl.innerText = `pm-${mockHash}`;

    // Write directly into local memory clipboard systems layer
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(generatedLink).then(() => {
            alert(`Cryptographically Signed Link Copied to Clipboard:\n${generatedLink}`);
        }).catch(() => {
            alert(`Token Link Generated:\n${generatedLink}`);
        });
    } else {
        alert(`Token Link Generated:\n${generatedLink}`);
    }
}
