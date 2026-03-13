// ── Achievement Service ───────────────────────────────────────
const AchievementService = {

  buildAchievements(savedData = []) {
    const savedMap = {};
    savedData.forEach(a => { savedMap[a.id] = a; });
    return CONFIG.ACHIEVEMENTS.map(def => new Achievement(savedMap[def.id] || {}, def));
  },

  checkAll(state) {
    const newlyUnlocked = [];
    state.achievements.forEach(ach => {
      if (ach.check(state)) {
        newlyUnlocked.push(ach);
        // Apply reward
        if (ach.reward.coins) state.player.addCoins(ach.reward.coins);
      }
    });
    return newlyUnlocked;
  },
};
