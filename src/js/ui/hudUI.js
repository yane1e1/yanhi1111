// ── HUD UI ────────────────────────────────────────────────────
const HudUI = {
  render(state) {
    const p = state.player;
    const level = p.level;
    const xp = p.xp;
    const nextXP = GameService.getXPForNextLevel(level) || xp;
    const prevXP = CONFIG.LEVELS[level - 1] || 0;
    const pct = nextXP > prevXP ? Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100) : 100;

    document.getElementById('hud-coins').textContent = `💰 ${p.coins}`;
    document.getElementById('hud-level').textContent = `⭐ Lv.${level}`;
    document.getElementById('hud-xp-bar').style.width = `${pct}%`;
    document.getElementById('hud-xp-text').textContent = `${xp} / ${nextXP} XP`;

    // Feed warning
    const allAnimals = state.buildings.flatMap(b => b.animals);
    const hasLowFeed = Object.keys(CONFIG.FEEDS).some(f => (state.player.inventory[f] || 0) === 0) && allAnimals.length > 0;
    const warn = document.getElementById('hud-feed-warn');
    warn.style.display = hasLowFeed ? 'inline' : 'none';
  },
};
