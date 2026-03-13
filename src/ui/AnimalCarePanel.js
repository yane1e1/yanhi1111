import { ANIMALS } from '../config/animals.js';
import { BUILDINGS } from '../config/buildings.js';

// Animal care panel — view animals, feed them, upgrade building
export class AnimalCarePanel {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
    this._panel = document.getElementById('care-panel');
    this._currentBuildingId = null;

    this._bus.on('ui:buildingClick', ({ buildingId }) => {
      this._currentBuildingId = buildingId;
      this._render();
      this._panel.classList.add('open');
    });
  }

  resetBuilding() {
    this._currentBuildingId = null;
  }

  toggle() {
    this._panel.classList.toggle('open');
    if (this._panel.classList.contains('open')) this._render();
  }

  close() {
    this._panel.classList.remove('open');
  }

  _render() {
    const building = this._currentBuildingId
      ? this._state.buildings[this._currentBuildingId]
      : null;

    if (!building) {
      // Show all animals grouped by building
      this._renderAll();
      return;
    }

    const cfg = BUILDINGS[building.type];
    const animals = building.animalIds.map((id) => this._state.animals[id]).filter(Boolean);
    const animalCfg = ANIMALS[cfg.animalType];

    const animalRows = animals.map((a) => this._animalRow(a)).join('');
    const feedCost = 5;
    const feedQty = this._state.player.getResource('feed');

    let upgradeBtn = '';
    if (building.canUpgrade) {
      const cost = building.upgradeCost;
      const canUpgrade = this._state.player.coins >= cost;
      upgradeBtn = `<button class="upgrade-btn" data-building="${building.id}" ${canUpgrade ? '' : 'disabled'}>
        升級到 Lv${building.level + 1} (💰 ${cost})
      </button>`;
    }

    let buyAnimalBtn = '';
    if (!building.isFull) {
      const aCost = animalCfg.cost;
      const canBuy = this._state.player.coins >= aCost;
      buyAnimalBtn = `<button class="buy-animal-btn" data-animal="${cfg.animalType}" data-building="${building.id}" ${canBuy ? '' : 'disabled'}>
        購買 ${animalCfg.emoji} ${animalCfg.name} (💰 ${aCost})
      </button>`;
    } else {
      buyAnimalBtn = `<span class="full-badge">設施已滿 (${building.animalIds.length}/${building.capacity})</span>`;
    }

    this._panel.innerHTML = `<div class="panel-header">
        <h2>${cfg.emoji} ${cfg.name} - Lv${building.level} (${building.animalIds.length}/${building.capacity})</h2>
        <button class="close-btn" id="care-close">✕</button>
      </div>
      <div class="panel-body">
        <div class="building-actions">${buyAnimalBtn} ${upgradeBtn}</div>
        <div class="feed-section">
          <span>飼料庫存: 🌿 ${feedQty}</span>
          <button id="feed-all-btn">全部餵食 (各消耗1飼料)</button>
        </div>
        <div class="animal-list">${animalRows}</div>
      </div>`;

    this._panel.querySelector('#care-close').addEventListener('click', () => this.close());
    this._panel.querySelector('#feed-all-btn').addEventListener('click', () => {
      this._bus.emit('care:feedAll', { buildingId: building.id });
      this._render();
    });

    for (const btn of this._panel.querySelectorAll('.feed-one-btn')) {
      btn.addEventListener('click', () => {
        this._bus.emit('care:feedOne', { animalId: btn.dataset.animal });
        this._render();
      });
    }
    for (const btn of this._panel.querySelectorAll('.buy-animal-btn')) {
      btn.addEventListener('click', () => {
        this._bus.emit('care:buyAnimalInBuilding', {
          animalType: btn.dataset.animal,
          buildingId: btn.dataset.building,
        });
        this._render();
      });
    }
    for (const btn of this._panel.querySelectorAll('.upgrade-btn')) {
      btn.addEventListener('click', () => {
        this._bus.emit('care:upgradeBuilding', { buildingId: btn.dataset.building });
        this._render();
      });
    }
  }

  _renderAll() {
    const buildings = Object.values(this._state.buildings);
    const sections = buildings.map((b) => {
      const cfg = BUILDINGS[b.type];
      const animals = b.animalIds.map((id) => this._state.animals[id]).filter(Boolean);
      const rows = animals.map((a) => this._animalRow(a)).join('');
      return `<div class="building-section">
        <h3>${cfg.emoji} ${cfg.name} Lv${b.level}</h3>
        <button class="open-building-btn" data-building="${b.id}">管理</button>
        ${rows || '<p>無動物</p>'}
      </div>`;
    }).join('');

    this._panel.innerHTML = `<div class="panel-header"><h2>🐾 動物照料</h2><button class="close-btn" id="care-close">✕</button></div>
      <div class="panel-body">${sections || '<p>尚未建造任何設施</p>'}</div>`;

    this._panel.querySelector('#care-close').addEventListener('click', () => this.close());
    for (const btn of this._panel.querySelectorAll('.open-building-btn')) {
      btn.addEventListener('click', () => {
        this._currentBuildingId = btn.dataset.building;
        this._render();
      });
    }
    for (const btn of this._panel.querySelectorAll('.feed-one-btn')) {
      btn.addEventListener('click', () => {
        this._bus.emit('care:feedOne', { animalId: btn.dataset.animal });
        this._render();
      });
    }
  }

  _animalRow(animal) {
    const cfg = ANIMALS[animal.type];
    const hungerColor = animal.hunger > 60 ? '#4caf50' : animal.hunger > 30 ? '#ff9800' : '#f44336';
    const stateLabel = { healthy: '健康', hungry: '飢餓', starving: '快餓死了' }[animal.state];
    return `<div class="animal-row">
      <span class="animal-emoji">${cfg.emoji}</span>
      <div class="animal-info">
        <span class="animal-name">${cfg.name}</span>
        <span class="animal-state state-${animal.state}">${stateLabel}</span>
        <div class="hunger-bar">
          <div style="width:${animal.hunger}%;background:${hungerColor}"></div>
        </div>
        <span class="hunger-label">飽食度: ${Math.round(animal.hunger)}%</span>
      </div>
      <button class="feed-one-btn" data-animal="${animal.id}">餵食 🌿</button>
    </div>`;
  }
}
