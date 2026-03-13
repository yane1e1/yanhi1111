// ── Achievement Model ─────────────────────────────────────────
class Achievement {
  constructor(data, def) {
    this.id       = def.id;
    this.title    = def.title;
    this.desc     = def.desc;
    this.reward   = def.reward;
    this.unlocked = data.unlocked || false;
    this._condition = def.condition;  // function ref, not serialised
  }

  check(state) {
    if (this.unlocked) return false;
    if (this._condition(state)) {
      this.unlocked = true;
      return true;
    }
    return false;
  }

  toJSON() { return { id: this.id, unlocked: this.unlocked }; }
}
