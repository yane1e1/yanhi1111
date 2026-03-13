// ── Farm Service ──────────────────────────────────────────────
const FarmService = {

  buildInitialTiles(total = CONFIG.STARTING_FARM_SIZE) {
    const maxTiles = CONFIG.FARM_SIZES[CONFIG.FARM_SIZES.length - 1].tiles;
    const tiles = [];
    for (let i = 0; i < maxTiles; i++) {
      tiles.push({ id: i, unlocked: i < total, buildingId: null, cropId: null });
    }
    return tiles;
  },

  getTile(state, tileId) {
    return state.tiles.find(t => t.id === tileId) || null;
  },

  getBuilding(state, buildingId) {
    return state.buildings.find(b => b.id === buildingId) || null;
  },

  placeAnimalInBuilding(state, animal, buildingId) {
    const building = this.getBuilding(state, buildingId);
    if (!building) return { ok: false, msg: '找不到設施' };
    if (building.def.forAnimal !== animal.type) {
      return { ok: false, msg: `此設施僅適合 ${CONFIG.ANIMALS[building.def.forAnimal].name}` };
    }
    if (!building.addAnimal(animal)) {
      return { ok: false, msg: `${building.def.name} 已滿，請先升級設施` };
    }
    state.stats.animalCount = (state.stats.animalCount || 0) + 1;
    // Track species
    const speciesSet = new Set(
      state.buildings.flatMap(b => b.animals.map(a => a.type))
    );
    state.stats.speciesOwned = speciesSet.size;
    return { ok: true };
  },

  collectFromBuilding(state, buildingId) {
    const building = this.getBuilding(state, buildingId);
    if (!building) return { ok: false, msg: '找不到設施' };
    let totalCollected = 0;
    const resourceType = CONFIG.ANIMALS[building.def.forAnimal].produces;
    building.animals.forEach(animal => {
      const amount = animal.collectResource();
      if (amount > 0) {
        state.player.addToInventory(resourceType, amount);
        state.player.addXP(CONFIG.XP.collectResource * amount);
        if (!state.stats.totalCollected) state.stats.totalCollected = {};
        state.stats.totalCollected[resourceType] =
          (state.stats.totalCollected[resourceType] || 0) + amount;
        totalCollected += amount;
      }
    });
    if (totalCollected === 0) return { ok: false, msg: '目前沒有可收集的資源' };
    return { ok: true, amount: totalCollected, resource: resourceType };
  },

  feedAnimalsInBuilding(state, buildingId, feedType) {
    const building = this.getBuilding(state, buildingId);
    if (!building) return { ok: false, msg: '找不到設施' };
    const needed = building.animals.length;
    if (needed === 0) return { ok: false, msg: '設施中沒有動物' };
    if (!state.player.removeFromInventory(feedType, needed)) {
      const have = state.player.inventory[feedType] || 0;
      return { ok: false, msg: `飼料不足！需要 ${needed} 份，庫存只有 ${have} 份。請前往商店購買飼料。` };
    }
    let fed = 0;
    building.animals.forEach(animal => {
      if (animal.feed(feedType)) {
        fed++;
        state.player.addXP(CONFIG.XP.feedAnimal);
        state.stats.totalFeeds = (state.stats.totalFeeds || 0) + 1;
      }
    });
    return { ok: true, fed };
  },
};
