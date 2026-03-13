import { BUILDINGS } from '../config/buildings.js';

// Building model — holds animals and tracks upgrade level
export class Building {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.type = data.type;
    this.config = BUILDINGS[this.type];
    this.level = data.level || 1;
    this.tileIndex = data.tileIndex !== undefined ? data.tileIndex : null;
    this.animalIds = data.animalIds || [];
  }

  get levelConfig() {
    return this.config.levels[this.level - 1];
  }

  get capacity() {
    return this.levelConfig.capacity;
  }

  get upgradeCost() {
    return this.levelConfig.upgradeCost;
  }

  get isFull() {
    return this.animalIds.length >= this.capacity;
  }

  get canUpgrade() {
    return this.level < this.config.levels.length && this.upgradeCost !== null;
  }

  addAnimal(animalId) {
    if (this.isFull) return false;
    this.animalIds.push(animalId);
    return true;
  }

  removeAnimal(animalId) {
    const idx = this.animalIds.indexOf(animalId);
    if (idx === -1) return false;
    this.animalIds.splice(idx, 1);
    return true;
  }

  upgrade() {
    if (!this.canUpgrade) return false;
    this.level += 1;
    return true;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      level: this.level,
      tileIndex: this.tileIndex,
      animalIds: [...this.animalIds],
    };
  }
}
