// ── Achievement UI ────────────────────────────────────────────
const AchievementUI = {
  render(state) {
    const container = document.getElementById('achievement-list');
    container.innerHTML = '';

    state.achievements.forEach(ach => {
      const div = document.createElement('div');
      div.className = `achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}`;
      div.innerHTML = `
        <span class="ach-icon">${ach.unlocked ? '🏆' : '🔒'}</span>
        <div class="ach-info">
          <div class="ach-title">${ach.title}</div>
          <div class="ach-desc">${ach.desc}</div>
          ${ach.reward.coins ? `<div class="ach-reward">獎勵: 💰 ${ach.reward.coins}</div>` : ''}
        </div>
      `;
      container.appendChild(div);
    });
  },
};
