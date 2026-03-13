import { RESOURCES } from '../config/resources.js';

// Market panel — sell resources
export class MarketPanel {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
    this._panel = document.getElementById('market-panel');
  }

  toggle() {
    this._panel.classList.toggle('open');
    if (this._panel.classList.contains('open')) this._render();
  }

  close() {
    this._panel.classList.remove('open');
  }

  _render() {
    const sellableIds = ['egg', 'milk', 'wool', 'pork', 'rabbitFur'];
    const rows = sellableIds.map((id) => {
      const cfg = RESOURCES[id];
      const qty = this._state.player.getResource(id);
      const canSell = qty > 0;
      return `<div class="market-item">
        <span class="item-emoji">${cfg.emoji}</span>
        <span class="item-name">${cfg.name}</span>
        <span class="item-qty">庫存: ${qty}</span>
        <span class="item-price">💰 ${cfg.sellPrice}/個</span>
        <button class="sell-btn" data-sell="${id}" data-amount="1" ${canSell ? '' : 'disabled'}>賣出 1</button>
        <button class="sell-btn" data-sell="${id}" data-amount="${qty}" ${canSell ? '' : 'disabled'}>全部賣出</button>
      </div>`;
    }).join('');

    this._panel.innerHTML = `<div class="panel-header"><h2>🏪 市場</h2><button class="close-btn" id="market-close">✕</button></div>
      <div class="panel-body">${rows}</div>`;

    this._panel.querySelector('#market-close').addEventListener('click', () => this.close());

    for (const btn of this._panel.querySelectorAll('.sell-btn')) {
      btn.addEventListener('click', () => {
        this._bus.emit('market:sell', { resourceId: btn.dataset.sell, amount: parseInt(btn.dataset.amount, 10) });
        this._render();
      });
    }
  }
}
