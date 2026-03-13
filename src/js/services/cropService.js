// ── Crop Service ──────────────────────────────────────────────
const CropService = {

  plantCrop(state, tileId, cropType) {
    const tile = FarmService.getTile(state, tileId);
    if (!tile) return { ok: false, msg: '找不到地塊' };
    if (!tile.unlocked) return { ok: false, msg: '此地塊尚未解鎖' };
    if (tile.buildingId) return { ok: false, msg: '此地塊已有設施' };
    if (tile.cropId) return { ok: false, msg: '此地塊已有作物' };

    const seedKey = 'seed_' + cropType;
    if (!state.player.removeFromInventory(seedKey, 1)) {
      return { ok: false, msg: `種子不足！請先購買 ${CONFIG.CROPS[cropType].name} 種子` };
    }

    const crop = new Crop({ type: cropType, plantedAt: state.tick });
    state.crops.push(crop);
    tile.cropId = crop.id;
    return { ok: true, crop };
  },

  tickAll(state) {
    state.crops.forEach(crop => crop.tick());
  },

  harvestCrop(state, tileId) {
    const tile = FarmService.getTile(state, tileId);
    if (!tile || !tile.cropId) return { ok: false, msg: '此地塊沒有作物' };
    const crop = state.crops.find(c => c.id === tile.cropId);
    if (!crop) return { ok: false, msg: '找不到作物' };
    if (!crop.isHarvestable) {
      const remaining = crop.def.growthTicks - crop.ticks;
      return { ok: false, msg: `作物尚未成熟，還需 ${remaining} 秒` };
    }

    state.player.addToInventory(crop.type, crop.def.harvestYield);
    state.player.addXP(CONFIG.XP.harvestCrop);
    state.stats.totalHarvested = (state.stats.totalHarvested || 0) + 1;

    // Remove crop from state
    state.crops = state.crops.filter(c => c.id !== crop.id);
    tile.cropId = null;

    return { ok: true, type: crop.type, amount: crop.def.harvestYield };
  },
};
