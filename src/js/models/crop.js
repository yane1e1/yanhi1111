// ── Crop Model ───────────────────────────────────────────────
let _cropIdCounter = 1;

class Crop {
  constructor(data = {}) {
    this.id        = data.id        || (_cropIdCounter++);
    this.type      = data.type;
    this.plantedAt = data.plantedAt || 0;   // game tick when planted
    this.ticks     = data.ticks     || 0;   // ticks grown so far
  }

  get def()         { return CONFIG.CROPS[this.type]; }
  get growthPct()   { return Math.min(1, this.ticks / this.def.growthTicks); }
  get isHarvestable(){ return this.ticks >= this.def.growthTicks; }

  tick() { if (!this.isHarvestable) this.ticks++; }

  toJSON() {
    return { id: this.id, type: this.type, plantedAt: this.plantedAt, ticks: this.ticks };
  }
}
