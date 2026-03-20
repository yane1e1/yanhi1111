import { ANIMALS } from '../config/animals.js';
import { BUILDINGS } from '../config/buildings.js';
import { CROPS } from '../config/crops.js';

// Shop panel — buy animals, buildings, and crop seeds
export class ShopPanel {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
    this._panel = document.getElementById('shop-panel');
    this._render();
    this._bus.on('resource:sold', () => this._render());
    this._bus.on('feed:bought', () => this._render());
  }

  toggle() {
    this._panel.classList.toggle('open');
    if (this._panel.classList.contains('open')) this._render();
  }

  close() {
    this._panel.classList.remove('open');
  }

  _render() {
    this._panel.innerHTML = `<div class="panel-header"><h2>🛒 商店</h2><button class="close-btn" id="shop-close">✕</button></div>
      <div class="panel-body">
        <h3>🐾 動物</h3>
        <div class="shop-grid">${this._renderAnimals()}</div>
        <h3>🏠 建築</h3>
        <div class="shop-grid">${this._renderBuildings()}</div>
        <h3>🌱 作物種子</h3>
        <div class="shop-grid">${this._renderCrops()}</div>
        <h3>🌿 飼料</h3>
        <div class="shop-grid">${this._renderFeed()}</div>
      </div>`;

    this._panel.querySelector('#shop-close').addEventListener('click', () => this.close());

    for (const btn of this._panel.querySelectorAll('[data-buy-animal]')) {
      btn.addEventListener('click', () => this._bus.emit('shop:buyAnimal', { animalType: btn.dataset.buyAnimal }));
    }
    for (const btn of this._panel.querySelectorAll('[data-buy-building]')) {
      btn.addEventListener('click', () => this._bus.emit('shop:buyBuilding', { buildingType: btn.dataset.buyBuilding }));
    }
    for (const btn of this._panel.querySelectorAll('[data-buy-crop]')) {
      btn.addEventListener('click', () => this._bus.emit('shop:buyCrop', { cropType: btn.dataset.buyCrop }));
    }
    for (const btn of this._panel.querySelectorAll('[data-buy-feed]')) {
      btn.addEventListener('click', () => this._bus.emit('shop:buyFeed', { amount: parseInt(btn.dataset.buyFeed, 10) }));
    }
  }

  _renderAnimals() {
    return Object.values(ANIMALS).map((cfg) => {
      const canAfford = this._state.player.coins >= cfg.cost;
      return `<div class="shop-item ${canAfford ? '' : 'cannot-afford'}">
        <span class="item-emoji">${cfg.emoji}</span>
        <span class="item-name">${cfg.name}</span>
        <span class="item-desc">${cfg.description}</span>
        <span class="item-cost">💰 ${cfg.cost}</span>
        <button data-buy-animal="${cfg.id}" ${canAfford ? '' : 'disabled'}>購買</button>
      </div>`;
    }).join('');
  }

  _renderBuildings() {
    return Object.values(BUILDINGS).map((cfg) => {
      const levelCfg = cfg.levels[0];
      const cost = levelCfg.cost;
      const canAfford = this._state.player.coins >= cost;
      const alreadyOwned = Object.values(this._state.buildings).some((b) => b.type === cfg.id);
      if (alreadyOwned) {
        return `<div class="shop-item owned">
          <span class="item-emoji">${cfg.emoji}</span>
          <span class="item-name">${cfg.name}</span>
          <span class="owned-badge">已擁有</span>
        </div>`;
      }
      return `<div class="shop-item ${canAfford ? '' : 'cannot-afford'}">
        <span class="item-emoji">${cfg.emoji}</span>
        <span class="item-name">${cfg.name}</span>
        <span class="item-desc">${cfg.description}</span>
        <span class="item-cost">${cost === 0 ? '免費' : `💰 ${cost}`}</span>
        <button data-buy-building="${cfg.id}" ${canAfford ? '' : 'disabled'}>建造</button>
      </div>`;
    }).join('');
  }

  _renderCrops() {
    return Object.values(CROPS).map((cfg) => {
      const canAfford = this._state.player.coins >= cfg.seedCost;
      return `<div class="shop-item ${canAfford ? '' : 'cannot-afford'}">
        <span class="item-emoji">${cfg.emoji}</span>
        <span class="item-name">${cfg.name}</span>
        <span class="item-desc">${cfg.description}</span>
        <span class="item-cost">💰 ${cfg.seedCost}</span>
        <button data-buy-crop="${cfg.id}" ${canAfford ? '' : 'disabled'}>種植</button>
      </div>`;
    }).join('');
  }

  _renderFeed() {
    return `<div class="shop-item">
      <span class="item-emoji">🌿</span>
      <span class="item-name">飼料 ×5</span>
      <span class="item-desc">直接購買飼料用於餵食動物</span>
      <span class="item-cost">💰 25</span>
      <button data-buy-feed="5">購買</button>
    </div>
    <div class="shop-item">
      <span class="item-emoji">🌿</span>
      <span class="item-name">飼料 ×20</span>
      <span class="item-cost">💰 100</span>
      <button data-buy-feed="20">購買</button>
    </div>`;
  }
}
