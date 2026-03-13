// ── Animal Service ────────────────────────────────────────────
const AnimalService = {

  tickAll(state) {
    state.buildings.forEach(building => {
      const bonus = building.effBonus;
      building.animals.forEach(animal => animal.tick(bonus));
    });
  },
};
