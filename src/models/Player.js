// Player model
export class Player {
  constructor(data = {}) {
    this.coins = data.coins !== undefined ? data.coins : 200;
    this.level = data.level || 1;
    this.experience = data.experience || 0;
    this.inventory = data.inventory || {};
    // Statistics for achievements
    this.stats = data.stats || {
      totalCoinsEarned: 0,
      totalResourcesCollected: 0,
      eggsCollected: 0,
      totalCropsHarvested: 0,
      totalFeedingActions: 0,
    };
    this.achievements = data.achievements || [];
  }

  addCoins(amount) {
    this.coins += amount;
    if (amount > 0) {
      this.stats.totalCoinsEarned += amount;
    }
  }

  spendCoins(amount) {
    if (this.coins < amount) return false;
    this.coins -= amount;
    return true;
  }

  addResource(resourceId, amount = 1) {
    this.inventory[resourceId] = (this.inventory[resourceId] || 0) + amount;
    this.stats.totalResourcesCollected += amount;
    if (resourceId === 'egg') this.stats.eggsCollected += amount;
  }

  removeResource(resourceId, amount = 1) {
    const current = this.inventory[resourceId] || 0;
    if (current < amount) return false;
    this.inventory[resourceId] = current - amount;
    return true;
  }

  getResource(resourceId) {
    return this.inventory[resourceId] || 0;
  }

  addExperience(amount) {
    this.experience += amount;
    const newLevel = Math.floor(this.experience / 200) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      return true; // level up occurred
    }
    return false;
  }

  serialize() {
    return {
      coins: this.coins,
      level: this.level,
      experience: this.experience,
      inventory: { ...this.inventory },
      stats: { ...this.stats },
      achievements: [...this.achievements],
    };
  }
}
