// ── Animal Model ─────────────────────────────────────────────
let _animalIdCounter = 1;

class Animal {
  constructor(data = {}) {
    const def = CONFIG.ANIMALS[data.type];
    this.id           = data.id   || (_animalIdCounter++);
    this.type         = data.type;
    this.health       = data.health       !== undefined ? data.health       : def.maxHealth;
    this.hunger       = data.hunger       !== undefined ? data.hunger       : def.maxHunger;
    this.ticksSinceProduction = data.ticksSinceProduction || 0;
    this.pendingResource      = data.pendingResource      || 0;
  }

  get def() { return CONFIG.ANIMALS[this.type]; }

  tick(efficiencyBonus = 1.0) {
    // Hunger decay
    this.hunger = Math.max(0, this.hunger - this.def.hungerDecayPerTick);

    // Health decay when starving
    if (this.hunger <= 0) {
      this.health = Math.max(0, this.health - this.def.healthDecayPerTick);
    }

    // Production (only when alive / healthy enough)
    const healthFactor = this.health / this.def.maxHealth; // 0..1
    const safeEffBonus = efficiencyBonus > 0 ? efficiencyBonus : 1.0;
    if (healthFactor > 0) {
      this.ticksSinceProduction++;
      const reqTicks = Math.ceil(this.def.productionTicks / (healthFactor * safeEffBonus));
      if (this.ticksSinceProduction >= reqTicks) {
        this.pendingResource += this.def.produceAmount;
        this.ticksSinceProduction = 0;
      }
    }
  }

  feed(feedItem) {
    const feedDef = CONFIG.FEEDS[feedItem];
    if (!feedDef) return false;
    if (!feedDef.feedsAnimal.includes(this.type)) return false;
    this.hunger = Math.min(this.def.maxHunger, this.hunger + 40);
    this.health = Math.min(this.def.maxHealth, this.health + 10);
    return true;
  }

  collectResource() {
    const amount = this.pendingResource;
    this.pendingResource = 0;
    return amount;
  }

  toJSON() {
    return {
      id: this.id, type: this.type,
      health: this.health, hunger: this.hunger,
      ticksSinceProduction: this.ticksSinceProduction,
      pendingResource: this.pendingResource,
    };
  }
}
