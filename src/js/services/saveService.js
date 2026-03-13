// ── Save Service ──────────────────────────────────────────────
const SAVE_KEY = 'animalFarmGameSave_v1';

const SaveService = {
  _timer: null,

  save(state) {
    try {
      const data = {
        player:       state.player.toJSON(),
        tiles:        state.tiles,
        buildings:    state.buildings.map(b => b.toJSON()),
        achievements: state.achievements.map(a => a.toJSON()),
        stats:        state.stats,
        tick:         state.tick,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Load failed:', e);
      return null;
    }
  },

  clear() {
    localStorage.removeItem(SAVE_KEY);
  },

  scheduleSave(state) {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => this.save(state), CONFIG.SAVE_DEBOUNCE_MS);
  },
};
