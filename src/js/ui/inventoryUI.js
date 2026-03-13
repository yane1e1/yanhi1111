// ── Inventory UI ─────────────────────────────────────────────
const InventoryUI = {
  render(state) {
    const inv = state.player.inventory;
    const container = document.getElementById('inventory-list');
    container.innerHTML = '';

    const items = Object.entries(inv).filter(([, qty]) => qty > 0);
    if (items.length === 0) {
      container.innerHTML = '<p class="empty-msg">倉庫空空如也</p>';
      return;
    }

    items.forEach(([item, qty]) => {
      const market = CONFIG.MARKET[item];
      const isResource = !!market;
      const div = document.createElement('div');
      div.className = 'inventory-item';

      let displayName = item;
      let displayEmoji = '📦';

      if (market) {
        displayName = market.name;
        displayEmoji = market.emoji;
      } else if (item.startsWith('seed_')) {
        const cropType = item.replace('seed_', '');
        const crop = CONFIG.CROPS[cropType];
        if (crop) { displayName = crop.name + ' 種子'; displayEmoji = crop.emoji; }
      } else if (CONFIG.FEEDS[item]) {
        displayName = CONFIG.FEEDS[item].name;
        displayEmoji = CONFIG.FEEDS[item].emoji;
      }

      div.innerHTML = `
        <span class="item-emoji">${displayEmoji}</span>
        <span class="item-name">${displayName}</span>
        <span class="item-qty">× ${qty}</span>
        ${isResource ? `<button class="btn btn-sm btn-sell" data-item="${item}" data-qty="${qty}">全部出售</button>` : ''}
      `;
      container.appendChild(div);
    });

    // Sell buttons
    container.querySelectorAll('.btn-sell').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.dataset.item;
        const qty = parseInt(btn.dataset.qty, 10);
        const result = MarketService.sellResource(GameService.state, item, qty);
        App.showToast(result.ok ? `售出 ${qty} ${CONFIG.MARKET[item].name} 獲得 💰${result.earned}` : result.msg, result.ok ? 'success' : 'error');
        if (result.ok) App.renderAll();
      });
    });
  },
};
