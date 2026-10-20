/**
 * PopMatch AI — Core Web Prototype Game Engine
 * Implements deterministic Match-3 logic, MetaHuman blendshape reactions,
 * Dopamine Audio/Visual Juice, LiveOps Drama Spikes, and Gacha Simulator.
 */

// --- 1. Sound & Juice Synthesizer (Web Audio API) ---
class AudioJuiceEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playPop(freq = 440, duration = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio unavailable", e);
    }
  }

  playComboChord(streak) {
    if (!this.enabled) return;
    const baseFreqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C Major arpeggios
    const root = baseFreqs[Math.min(streak, baseFreqs.length - 1)];

    this.playPop(root, 0.12);
    setTimeout(() => this.playPop(root * 1.25, 0.14), 60);
  }

  playCinematicBassDrop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio bass drop unavailable", e);
    }
  }
}

// --- 2. Celebrity Roster Definitions ---
const CELEBRITIES = [
  {
    id: "cel_taylor_swift",
    name: "Taylor Swift",
    emoji: "👸🏼",
    tier: "ULTRA_RARE",
    color: "#ff2a85",
    voiceLine: "Karma is my boyfriend!",
    expression: "Gloat"
  },
  {
    id: "cel_bruno_mars",
    name: "Bruno Mars",
    emoji: "🕶️",
    tier: "ULTRA_RARE",
    color: "#ffb800",
    voiceLine: "Too hot to handle on the floor!",
    expression: "Smirk"
  },
  {
    id: "cel_dua_lipa",
    name: "Dua Lipa",
    emoji: "💃🏻",
    tier: "RARE",
    color: "#00f5ff",
    voiceLine: "Don't show up, don't come out!",
    expression: "Wink"
  },
  {
    id: "cel_the_weeknd",
    name: "The Weeknd",
    emoji: "🎙️",
    tier: "RARE",
    color: "#8a2be2",
    voiceLine: "Blinding lights across the red carpet!",
    expression: "Cool"
  },
  {
    id: "cel_drake",
    name: "Drake",
    emoji: "🦉",
    tier: "RARE",
    color: "#00e676",
    voiceLine: "Started from the bottom, now we're here!",
    expression: "Side-Eye"
  },
  {
    id: "cel_beyonce",
    name: "Beyoncé",
    emoji: "👑",
    tier: "ULTRA_RARE",
    color: "#ffd700",
    voiceLine: "Bow down to the Queen!",
    expression: "Majestic"
  }
];

// --- 3. Core Match-3 Game Logic ---
class PopMatchGame {
  constructor() {
    this.rows = 8;
    this.cols = 8;
    this.grid = [];
    this.selectedTile = null;
    this.isProcessing = false;

    this.score = 0;
    this.comboStreak = 0;
    this.movesLeft = 30;
    this.multiplier = 1.0;
    this.moveIndex = 0;

    // Currency & Pity state
    this.gold = 150;
    this.clout = 4200;
    this.pityCounter = 14;

    // LiveOps state
    this.isDramaActive = true;
    this.boostedPairs = ["cel_taylor_swift", "cel_drake"];

    this.audio = new AudioJuiceEngine();

    this.initDOM();
    this.initBoard();
    this.renderRoster();
    this.attachEventListeners();
  }

  initDOM() {
    this.boardEl = document.getElementById("game-board");
    this.scoreEl = document.getElementById("current-score");
    this.comboEl = document.getElementById("combo-streak");
    this.movesEl = document.getElementById("moves-left");
    this.multiplierEl = document.getElementById("active-multiplier");
    this.goldEl = document.getElementById("gold-balance");
    this.cloutEl = document.getElementById("clout-balance");
    this.telemetryEl = document.getElementById("telemetry-log");
    this.flashOverlay = document.getElementById("flash-overlay");
    this.cinematicModal = document.getElementById("cinematic-overlay");
  }

  initBoard() {
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        let picked;
        do {
          picked = this.getRandomCelebrity();
        } while (
          (r >= 2 && this.grid[r - 1][c].id === picked.id && this.grid[r - 2][c].id === picked.id) ||
          (c >= 2 && this.grid[r][c - 1].id === picked.id && this.grid[r][c - 2].id === picked.id)
        );
        this.grid[r][c] = { ...picked, isPower: false };
      }
    }
    this.renderBoard();
  }

  getRandomCelebrity() {
    // If Drama event is active, boosted celebrities have 3.0x drop weight
    if (this.isDramaActive && Math.random() < 0.45) {
      const boostedId = this.boostedPairs[Math.floor(Math.random() * this.boostedPairs.length)];
      return CELEBRITIES.find(c => c.id === boostedId) || CELEBRITIES[0];
    }
    return CELEBRITIES[Math.floor(Math.random() * CELEBRITIES.length)];
  }

  renderBoard() {
    this.boardEl.innerHTML = "";
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const item = this.grid[r][c];
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.row = r;
        tile.dataset.col = c;
        if (item.isPower) tile.classList.add("power-player");

        if (this.selectedTile && this.selectedTile.r === r && this.selectedTile.c === c) {
          tile.classList.add("selected");
        }

        tile.innerHTML = `
          <div class="avatar-emoji">${item.emoji}</div>
          <div class="expression-tag">${item.expression}</div>
        `;

        tile.addEventListener("click", () => this.handleTileClick(r, c));
        this.boardEl.appendChild(tile);
      }
    }
  }

  handleTileClick(r, c) {
    if (this.isProcessing || this.movesLeft <= 0) return;

    if (!this.selectedTile) {
      this.selectedTile = { r, c };
      this.audio.playPop(300, 0.05);
      this.renderBoard();
      return;
    }

    const { r: r1, c: c1 } = this.selectedTile;
    const isAdjacent = Math.abs(r1 - r) + Math.abs(c1 - c) === 1;

    if (!isAdjacent) {
      // Re-select if not adjacent
      this.selectedTile = { r, c };
      this.audio.playPop(300, 0.05);
      this.renderBoard();
      return;
    }

    // Execute move swap
    this.selectedTile = null;
    this.executeSwap(r1, c1, r, c);
  }

  async executeSwap(r1, c1, r2, c2) {
    this.isProcessing = true;
    this.movesLeft--;
    this.movesEl.textContent = this.movesLeft;

    // Swap in grid state
    const temp = this.grid[r1][c1];
    this.grid[r1][c1] = this.grid[r2][c2];
    this.grid[r2][c2] = temp;
    this.renderBoard();

    // Check matches
    const matches = this.findMatches();

    if (matches.length === 0) {
      // Invalid move, revert
      this.audio.playPop(200, 0.15);
      await this.sleep(220);
      this.grid[r2][c2] = this.grid[r1][c1];
      this.grid[r1][c1] = temp;
      this.renderBoard();
      this.logTelemetry(r1, c1, r2, c2, false, 0);
      this.isProcessing = false;
      return;
    }

    // Valid move
    this.moveIndex++;
    this.logTelemetry(r1, c1, r2, c2, true, matches.length);
    await this.processCascades(matches);
    this.isProcessing = false;
  }

  findMatches() {
    const matches = [];

    // Horizontal check
    for (let r = 0; r < this.rows; r++) {
      let streak = 1;
      for (let c = 1; c <= this.cols; c++) {
        if (c < this.cols && this.grid[r][c].id === this.grid[r][c - 1].id) {
          streak++;
        } else {
          if (streak >= 3) {
            const cells = [];
            for (let k = c - streak; k < c; k++) cells.push({ r, c: k });
            matches.push({
              celebrity: this.grid[r][c - 1],
              count: streak,
              cells
            });
          }
          streak = 1;
        }
      }
    }

    // Vertical check
    for (let c = 0; c < this.cols; c++) {
      let streak = 1;
      for (let r = 1; r <= this.rows; r++) {
        if (r < this.rows && this.grid[r][c].id === this.grid[r - 1][c].id) {
          streak++;
        } else {
          if (streak >= 3) {
            const cells = [];
            for (let k = r - streak; k < r; k++) cells.push({ r: k, c });
            matches.push({
              celebrity: this.grid[r - 1][c],
              count: streak,
              cells
            });
          }
          streak = 1;
        }
      }
    }

    return matches;
  }

  async processCascades(initialMatches) {
    let currentMatches = initialMatches;
    let cascadeStep = 0;

    while (currentMatches.length > 0) {
      cascadeStep++;
      this.comboStreak++;
      this.comboEl.textContent = `${this.comboStreak}x`;

      let hasCinematic = false;
      let cinematicItem = null;

      for (const m of currentMatches) {
        // Calculate points
        let basePts = m.count * 100;
        let matchMultiplier = this.multiplier;

        // Check Drama multiplier
        if (this.isDramaActive && this.boostedPairs.includes(m.celebrity.id)) {
          matchMultiplier *= 3.0;
        }

        const awarded = Math.round(basePts * matchMultiplier * this.comboStreak);
        this.score += awarded;
        this.clout += Math.round(awarded / 10);
        this.scoreEl.textContent = this.score.toLocaleString();
        this.cloutEl.textContent = this.clout.toLocaleString();

        if (m.count >= 5 || (m.count >= 4 && this.isDramaActive)) {
          hasCinematic = true;
          cinematicItem = m;
        }

        // Highlight clearing tiles
        for (const cell of m.cells) {
          const domTile = document.querySelector(`.tile[data-row='${cell.r}'][data-col='${cell.c}']`);
          if (domTile) domTile.classList.add("clearing");
          this.grid[cell.r][cell.c] = null;
        }
      }

      this.audio.playComboChord(this.comboStreak);

      if (hasCinematic && cinematicItem) {
        await this.triggerCinematicOrdeal(cinematicItem);
      }

      await this.sleep(280);

      // Cascade tiles down
      this.cascadeTiles();
      this.renderBoard();
      await this.sleep(200);

      currentMatches = this.findMatches();
    }

    // Reset combo after quiet period
    setTimeout(() => {
      this.comboStreak = 0;
      this.comboEl.textContent = `0x`;
    }, 1200);
  }

  cascadeTiles() {
    for (let c = 0; c < this.cols; c++) {
      let emptyRow = this.rows - 1;
      for (let r = this.rows - 1; r >= 0; r--) {
        if (this.grid[r][c] !== null) {
          if (emptyRow !== r) {
            this.grid[emptyRow][c] = this.grid[r][c];
            this.grid[r][c] = null;
          }
          emptyRow--;
        }
      }
      for (let r = emptyRow; r >= 0; r--) {
        const picked = this.getRandomCelebrity();
        this.grid[r][c] = { ...picked, isPower: Math.random() < 0.1 };
      }
    }
  }

  async triggerCinematicOrdeal(match) {
    this.audio.playCinematicBassDrop();

    // Trigger visual camera flash
    this.flashOverlay.classList.add("active");
    setTimeout(() => this.flashOverlay.classList.remove("active"), 120);

    // Populate modal
    document.getElementById("cinematic-avatar").textContent = match.celebrity.emoji;
    document.getElementById("cinematic-title").textContent = `${match.celebrity.name} Power Ordeal`;
    document.getElementById("cinematic-quote").textContent = `"${match.celebrity.voiceLine}"`;
    document.getElementById("cinematic-combo-count").textContent = `${match.count} Tiles (${this.comboStreak}x Streak)`;
    document.getElementById("cinematic-bonus").textContent = `+${(match.count * 1000).toLocaleString()} Pts`;

    this.cinematicModal.classList.remove("hidden");
    await this.sleep(1600);
    this.cinematicModal.classList.add("hidden");
  }

  logTelemetry(r1, c1, r2, c2, valid, matchCount) {
    const timestamp = Date.now();
    const hash = Math.random().toString(16).substring(2, 8);
    const entry = document.createElement("div");
    entry.className = `log-entry ${valid ? (matchCount >= 2 ? "combo" : "valid") : "sys"}`;
    entry.textContent = `[#${this.moveIndex}] (${r1},${c1})->(${r2},${c2}) ${valid ? `MATCH:${matchCount}` : "INVALID"} Δt=14ms SIG:${hash}`;
    this.telemetryEl.prepend(entry);

    if (this.telemetryEl.children.length > 25) {
      this.telemetryEl.removeChild(this.telemetryEl.lastChild);
    }
  }

  renderRoster() {
    const rosterEl = document.getElementById("roster-list");
    rosterEl.innerHTML = "";
    CELEBRITIES.forEach(c => {
      const item = document.createElement("div");
      item.className = "roster-item";
      item.innerHTML = `
        <div class="roster-emoji">${c.emoji}</div>
        <div class="roster-name">${c.name}</div>
        <div class="roster-tier">${c.tier === "ULTRA_RARE" ? "★ ULTRA" : "✦ RARE"}</div>
      `;
      rosterEl.appendChild(item);
    });
  }

  toggleDramaAlert() {
    this.isDramaActive = !this.isDramaActive;
    const banner = document.getElementById("drama-banner");
    const mult = document.getElementById("active-multiplier");

    if (this.isDramaActive) {
      banner.style.display = "flex";
      this.multiplier = 1.5;
      mult.textContent = "1.5x";
      this.audio.playPop(520, 0.1);
    } else {
      banner.style.display = "none";
      this.multiplier = 1.0;
      mult.textContent = "1.0x";
    }
  }

  // --- Gacha Simulator ---
  pullGacha(times = 1) {
    const cost = times === 1 ? 10 : 90;
    if (this.gold < cost) {
      alert("Insufficient Gold Bars! Tap to reload.");
      this.gold += 100;
      this.goldEl.textContent = this.gold;
      return;
    }

    this.gold -= cost;
    this.goldEl.textContent = this.gold;

    const results = [];
    const stage = document.getElementById("gacha-result-stage");
    stage.innerHTML = "";

    for (let i = 0; i < times; i++) {
      this.pityCounter++;
      let pulled = null;

      // Check Hard Pity (80) or Soft Pity (> 70)
      const isHardPity = this.pityCounter >= 80;
      const softPityRate = this.pityCounter > 70 ? (this.pityCounter - 70) * 0.05 : 0;
      const roll = Math.random();

      if (isHardPity || roll < (0.015 + softPityRate)) {
        // Ultra-Rare Hit!
        const ultraPool = CELEBRITIES.filter(c => c.tier === "ULTRA_RARE");
        pulled = { ...ultraPool[Math.floor(Math.random() * ultraPool.length)], tierBadge: "ULTRA-RARE" };
        this.pityCounter = 0; // Reset pity
      } else if (roll < 0.10) {
        // Rare Hit
        const rarePool = CELEBRITIES.filter(c => c.tier === "RARE");
        pulled = { ...rarePool[Math.floor(Math.random() * rarePool.length)], tierBadge: "RARE" };
      } else {
        // Common Shards
        pulled = {
          name: "Star Shards",
          emoji: "✨",
          tierBadge: "COMMON",
          color: "#8e94a8"
        };
      }
      results.push(pulled);
    }

    // Update pity bar
    document.getElementById("pity-counter-text").textContent = `${this.pityCounter} / 80`;
    document.getElementById("pity-progress-bar").style.width = `${(this.pityCounter / 80) * 100}%`;

    // Render cards
    results.forEach((item, idx) => {
      setTimeout(() => {
        const card = document.createElement("div");
        card.className = `gacha-card-reveal ${item.tierBadge === "ULTRA-RARE" ? "tier-ultra" : item.tierBadge === "RARE" ? "tier-rare" : ""}`;
        card.innerHTML = `
          <div style="font-size: 2rem;">${item.emoji}</div>
          <div style="font-size: 0.75rem; font-weight: 700; margin-top: 4px;">${item.name}</div>
          <div style="font-size: 0.65rem; color: ${item.color || '#fff'}; font-weight: 800;">${item.tierBadge}</div>
        `;
        stage.appendChild(card);
        this.audio.playPop(item.tierBadge === "ULTRA-RARE" ? 650 : 380, 0.08);
      }, idx * 60);
    });
  }

  attachEventListeners() {
    document.getElementById("btn-reset-board").addEventListener("click", () => {
      this.initBoard();
      this.audio.playPop(400, 0.08);
    });

    document.getElementById("btn-shuffle").addEventListener("click", () => {
      // Shuffle non-null tiles
      const flat = this.grid.flat().sort(() => Math.random() - 0.5);
      let idx = 0;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          this.grid[r][c] = flat[idx++];
        }
      }
      this.renderBoard();
      this.audio.playPop(480, 0.1);
    });

    document.getElementById("btn-toggle-drama").addEventListener("click", () => {
      this.toggleDramaAlert();
    });

    const hapticCheck = document.getElementById("haptic-toggle");
    hapticCheck.addEventListener("change", (e) => {
      this.audio.enabled = e.target.checked;
    });

    // Gacha Modal
    const gachaModal = document.getElementById("gacha-modal");
    document.getElementById("btn-open-gacha").addEventListener("click", () => {
      gachaModal.classList.remove("hidden");
    });
    document.getElementById("btn-close-gacha").addEventListener("click", () => {
      gachaModal.classList.add("hidden");
    });

    document.getElementById("btn-pull-1").addEventListener("click", () => this.pullGacha(1));
    document.getElementById("btn-pull-10").addEventListener("click", () => this.pullGacha(10));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instantiate engine when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.popMatchEngine = new PopMatchGame();
});
