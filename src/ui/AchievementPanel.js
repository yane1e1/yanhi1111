// Achievement panel — shows all achievements and their progress
export class AchievementPanel {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
    this._panel = document.getElementById('achievement-panel');
  }

  toggle() {
    this._panel.classList.toggle('open');
    if (this._panel.classList.contains('open')) this._render();
  }

  close() {
    this._panel.classList.remove('open');
  }

  _render() {
    const achievements = this._state.achievements;
    const rows = achievements.map((a) => {
      const cls = a.unlocked ? 'unlocked' : 'locked';
      return `<div class="achievement-item ${cls}">
        <span class="ach-emoji">${a.emoji}</span>
        <div class="ach-info">
          <span class="ach-name">${a.name}</span>
          <span class="ach-desc">${a.description}</span>
          <span class="ach-reward">獎勵: 💰 ${a.reward}</span>
        </div>
        <span class="ach-status">${a.unlocked ? '✅ 已解鎖' : '🔒 未解鎖'}</span>
      </div>`;
    }).join('');

    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    this._panel.innerHTML = `<div class="panel-header">
        <h2>🏆 成就 (${unlockedCount}/${achievements.length})</h2>
        <button class="close-btn" id="ach-close">✕</button>
      </div>
      <div class="panel-body">${rows}</div>`;

    this._panel.querySelector('#ach-close').addEventListener('click', () => this.close());
  }
}
