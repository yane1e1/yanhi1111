// Handles animal resource production tick
export class ProductionService {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
  }

  tick(deltaMs) {
    for (const animal of Object.values(this._state.animals)) {
      const produced = animal.tick(deltaMs);
      if (produced > 0) {
        const resourceId = animal.config.productionResource;
        this._state.player.addResource(resourceId, produced);
        this._state.player.addExperience(produced * 5);
        this._bus.emit('resource:produced', { animalId: animal.id, resourceId, amount: produced });
      }
    }
  }
}
