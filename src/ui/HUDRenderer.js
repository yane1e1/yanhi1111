// Renders the top HUD bar
export class HUDRenderer {
  constructor(gameState) {
    this._state = gameState;
    this._coinsEl = document.getElementById('hud-coins');
    this._levelEl = document.getElementById('hud-level');
    this._expEl = document.getElementById('hud-exp');
    this._feedEl = document.getElementById('hud-feed-display');
  }

  render() {
    const { player } = this._state;
    this._coinsEl.textContent = `💰 ${Math.floor(player.coins)}`;
    this._levelEl.textContent = `⭐ Lv.${player.level}`;
    this._feedEl.textContent = `🌿 ${player.getResource('feed')}`;

    const expForNext = 200;
    const expInLevel = player.experience % 200;
    const pct = Math.round((expInLevel / expForNext) * 100);
    this._expEl.style.width = `${pct}%`;
    this._expEl.title = `經驗值: ${expInLevel}/${expForNext}`;
  }
}
