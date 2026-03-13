// ── Player Model ─────────────────────────────────────────────
class Player {
  constructor(data = {}) {
    this.coins = data.coins !== undefined ? data.coins : CONFIG.STARTING_COINS;
    this.level = data.level || 1;
    this.xp    = data.xp    || 0;
    this.inventory = data.inventory || {};
  }

  addCoins(amount) { this.coins += amount; }
  spendCoins(amount) {
    if (this.coins < amount) return false;
    this.coins -= amount;
    return true;
  }

  addXP(amount) { this.xp += amount; }

  addToInventory(item, qty = 1) {
    this.inventory[item] = (this.inventory[item] || 0) + qty;
  }

  removeFromInventory(item, qty = 1) {
    if ((this.inventory[item] || 0) < qty) return false;
    this.inventory[item] -= qty;
    return true;
  }

  toJSON() {
    return { coins: this.coins, level: this.level, xp: this.xp, inventory: this.inventory };
  }
}
