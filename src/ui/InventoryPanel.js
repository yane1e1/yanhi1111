import { RESOURCES } from '../config/resources.js';

// Inventory panel — shows all resources
export class InventoryPanel {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
    this._panel = document.getElementById('inventory-panel');
  }

  toggle() {
    this._panel.classList.toggle('open');
    if (this._panel.classList.contains('open')) this._render();
  }

  close() {
    this._panel.classList.remove('open');
  }

  _render() {
    const { inventory } = this._state.player;
    const rows = Object.entries(RESOURCES).map(([id, cfg]) => {
      const qty = inventory[id] || 0;
      return `<div class="inventory-item ${qty === 0 ? 'empty' : ''}">
        <span class="item-emoji">${cfg.emoji}</span>
        <span class="item-name">${cfg.name}</span>
        <span class="item-qty">${qty}</span>
      </div>`;
    }).join('');

    const { stats } = this._state.player;
    this._panel.innerHTML = `<div class="panel-header"><h2>🎒 倉庫</h2><button class="close-btn" id="inv-close">✕</button></div>
      <div class="panel-body">
        <div class="inventory-grid">${rows}</div>
        <hr/>
        <h3>📊 統計</h3>
        <ul class="stats-list">
          <li>累計收穫資源: ${stats.totalResourcesCollected}</li>
          <li>累計收穫雞蛋: ${stats.eggsCollected}</li>
          <li>累計收穫作物: ${stats.totalCropsHarvested}</li>
          <li>累計賺取金幣: ${stats.totalCoinsEarned}</li>
          <li>餵食次數: ${stats.totalFeedingActions}</li>
        </ul>
      </div>`;

    this._panel.querySelector('#inv-close').addEventListener('click', () => this.close());
  }
}
