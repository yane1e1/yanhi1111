import { EventBus } from './EventBus.js';
import { Timer } from './Timer.js';
import { GameState } from '../services/GameState.js';
import { StorageService } from '../services/StorageService.js';
import { ProductionService } from '../services/ProductionService.js';
import { MarketService } from '../services/MarketService.js';
import { FeedingService } from '../services/FeedingService.js';
import { CropService } from '../services/CropService.js';
import { AchievementService } from '../services/AchievementService.js';
import { FarmMapRenderer } from '../ui/FarmMapRenderer.js';
import { HUDRenderer } from '../ui/HUDRenderer.js';
import { ShopPanel } from '../ui/ShopPanel.js';
import { MarketPanel } from '../ui/MarketPanel.js';
import { AnimalCarePanel } from '../ui/AnimalCarePanel.js';
import { InventoryPanel } from '../ui/InventoryPanel.js';
import { AchievementPanel } from '../ui/AchievementPanel.js';
import { NotificationSystem } from '../ui/NotificationSystem.js';
import { Animal } from '../models/Animal.js';
import { Building } from '../models/Building.js';
import { BUILDINGS } from '../config/buildings.js';
import { ANIMALS } from '../config/animals.js';
import { RESOURCES } from '../config/resources.js';
import { CROPS } from '../config/crops.js';

export class GameEngine {
  constructor() {
    this.bus = new EventBus();
    this.state = null;
    this.storage = new StorageService();

    // Services
    this.production = null;
    this.market = null;
    this.feeding = null;
    this.cropService = null;
    this.achievementService = null;

    // UI
    this.farmMap = null;
    this.hud = null;
    this.shopPanel = null;
    this.marketPanel = null;
    this.carePanel = null;
    this.inventoryPanel = null;
    this.achievementPanel = null;
    this.notifications = null;

    this.timer = null;
    this._saveInterval = null;
    this._lastFrameTime = null;
  }

  init() {
    // Load or create state
    const saved = this.storage.load();
    if (saved) {
      this.state = GameState.fromSave(saved);
      console.log('[GameEngine] Loaded saved game');
    } else {
      this.state = new GameState();
      console.log('[GameEngine] Started new game');
    }

    // Instantiate services
    this.production = new ProductionService(this.state, this.bus);
    this.market = new MarketService(this.state, this.bus);
    this.feeding = new FeedingService(this.state, this.bus);
    this.cropService = new CropService(this.state, this.bus);
    this.achievementService = new AchievementService(this.state, this.bus);

    // Instantiate UI
    this.notifications = new NotificationSystem();
    this.farmMap = new FarmMapRenderer(this.state, this.bus);
    this.hud = new HUDRenderer(this.state);
    this.shopPanel = new ShopPanel(this.state, this.bus);
    this.marketPanel = new MarketPanel(this.state, this.bus);
    this.carePanel = new AnimalCarePanel(this.state, this.bus);
    this.inventoryPanel = new InventoryPanel(this.state, this.bus);
    this.achievementPanel = new AchievementPanel(this.state, this.bus);

    this._bindEvents();
    this._bindUIButtons();

    // Auto-save every 3 seconds
    this._saveInterval = setInterval(() => {
      this.storage.save(this.state);
    }, 3000);

    // Start game loop
    this._lastFrameTime = performance.now();
    this._gameLoop();

    this.notifications.success('🌱 農場遊戲已載入！歡迎回來！');
    this._renderAll();
  }

  // ---- Main Game Loop ----
  _gameLoop() {
    const now = performance.now();
    const deltaMs = now - this._lastFrameTime;
    this._lastFrameTime = now;

    this.production.tick(deltaMs);
    this.cropService.tick(deltaMs);
    this.achievementService.check();

    this._renderAll();

    requestAnimationFrame(() => this._gameLoop());
  }

  _renderAll() {
    this.farmMap.render();
    this.hud.render();
  }

  // ---- Event Handlers ----
  _bindEvents() {
    this.bus.on('resource:produced', ({ animalId, resourceId, amount }) => {
      const resCfg = RESOURCES[resourceId];
      this.notifications.info(`${resCfg?.emoji || ''} 產出 ${amount} ${resCfg?.name || resourceId}!`);
    });

    this.bus.on('resource:sold', ({ resourceId, amount, coins }) => {
      const resCfg = RESOURCES[resourceId];
      this.notifications.success(`💰 +${coins} 出售了 ${amount} ${resCfg?.name || resourceId}`);
    });

    this.bus.on('achievement:unlocked', ({ name, emoji, reward }) => {
      this.notifications.achievement(`🏆 成就解鎖：${emoji} ${name}！獎勵 💰 ${reward}`);
    });

    this.bus.on('animal:fed', ({ animalId }) => {
      // silent — avoid notification spam
    });

    this.bus.on('crop:ready', ({ cropId, cropType }) => {
      const cfg = CROPS[cropType];
      this.notifications.success(`${cfg?.emoji || '🌱'} ${cfg?.name || cropType} 已成熟，點擊收穫！`);
    });

    this.bus.on('crop:harvested', ({ feedYield }) => {
      this.notifications.success(`🌿 收穫！獲得 ${feedYield} 飼料`);
    });

    this.bus.on('crop:sold', ({ coins }) => {
      this.notifications.success(`💰 +${coins} 出售作物`);
    });

    // Farm map actions
    this.bus.on('ui:placeBuilding', ({ buildingType, tileIndex }) => {
      this._placeBuilding(buildingType, tileIndex);
    });

    this.bus.on('ui:plantCrop', ({ cropType, tileIndex }) => {
      const result = this.cropService.plantCrop(cropType, tileIndex);
      if (!result.success) this.notifications.error(result.message);
    });

    this.bus.on('ui:harvest', ({ cropId }) => {
      const result = this.cropService.harvestCrop(cropId);
      if (!result.success) this.notifications.error(result.message);
    });

    this.bus.on('ui:actionCleared', () => {
      document.getElementById('action-hint').textContent = '';
      document.querySelectorAll('.farm-tile').forEach((t) => t.classList.remove('placeable'));
    });

    this.bus.on('ui:buildingClick', ({ buildingId }) => {
      this._closePanels();
      this.carePanel.setBuilding(buildingId);
      this.carePanel.toggle();
      document.getElementById('panel-overlay').classList.add('visible');
    });

    // Shop events
    this.bus.on('shop:buyAnimal', ({ animalType }) => {
      this._buyAnimalForBuilding(animalType);
    });

    this.bus.on('shop:buyBuilding', ({ buildingType }) => {
      const cfg = BUILDINGS[buildingType];
      const cost = cfg.levels[0].cost;
      if (!this.state.player.spendCoins(cost)) {
        this.notifications.error('金幣不足！');
        return;
      }
      // Place building on next free tile
      const tileIndex = this._findFreeTile();
      if (tileIndex === -1) {
        this.state.player.addCoins(cost); // refund
        this.notifications.error('農場沒有空地了！');
        return;
      }
      const building = new Building({ type: buildingType, tileIndex });
      this.state.buildings[building.id] = building;
      this.state.tiles[tileIndex] = building.id;
      this.notifications.success(`🏠 建造了 ${cfg.name}！`);
    });

    this.bus.on('shop:buyCrop', ({ cropType }) => {
      const tileIndex = this._findFreeTile();
      if (tileIndex === -1) {
        this.notifications.error('農場沒有空地了！');
        return;
      }
      // Set selected action so player clicks on tile
      this.farmMap.setSelectedAction({ type: 'crop', value: cropType });
      const cfg = CROPS[cropType];
      document.getElementById('action-hint').textContent = `請點擊農場地塊種植 ${cfg.emoji} ${cfg.name}`;
      this.shopPanel.close();
    });

    this.bus.on('shop:buyFeed', ({ amount }) => {
      const result = this.market.buyFeed(amount);
      if (!result.success) this.notifications.error(result.message);
      else this.notifications.success(`🌿 購買了 ${amount} 飼料！`);
    });

    // Market events
    this.bus.on('market:sell', ({ resourceId, amount }) => {
      if (amount <= 0) return;
      const result = this.market.sellResource(resourceId, amount);
      if (!result.success) this.notifications.error(result.message);
    });

    // Care panel events
    this.bus.on('care:feedOne', ({ animalId }) => {
      const result = this.feeding.feedAnimal(animalId);
      if (!result.success) this.notifications.error(result.message);
    });

    this.bus.on('care:feedAll', ({ buildingId }) => {
      const building = this.state.buildings[buildingId];
      if (!building) return;
      let fedCount = 0;
      for (const animalId of building.animalIds) {
        const result = this.feeding.feedAnimal(animalId);
        if (result.success) fedCount++;
      }
      if (fedCount > 0) this.notifications.success(`🌿 餵食了 ${fedCount} 隻動物`);
      else this.notifications.error('飼料不足或動物都已飽食');
    });

    this.bus.on('care:buyAnimalInBuilding', ({ animalType, buildingId }) => {
      const cfg = ANIMALS[animalType];
      if (!this.state.player.spendCoins(cfg.cost)) {
        this.notifications.error('金幣不足！');
        return;
      }
      const building = this.state.buildings[buildingId];
      if (!building || building.isFull) {
        this.state.player.addCoins(cfg.cost);
        this.notifications.error('設施已滿！');
        return;
      }
      const animal = new Animal({ type: animalType, buildingId });
      this.state.animals[animal.id] = animal;
      building.addAnimal(animal.id);
      this.notifications.success(`${cfg.emoji} 購買了一隻 ${cfg.name}！`);
    });

    this.bus.on('care:upgradeBuilding', ({ buildingId }) => {
      const building = this.state.buildings[buildingId];
      if (!building) return;
      const cost = building.upgradeCost;
      if (!cost || !this.state.player.spendCoins(cost)) {
        this.notifications.error('金幣不足或無法升級！');
        return;
      }
      building.upgrade();
      const cfg = BUILDINGS[building.type];
      this.notifications.success(`🏆 ${cfg.name} 升級到 Lv${building.level}！`);
    });
  }

  _bindUIButtons() {
    const overlay = document.getElementById('panel-overlay');
    document.getElementById('btn-shop').addEventListener('click', () => {
      this._closePanels();
      this.shopPanel.toggle();
      overlay.classList.add('visible');
    });
    document.getElementById('btn-market').addEventListener('click', () => {
      this._closePanels();
      this.marketPanel.toggle();
      overlay.classList.add('visible');
    });
    document.getElementById('btn-care').addEventListener('click', () => {
      this._closePanels();
      this.carePanel.resetBuilding();
      this.carePanel.toggle();
      overlay.classList.add('visible');
    });
    document.getElementById('btn-inventory').addEventListener('click', () => {
      this._closePanels();
      this.inventoryPanel.toggle();
      overlay.classList.add('visible');
    });
    document.getElementById('btn-achievements').addEventListener('click', () => {
      this._closePanels();
      this.achievementPanel.toggle();
      overlay.classList.add('visible');
    });
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm('確定要重置遊戲嗎？所有進度將清除！')) {
        this.storage.clear();
        location.reload();
      }
    });

    // Close panels when clicking overlay
    document.getElementById('panel-overlay').addEventListener('click', () => {
      this._closePanels();
    });
  }

  _closePanels() {
    this.shopPanel.close();
    this.marketPanel.close();
    this.carePanel.close();
    this.inventoryPanel.close();
    this.achievementPanel.close();
    document.getElementById('panel-overlay').classList.remove('visible');
  }

  // ---- Helpers ----
  _findFreeTile() {
    for (let i = 0; i < 100; i++) {
      if (this.state.tiles[i] === null) return i;
    }
    return -1;
  }

  _buyAnimalForBuilding(animalType) {
    const cfg = ANIMALS[animalType];
    const buildingType = cfg.buildingType;

    // Find a building of the right type with space
    const building = Object.values(this.state.buildings).find(
      (b) => b.type === buildingType && !b.isFull
    );

    if (!building) {
      // Check if player owns the building type at all
      const anyBuilding = Object.values(this.state.buildings).find((b) => b.type === buildingType);
      if (!anyBuilding) {
        this.notifications.error(`需要先建造 ${BUILDINGS[buildingType].name}！`);
      } else {
        this.notifications.error(`${BUILDINGS[buildingType].name} 已滿！請升級或建造更多。`);
      }
      return;
    }

    if (!this.state.player.spendCoins(cfg.cost)) {
      this.notifications.error('金幣不足！');
      return;
    }

    const animal = new Animal({ type: animalType, buildingId: building.id });
    this.state.animals[animal.id] = animal;
    building.addAnimal(animal.id);
    this.notifications.success(`${cfg.emoji} 購買了一隻 ${cfg.name}！放入 ${BUILDINGS[buildingType].name}`);
    this.achievementService.check();
  }

  _placeBuilding(buildingType, tileIndex) {
    const cfg = BUILDINGS[buildingType];
    const cost = cfg.levels[0].cost;

    // Check if already owned
    const alreadyOwned = Object.values(this.state.buildings).some((b) => b.type === buildingType);
    if (alreadyOwned) {
      this.notifications.error(`已擁有 ${cfg.name}！`);
      return;
    }

    if (!this.state.player.spendCoins(cost)) {
      this.notifications.error('金幣不足！');
      return;
    }

    if (this.state.tiles[tileIndex] !== null) {
      this.state.player.addCoins(cost); // refund
      this.notifications.error('此地塊已被佔用！');
      return;
    }

    const building = new Building({ type: buildingType, tileIndex });
    this.state.buildings[building.id] = building;
    this.state.tiles[tileIndex] = building.id;
    this.notifications.success(`🏠 建造了 ${cfg.name}！`);
  }
}
