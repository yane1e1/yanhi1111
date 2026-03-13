// ── Shop UI ───────────────────────────────────────────────────
const ShopUI = {

  renderShop(state) {
    // Animals tab
    const animalsContainer = document.getElementById('shop-animals');
    animalsContainer.innerHTML = '';
    Object.values(CONFIG.ANIMALS).forEach(def => {
      const btn = document.createElement('div');
      btn.className = 'shop-item';
      const canAfford = state.player.coins >= def.buyCost;
      btn.innerHTML = `
        <div class="shop-item-icon">${def.emoji}</div>
        <div class="shop-item-name">${def.name}</div>
        <div class="shop-item-desc">產出: ${CONFIG.MARKET[def.produces].emoji} ${CONFIG.MARKET[def.produces].name}</div>
        <div class="shop-item-cost ${canAfford ? '' : 'unaffordable'}">💰 ${def.buyCost}</div>
        <button class="btn btn-buy ${canAfford ? '' : 'btn-disabled'}" data-type="${def.id}" data-category="animal">購買</button>
      `;
      animalsContainer.appendChild(btn);
    });

    // Buildings tab
    const buildingsContainer = document.getElementById('shop-buildings');
    buildingsContainer.innerHTML = '';
    Object.values(CONFIG.BUILDINGS).forEach(def => {
      const canAfford = state.player.coins >= def.buyCost;
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `
        <div class="shop-item-icon">${def.emoji}</div>
        <div class="shop-item-name">${def.name}</div>
        <div class="shop-item-desc">容納: ${def.levels[0].capacity} 隻 ${CONFIG.ANIMALS[def.forAnimal].emoji}</div>
        <div class="shop-item-cost ${canAfford ? '' : 'unaffordable'}">💰 ${def.buyCost}</div>
        <button class="btn btn-buy ${canAfford ? '' : 'btn-disabled'}" data-type="${def.id}" data-category="building">建設</button>
      `;
      buildingsContainer.appendChild(div);
    });

    // Seeds tab
    const seedsContainer = document.getElementById('shop-seeds');
    seedsContainer.innerHTML = '';
    Object.values(CONFIG.CROPS).forEach(def => {
      const canAfford = state.player.coins >= def.seedCost;
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `
        <div class="shop-item-icon">${def.emoji}</div>
        <div class="shop-item-name">${def.name} 種子</div>
        <div class="shop-item-desc">生長: ${def.growthTicks}秒 / 收穫: ×${def.harvestYield}</div>
        <div class="shop-item-cost ${canAfford ? '' : 'unaffordable'}">💰 ${def.seedCost}</div>
        <button class="btn btn-buy ${canAfford ? '' : 'btn-disabled'}" data-type="${def.id}" data-category="seed">購買 ×3</button>
      `;
      seedsContainer.appendChild(div);
    });

    // Feed tab
    const feedContainer = document.getElementById('shop-feed');
    feedContainer.innerHTML = '';
    Object.entries(CONFIG.FEEDS).forEach(([key, feedDef]) => {
      const price = CONFIG.CROPS[key] ? CONFIG.CROPS[key].seedCost : 5;
      const canAfford = state.player.coins >= price * 5;
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `
        <div class="shop-item-icon">${feedDef.emoji}</div>
        <div class="shop-item-name">${feedDef.name}</div>
        <div class="shop-item-desc">適合: ${feedDef.feedsAnimal.map(t => CONFIG.ANIMALS[t].emoji).join(' ')}</div>
        <div class="shop-item-cost ${canAfford ? '' : 'unaffordable'}">💰 ${price * 5} (×5)</div>
        <button class="btn btn-buy ${canAfford ? '' : 'btn-disabled'}" data-type="${key}" data-category="feed">購買 ×5</button>
      `;
      feedContainer.appendChild(div);
    });

    // Attach buy handlers
    document.getElementById('shop-modal').querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('btn-disabled')) return;
        App.handleShopBuy(btn.dataset.category, btn.dataset.type);
      });
    });
  },
};
