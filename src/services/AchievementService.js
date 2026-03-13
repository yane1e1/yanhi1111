// Checks and unlocks achievements
export class AchievementService {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
  }

  check() {
    const stats = this._state.getAchievementStats();
    for (const achievement of this._state.achievements) {
      if (achievement.check(stats)) {
        // Grant reward
        this._state.player.addCoins(achievement.reward);
        this._bus.emit('achievement:unlocked', {
          id: achievement.id,
          name: achievement.name,
          emoji: achievement.emoji,
          reward: achievement.reward,
        });
      }
    }
  }
}
