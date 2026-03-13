// ── Building Model ───────────────────────────────────────────
let _buildingIdCounter = 1;

class Building {
  constructor(data = {}) {
    this.id      = data.id   || (_buildingIdCounter++);
    this.type    = data.type;
    this.level   = data.level || 0;             // index into levels array
    this.animals = (data.animals || []).map(a => new Animal(a));
  }

  get def()        { return CONFIG.BUILDINGS[this.type]; }
  get levelDef()   { return this.def.levels[this.level]; }
  get capacity()   { return this.levelDef.capacity; }
  get effBonus()   { return this.levelDef.efficiencyBonus; }
  get isFull()     { return this.animals.length >= this.capacity; }
  get canUpgrade() { return this.level < this.def.levels.length - 1; }
  get upgradeCost(){ return this.canUpgrade ? this.def.levels[this.level + 1].upgradeCost : null; }

  addAnimal(animal) {
    if (this.isFull) return false;
    if (animal.type !== this.def.forAnimal) return false;
    this.animals.push(animal);
    return true;
  }

  upgrade() {
    if (!this.canUpgrade) return false;
    this.level++;
    return true;
  }

  toJSON() {
    return { id: this.id, type: this.type, level: this.level, animals: this.animals.map(a => a.toJSON()) };
  }
}
