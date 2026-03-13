// ── Game Service — core state + game loop ─────────────────────
const GameService = {
  state: null,
  _intervalId: null,
  onTick: null,         // callback: (state) => void

  buildInitialState() {
    return {
      player:       new Player(),
      tiles:        FarmService.buildInitialTiles(),
      buildings:    [],
      crops:        [],
      achievements: AchievementService.buildAchievements([]),
      stats: {
        animalCount: 0, speciesOwned: 0,
        totalCollected: {}, totalSold: 0, totalHarvested: 0,
        totalFeeds: 0, totalUpgrades: 0,
      },
      tick: 0,
    };
  },

  loadOrInit() {
    const saved = SaveService.load();
    if (saved) {
      try {
        const s = {
          player:       new Player(saved.player),
          tiles:        saved.tiles,
          buildings:    (saved.buildings || []).map(b => new Building(b)),
          crops:        (saved.crops     || []).map(c => new Crop(c)),
          achievements: AchievementService.buildAchievements(saved.achievements || []),
          stats:        saved.stats || {},
          tick:         saved.tick  || 0,
        };
        // Sync id counters
        if (s.buildings.length) {
          const maxBId = Math.max(...s.buildings.map(b => b.id));
          if (maxBId >= _buildingIdCounter) _buildingIdCounter = maxBId + 1;
        }
        if (s.crops.length) {
          const maxCId = Math.max(...s.crops.map(c => c.id));
          if (maxCId >= _cropIdCounter) _cropIdCounter = maxCId + 1;
        }
        const allAnimals = s.buildings.flatMap(b => b.animals);
        if (allAnimals.length) {
          const maxAId = Math.max(...allAnimals.map(a => a.id));
          if (maxAId >= _animalIdCounter) _animalIdCounter = maxAId + 1;
        }
        this.state = s;
        return true;
      } catch (e) {
        console.warn('Could not restore save, starting fresh:', e);
      }
    }
    this.state = this.buildInitialState();
    return false;
  },

  getLevelForXP(xp) {
    let level = 1;
    for (let i = CONFIG.LEVELS.length - 1; i >= 0; i--) {
      if (xp >= CONFIG.LEVELS[i]) { level = i + 1; break; }
    }
    return level;
  },

  getXPForNextLevel(level) {
    return CONFIG.LEVELS[level] || null;
  },

  setSpeed(multiplier) {
    this.stopLoop();
    this._intervalId = setInterval(() => this._tick(), Math.floor(CONFIG.TICK_INTERVAL_MS / multiplier));
  },

  startLoop() {
    if (this._intervalId) return;
    this._intervalId = setInterval(() => this._tick(), CONFIG.TICK_INTERVAL_MS);
  },

  stopLoop() {
    if (this._intervalId) { clearInterval(this._intervalId); this._intervalId = null; }
  },

  _tick() {
    const s = this.state;
    s.tick++;

    // Update animals
    AnimalService.tickAll(s);

    // Update crops
    CropService.tickAll(s);

    // Update player level
    s.player.level = this.getLevelForXP(s.player.xp);

    // Update animal count stat
    s.stats.animalCount = s.buildings.reduce((sum, b) => sum + b.animals.length, 0);

    // Check achievements
    const newAch = AchievementService.checkAll(s);

    // Auto-save (debounced)
    SaveService.scheduleSave(s);

    if (this.onTick) this.onTick(s, newAch);
  },

  resetGame() {
    this.stopLoop();
    SaveService.clear();
    this.state = this.buildInitialState();
    this.startLoop();
  },
};
