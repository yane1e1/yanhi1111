import { RESOURCES } from '../config/resources.js';

// Handles buy/sell transactions
export class MarketService {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
  }

  // Sell a resource from player inventory
  sellResource(resourceId, amount = 1) {
    const config = RESOURCES[resourceId];
    if (!config) return { success: false, message: '無效的資源' };

    if (!this._state.player.removeResource(resourceId, amount)) {
      return { success: false, message: '庫存不足' };
    }

    const earned = config.sellPrice * amount;
    this._state.player.addCoins(earned);
    this._bus.emit('resource:sold', { resourceId, amount, coins: earned });
    return { success: true, earned };
  }

  // Buy feed from market
  buyFeed(amount = 1) {
    const feedConfig = RESOURCES.feed;
    const cost = feedConfig.buyPrice * amount;

    if (!this._state.player.spendCoins(cost)) {
      return { success: false, message: '金幣不足' };
    }

    this._state.player.addResource('feed', amount);
    this._bus.emit('feed:bought', { amount, cost });
    return { success: true, cost };
  }

  // Buy seeds for planting
  buySeed(cropType, amount = 1) {
    const { CROPS } = /** @type {any} */ (this);
    return { success: false, message: '請使用 CropService.plantCrop' };
  }
}
