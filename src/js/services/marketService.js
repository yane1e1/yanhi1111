// ── Market Service ────────────────────────────────────────────
const MarketService = {

  buyAnimal(state, animalType) {
    const def = CONFIG.ANIMALS[animalType];
    if (!def) return { ok: false, msg: '未知動物類型' };
    if (!state.player.spendCoins(def.buyCost)) {
      return { ok: false, msg: `金幣不足！需要 ${def.buyCost} 枚金幣` };
    }
    state.player.addXP(CONFIG.XP.buyAnimal);
    const animal = new Animal({ type: animalType });
    return { ok: true, animal };
  },

  buyBuilding(state, buildingType) {
    const def = CONFIG.BUILDINGS[buildingType];
    if (!def) return { ok: false, msg: '未知設施類型' };
    // check there's a free tile
    const freeTile = state.tiles.find(t => t.unlocked && !t.buildingId && !t.cropId);
    if (!freeTile) return { ok: false, msg: '沒有空地可以建設設施' };
    if (!state.player.spendCoins(def.buyCost)) {
      return { ok: false, msg: `金幣不足！需要 ${def.buyCost} 枚金幣` };
    }
    state.player.addXP(CONFIG.XP.buyBuilding);
    const building = new Building({ type: buildingType });
    freeTile.buildingId = building.id;
    state.buildings.push(building);
    return { ok: true, building, tile: freeTile };
  },

  upgradeBuilding(state, buildingId) {
    const b = state.buildings.find(b => b.id === buildingId);
    if (!b) return { ok: false, msg: '找不到設施' };
    if (!b.canUpgrade) return { ok: false, msg: '已達最高等級' };
    const cost = b.upgradeCost;
    if (!state.player.spendCoins(cost)) {
      return { ok: false, msg: `金幣不足！需要 ${cost} 枚金幣` };
    }
    b.upgrade();
    state.player.addXP(CONFIG.XP.upgradeBuilding);
    state.stats.totalUpgrades = (state.stats.totalUpgrades || 0) + 1;
    return { ok: true };
  },

  buySeed(state, cropType, qty = 1) {
    const def = CONFIG.CROPS[cropType];
    if (!def) return { ok: false, msg: '未知種子類型' };
    const cost = def.seedCost * qty;
    if (!state.player.spendCoins(cost)) {
      return { ok: false, msg: `金幣不足！需要 ${cost} 枚金幣` };
    }
    state.player.addToInventory('seed_' + cropType, qty);
    return { ok: true };
  },

  buyFeed(state, feedType, qty = 1) {
    const feedDef = CONFIG.FEEDS[feedType];
    if (!feedDef) return { ok: false, msg: '未知飼料類型' };
    const cost = CONFIG.CROPS[feedType] ? CONFIG.CROPS[feedType].seedCost : 5;
    const totalCost = cost * qty;
    if (!state.player.spendCoins(totalCost)) {
      return { ok: false, msg: `金幣不足！需要 ${totalCost} 枚金幣` };
    }
    state.player.addToInventory(feedType, qty);
    return { ok: true };
  },

  sellResource(state, resourceType, qty = 1) {
    const marketDef = CONFIG.MARKET[resourceType];
    if (!marketDef) return { ok: false, msg: '無法出售此物品' };
    if (!state.player.removeFromInventory(resourceType, qty)) {
      return { ok: false, msg: '庫存不足' };
    }
    const earned = marketDef.sellPrice * qty;
    state.player.addCoins(earned);
    state.player.addXP(CONFIG.XP.sellResource * qty);
    state.stats.totalSold = (state.stats.totalSold || 0) + qty;
    return { ok: true, earned };
  },

  unlockTile(state) {
    const currentSize = state.tiles.filter(t => t.unlocked).length;
    const nextExpansion = CONFIG.FARM_SIZES.find(e => e.tiles > currentSize);
    if (!nextExpansion) return { ok: false, msg: '農場已達最大規模' };
    if (state.player.level < nextExpansion.level) {
      return { ok: false, msg: `需要達到 ${nextExpansion.level} 級才能擴張農場` };
    }
    if (!state.player.spendCoins(nextExpansion.cost)) {
      return { ok: false, msg: `金幣不足！需要 ${nextExpansion.cost} 枚金幣` };
    }
    // Unlock tiles up to nextExpansion.tiles
    let unlocked = 0;
    for (let t of state.tiles) {
      if (!t.unlocked && unlocked < nextExpansion.tiles - currentSize) {
        t.unlocked = true;
        unlocked++;
      }
    }
    return { ok: true, newCount: nextExpansion.tiles };
  },
};
