import { Crop } from '../models/Crop.js';
import { CROPS } from '../config/crops.js';

// Manages crop planting, growth, and harvesting
export class CropService {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
  }

  plantCrop(cropType, tileIndex) {
    const config = CROPS[cropType];
    if (!config) return { success: false, message: '無效的作物種類' };

    if (tileIndex < 0 || tileIndex >= 100) return { success: false, message: '無效的地塊' };

    if (this._state.tiles[tileIndex] !== null) {
      return { success: false, message: '此地塊已被佔用' };
    }

    if (!this._state.player.spendCoins(config.seedCost)) {
      return { success: false, message: '金幣不足' };
    }

    const crop = new Crop({ type: cropType, tileIndex });
    this._state.crops[crop.id] = crop;
    this._state.tiles[tileIndex] = crop.id;
    this._bus.emit('crop:planted', { cropId: crop.id, cropType, tileIndex });
    return { success: true, cropId: crop.id };
  }

  tick(deltaMs) {
    for (const crop of Object.values(this._state.crops)) {
      if (!crop.harvested) {
        crop.tick(deltaMs);
        if (crop.isReady) {
          this._bus.emit('crop:ready', { cropId: crop.id, cropType: crop.type });
        }
      }
    }
  }

  harvestCrop(cropId) {
    const crop = this._state.crops[cropId];
    if (!crop) return { success: false, message: '找不到作物' };
    if (!crop.isReady) return { success: false, message: '作物尚未成熟' };

    const feedYield = crop.harvest();
    this._state.player.addResource('feed', feedYield);
    this._state.player.stats.totalCropsHarvested += 1;
    this._state.player.addExperience(10);

    // Free the tile
    if (crop.tileIndex !== null) {
      this._state.tiles[crop.tileIndex] = null;
    }
    // Remove crop from state
    delete this._state.crops[cropId];

    this._bus.emit('crop:harvested', { cropId, feedYield });
    return { success: true, feedYield };
  }

  sellCrop(cropId) {
    const crop = this._state.crops[cropId];
    if (!crop) return { success: false, message: '找不到作物' };
    if (!crop.isReady) return { success: false, message: '作物尚未成熟' };

    const sellPrice = crop.config.sellPrice;
    crop.harvested = true;
    this._state.player.addCoins(sellPrice);
    this._state.player.stats.totalCropsHarvested += 1;

    if (crop.tileIndex !== null) {
      this._state.tiles[crop.tileIndex] = null;
    }
    delete this._state.crops[cropId];

    this._bus.emit('crop:sold', { cropId, coins: sellPrice });
    return { success: true, coins: sellPrice };
  }
}
