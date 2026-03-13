// ── App — Main UI Controller ──────────────────────────────────
const App = {
  _pendingAnimal: null,     // animal waiting to be placed after building selection
  _pendingAction: null,     // { type: 'build'|'plant', data }

  init() {
    const isNew = !GameService.loadOrInit();

    GameService.onTick = (state, newAch) => {
      this.renderAll(state);
      newAch.forEach(a => this.showAchievementToast(a));
    };

    GameService.startLoop();

    this._setupEventListeners();
    this.renderAll();

    if (isNew) this.showTutorial();
  },

  renderAll(state = GameService.state) {
    HudUI.render(state);
    FarmMapUI.render(state);
    InventoryUI.render(state);
  },

  // ── Tab navigation ─────────────────────────────────────────
  _setupEventListeners() {
    // Bottom nav tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');

        if (btn.dataset.tab === 'tab-market') MarketUI.render(GameService.state);
        if (btn.dataset.tab === 'tab-achievements') AchievementUI.render(GameService.state);
        if (btn.dataset.tab === 'tab-inventory') InventoryUI.render(GameService.state);
      });
    });

    // Shop modal open/close
    document.getElementById('btn-open-shop').addEventListener('click', () => this.openShop());
    document.getElementById('shop-close').addEventListener('click', () => this.closeModal('shop-modal'));
    document.getElementById('tile-action-close').addEventListener('click', () => this.closeModal('tile-action-modal'));
    document.getElementById('tutorial-close').addEventListener('click', () => this.closeModal('tutorial-modal'));
    document.getElementById('tutorial-start')?.addEventListener('click', () => this.closeModal('tutorial-modal'));

    // Shop tabs
    document.querySelectorAll('.shop-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shop-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.shop-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });

    // Speed control
    document.getElementById('speed-select').addEventListener('change', (e) => {
      GameService.setSpeed(parseInt(e.target.value, 10));
    });

    // Reset game button
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm('確定要重置遊戲嗎？所有進度將會遺失。')) {
        GameService.resetGame();
        this.renderAll();
        this.showToast('遊戲已重置，重新開始！', 'info');
      }
    });

    // Expand farm button
    document.getElementById('btn-expand').addEventListener('click', () => {
      const result = MarketService.unlockTile(GameService.state);
      this.showToast(result.ok ? `農場已擴大到 ${result.newCount} 個地塊！` : result.msg, result.ok ? 'success' : 'error');
      if (result.ok) this.renderAll();
    });
  },

  // ── Shop ───────────────────────────────────────────────────
  openShop() {
    ShopUI.renderShop(GameService.state);
    this.openModal('shop-modal');
  },

  handleShopBuy(category, type) {
    const state = GameService.state;
    let result;

    if (category === 'animal') {
      result = MarketService.buyAnimal(state, type);
      if (result.ok) {
        this._pendingAnimal = result.animal;
        this.closeModal('shop-modal');
        this.showToast(`已購買 ${result.animal.def.emoji} ${result.animal.def.name}！請點擊農場地圖上的設施來放入動物。`, 'info');
        this.renderAll();
        return;
      }
    } else if (category === 'building') {
      result = MarketService.buyBuilding(state, type);
      if (result.ok) {
        this.closeModal('shop-modal');
        this.showToast(`已建設 ${result.building.def.emoji} ${result.building.def.name}！`, 'success');
        this.renderAll();
        return;
      }
    } else if (category === 'seed') {
      result = MarketService.buySeed(state, type, 3);
      if (result.ok) {
        this.showToast(`已購買 ${CONFIG.CROPS[type].name} 種子 ×3`, 'success');
        ShopUI.renderShop(state);
        this.renderAll();
        return;
      }
    } else if (category === 'feed') {
      result = MarketService.buyFeed(state, type, 5);
      if (result.ok) {
        this.showToast(`已購買 ${CONFIG.FEEDS[type].name} ×5`, 'success');
        ShopUI.renderShop(state);
        this.renderAll();
        return;
      }
    }

    if (result && !result.ok) this.showToast(result.msg, 'error');
  },

  // ── Tile interactions ──────────────────────────────────────
  onEmptyTileClick(tile, state) {
    if (this._pendingAnimal) {
      const buildingType = this._pendingAnimal.def && this._pendingAnimal.def.buildingType;
      const buildingDef = buildingType && CONFIG.BUILDINGS[buildingType];
      const buildingName = buildingDef ? buildingDef.name : '對應設施';
      this.showToast(`請點擊對應的設施（${buildingName}）來放入動物，空地無法放置動物。`, 'info');
      return;
    }

    const hasSeeds = Object.keys(CONFIG.CROPS).some(c => (state.player.inventory['seed_' + c] || 0) > 0);

    const modal = document.getElementById('tile-action-modal');
    const content = document.getElementById('tile-action-content');
    content.innerHTML = `
      <h3>空地操作</h3>
      <p>選擇要在此地塊執行的操作：</p>
      <div class="action-buttons">
        <button class="btn btn-primary" id="ta-build">🏗️ 建設設施（前往商店）</button>
        ${hasSeeds ? '<button class="btn btn-primary" id="ta-plant">🌱 種植作物</button>' : '<p class="muted">目前沒有種子，請前往商店購買。</p>'}
      </div>
    `;

    document.getElementById('ta-build')?.addEventListener('click', () => {
      this.closeModal('tile-action-modal');
      this.openShop();
    });
    document.getElementById('ta-plant')?.addEventListener('click', () => {
      this.closeModal('tile-action-modal');
      this._showPlantPicker(tile, state);
    });

    this.openModal('tile-action-modal');
  },

  _showPlantPicker(tile, state) {
    const modal = document.getElementById('tile-action-modal');
    const content = document.getElementById('tile-action-content');
    content.innerHTML = `<h3>選擇要種植的作物</h3><div class="action-buttons" id="plant-options"></div>`;
    const opts = document.getElementById('plant-options');

    Object.values(CONFIG.CROPS).forEach(crop => {
      const seedKey = 'seed_' + crop.id;
      const qty = state.player.inventory[seedKey] || 0;
      if (qty === 0) return;
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.textContent = `${crop.emoji} ${crop.name} (庫存:${qty})`;
      btn.addEventListener('click', () => {
        const result = CropService.plantCrop(state, tile.id, crop.id);
        this.closeModal('tile-action-modal');
        this.showToast(result.ok ? `已種植 ${crop.name}！約 ${crop.growthTicks} 秒後可收穫。` : result.msg, result.ok ? 'success' : 'error');
        if (result.ok) this.renderAll();
      });
      opts.appendChild(btn);
    });

    this.openModal('tile-action-modal');
  },

  onBuildingTileClick(tile, building, state) {
    // If we have a pending animal, try to place it here
    if (this._pendingAnimal) {
      const result = FarmService.placeAnimalInBuilding(state, this._pendingAnimal, building.id);
      if (result.ok) {
        this.showToast(`${this._pendingAnimal.def.emoji} ${this._pendingAnimal.def.name} 已放入 ${building.def.name}！`, 'success');
        this._pendingAnimal = null;
        this.renderAll();
      } else {
        this.showToast(result.msg, 'error');
      }
      return;
    }

    // Show building actions
    const modal = document.getElementById('tile-action-modal');
    const content = document.getElementById('tile-action-content');
    const hasReady = building.animals.some(a => a.pendingResource > 0);
    const canFeed = building.animals.length > 0;
    const canUpgrade = building.canUpgrade;
    const feedType = CONFIG.ANIMALS[building.def.forAnimal].feedType;
    const feedStock = state.player.inventory[feedType] || 0;

    content.innerHTML = `
      <h3>${building.def.emoji} ${building.def.name} (Lv.${building.level + 1})</h3>
      <p>動物: ${building.animals.length} / ${building.capacity} 隻</p>
      <div class="action-buttons">
        ${hasReady ? `<button class="btn btn-primary" id="ta-collect">🧺 收集資源</button>` : '<p class="muted">目前沒有可收集的資源</p>'}
        ${canFeed ? `<button class="btn btn-primary" id="ta-feed">🌾 餵食動物 (需要 ${feedType} ×${building.animals.length}，庫存:${feedStock})</button>` : ''}
        ${canUpgrade ? `<button class="btn btn-warning" id="ta-upgrade">⬆️ 升級設施 (💰${building.upgradeCost})</button>` : '<p class="muted">已達最高等級</p>'}
      </div>
    `;

    document.getElementById('ta-collect')?.addEventListener('click', () => {
      const result = FarmService.collectFromBuilding(state, building.id);
      this.closeModal('tile-action-modal');
      if (result.ok) {
        this.showToast(`收集了 ${result.amount} 個 ${CONFIG.MARKET[result.resource].emoji} ${CONFIG.MARKET[result.resource].name}！`, 'success');
        this.renderAll();
      } else {
        this.showToast(result.msg, 'error');
      }
    });

    document.getElementById('ta-feed')?.addEventListener('click', () => {
      const result = FarmService.feedAnimalsInBuilding(state, building.id, feedType);
      this.closeModal('tile-action-modal');
      if (result.ok) {
        this.showToast(`已餵食 ${result.fed} 隻動物！`, 'success');
        this.renderAll();
      } else {
        this.showToast(result.msg, 'error');
      }
    });

    document.getElementById('ta-upgrade')?.addEventListener('click', () => {
      const result = MarketService.upgradeBuilding(state, building.id);
      this.closeModal('tile-action-modal');
      this.showToast(result.ok ? `${building.def.name} 已升級至 Lv.${building.level + 1}！` : result.msg, result.ok ? 'success' : 'error');
      if (result.ok) this.renderAll();
    });

    this.openModal('tile-action-modal');
  },

  onCropTileClick(tile, crop, state) {
    if (crop.isHarvestable) {
      const result = CropService.harvestCrop(state, tile.id);
      this.showToast(result.ok ? `收穫了 ${result.amount} 個 ${crop.def.emoji} ${crop.def.name}！` : result.msg, result.ok ? 'success' : 'error');
      if (result.ok) this.renderAll();
    } else {
      this.showToast(`${crop.def.name} 正在生長中... ${Math.round(crop.growthPct * 100)}%`, 'info');
    }
  },

  // ── Modal helpers ──────────────────────────────────────────
  openModal(id) {
    document.getElementById(id).classList.add('open');
    document.getElementById('modal-overlay').classList.add('open');
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('open');
    // Close overlay if no modals remain open
    const anyOpen = document.querySelectorAll('.modal.open').length > 0;
    if (!anyOpen) document.getElementById('modal-overlay').classList.remove('open');
  },

  // ── Toast notifications ────────────────────────────────────
  showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const div = document.createElement('div');
    div.className = `toast toast-${type}`;
    div.textContent = msg;
    container.appendChild(div);
    setTimeout(() => div.classList.add('show'), 50);
    setTimeout(() => {
      div.classList.remove('show');
      setTimeout(() => div.remove(), 400);
    }, 3500);
  },

  showAchievementToast(ach) {
    const container = document.getElementById('toast-container');
    const div = document.createElement('div');
    div.className = 'toast toast-achievement';
    div.innerHTML = `🏆 成就解鎖: <strong>${ach.title}</strong><br><small>${ach.desc}</small>${ach.reward.coins ? `<br><small>獎勵: 💰 ${ach.reward.coins}</small>` : ''}`;
    container.appendChild(div);
    setTimeout(() => div.classList.add('show'), 50);
    setTimeout(() => {
      div.classList.remove('show');
      setTimeout(() => div.remove(), 400);
    }, 5000);
  },

  // ── Tutorial ───────────────────────────────────────────────
  showTutorial() {
    this.openModal('tutorial-modal');
  },
};

// Boot the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
