import { CROPS } from '../config/crops.js';

// Crop model — tracks growth stage and timer
export class Crop {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.type = data.type;
    this.config = CROPS[this.type];
    this.growthTimer = data.growthTimer || 0; // ms elapsed
    this.tileIndex = data.tileIndex !== undefined ? data.tileIndex : null;
    this.harvested = data.harvested || false;
  }

  get progress() {
    return Math.min(1, this.growthTimer / this.config.growthTime);
  }

  get stage() {
    const p = this.progress;
    if (p < 0.33) return 0;
    if (p < 0.66) return 1;
    return 2;
  }

  get isReady() {
    return this.growthTimer >= this.config.growthTime && !this.harvested;
  }

  tick(deltaMs) {
    if (!this.isReady) {
      this.growthTimer += deltaMs;
    }
  }

  harvest() {
    if (!this.isReady) return 0;
    this.harvested = true;
    return this.config.feedYield;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      growthTimer: this.growthTimer,
      tileIndex: this.tileIndex,
      harvested: this.harvested,
    };
  }
}
