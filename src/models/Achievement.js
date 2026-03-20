// Achievement model — tracks unlock state
export class Achievement {
  constructor(config, data = {}) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.emoji = config.emoji;
    this.reward = config.reward;
    this.condition = config.condition;
    this.unlocked = data.unlocked || false;
    this.unlockedAt = data.unlockedAt || null;
  }

  check(stats) {
    if (this.unlocked) return false;
    if (this.condition(stats)) {
      this.unlocked = true;
      this.unlockedAt = Date.now();
      return true;
    }
    return false;
  }

  serialize() {
    return {
      id: this.id,
      unlocked: this.unlocked,
      unlockedAt: this.unlockedAt,
    };
  }
}
