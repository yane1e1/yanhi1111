// Handles localStorage save/load
const SAVE_KEY = 'animalFarmSave';

export class StorageService {
  save(gameState) {
    try {
      const data = JSON.stringify(gameState.serialize());
      localStorage.setItem(SAVE_KEY, data);
      return true;
    } catch (e) {
      console.error('[StorageService] Save failed:', e);
      return false;
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('[StorageService] Load failed:', e);
      return null;
    }
  }

  clear() {
    localStorage.removeItem(SAVE_KEY);
  }
}
