// Handles feeding animals
export class FeedingService {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
  }

  feedAnimal(animalId, feedAmount = 1) {
    const animal = this._state.animals[animalId];
    if (!animal) return { success: false, message: '找不到動物' };

    const feedAvailable = this._state.player.getResource('feed');
    if (feedAvailable < feedAmount) {
      return { success: false, message: '飼料不足，請購買或種植更多飼料' };
    }

    this._state.player.removeResource('feed', feedAmount);
    animal.feed(feedAmount * 30); // each feed unit restores 30 hunger
    this._state.player.stats.totalFeedingActions += 1;
    this._bus.emit('animal:fed', { animalId, feedAmount });
    return { success: true };
  }

  feedAll() {
    const animals = Object.values(this._state.animals);
    const hungryAnimals = animals.filter((a) => a.hunger < 80);
    let fed = 0;
    for (const animal of hungryAnimals) {
      const result = this.feedAnimal(animal.id, 1);
      if (result.success) fed++;
    }
    return { success: true, fed };
  }
}
