import { ANIMALS } from '../config/animals.js';

// Animal model — tracks health, hunger, and production timer
export class Animal {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.type = data.type;
    this.config = ANIMALS[this.type];
    this.health = data.health !== undefined ? data.health : 100;
    this.hunger = data.hunger !== undefined ? data.hunger : 100;
    this.productionTimer = data.productionTimer || 0; // ms accumulated
    this.buildingId = data.buildingId || null;
  }

  get state() {
    if (this.hunger < 20) return 'starving';
    if (this.hunger < 50) return 'hungry';
    return 'healthy';
  }

  get productionEfficiency() {
    if (this.state === 'starving') return 0;
    if (this.state === 'hungry') return 0.5;
    return 1;
  }

  // Advance timer; returns how many resources produced
  tick(deltaMs) {
    // Hunger decreases over time (~1 per 10 seconds real-time)
    this.hunger = Math.max(0, this.hunger - (deltaMs / 10000) * this.config.feedConsumptionRate);

    if (this.productionEfficiency === 0) return 0;

    const effectiveDelta = deltaMs * this.productionEfficiency;
    this.productionTimer += effectiveDelta;

    let produced = 0;
    while (this.productionTimer >= this.config.productionTime) {
      this.productionTimer -= this.config.productionTime;
      produced += this.config.productionAmount;
    }
    return produced;
  }

  feed(amount = 30) {
    this.hunger = Math.min(100, this.hunger + amount);
    this.health = Math.min(100, this.health + 5);
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      health: this.health,
      hunger: this.hunger,
      productionTimer: this.productionTimer,
      buildingId: this.buildingId,
    };
  }
}
