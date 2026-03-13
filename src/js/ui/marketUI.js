// ── Market UI ─────────────────────────────────────────────────
const MarketUI = {
  render(state) {
    const container = document.getElementById('market-list');
    container.innerHTML = '';

    Object.entries(CONFIG.MARKET).forEach(([key, def]) => {
      const qty = state.player.inventory[key] || 0;
      const row = document.createElement('div');
      row.className = 'market-row';
      row.innerHTML = `
        <span class="market-emoji">${def.emoji}</span>
        <span class="market-name">${def.name}</span>
        <span class="market-price">💰 ${def.sellPrice} / 件</span>
        <span class="market-qty">庫存: ${qty}</span>
        ${qty > 0 ? `<button class="btn btn-sm btn-sell" data-item="${key}" data-qty="${qty}">全部出售 (+${def.sellPrice * qty})</button>` : '<span class="muted">無庫存</span>'}
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('.btn-sell').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.dataset.item;
        const qty = parseInt(btn.dataset.qty, 10);
        const result = MarketService.sellResource(GameService.state, item, qty);
        App.showToast(result.ok ? `售出 ${qty} ${CONFIG.MARKET[item].name}，獲得 💰${result.earned}！` : result.msg, result.ok ? 'success' : 'error');
        if (result.ok) App.renderAll();
      });
    });
  },
};
