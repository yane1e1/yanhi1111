// ── Farm Map UI ───────────────────────────────────────────────
const FarmMapUI = {
  _selectedTile: null,

  render(state) {
    const grid = document.getElementById('farm-grid');
    const totalSize = CONFIG.FARM_SIZES[CONFIG.FARM_SIZES.length - 1].tiles;
    const cols = Math.ceil(Math.sqrt(totalSize));
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.innerHTML = '';

    state.tiles.forEach(tile => {
      const el = document.createElement('div');
      el.className = 'tile';
      el.dataset.tileId = tile.id;

      if (!tile.unlocked) {
        el.classList.add('tile--locked');
        el.innerHTML = `<span class="tile-icon">🔒</span>`;
        el.title = '地塊已鎖定';
        grid.appendChild(el);
        return;
      }

      el.classList.add('tile--empty');

      if (tile.buildingId) {
        const building = FarmService.getBuilding(state, tile.buildingId);
        el.classList.remove('tile--empty');
        el.classList.add('tile--building');
        const hasReady = building.animals.some(a => a.pendingResource > 0);
        const needsFeed = building.animals.some(a => a.hunger < 20);
        const animalEmojis = building.animals.map(a => {
          const healthPct = a.health / a.def.maxHealth;
          return `<span class="animal-icon" title="${a.def.name} ❤️${Math.round(a.health)} 🍽️${Math.round(a.hunger)}">${a.def.emoji}${healthPct < 0.5 ? '😰' : ''}</span>`;
        }).join('');
        el.innerHTML = `
          <div class="tile-building-name">${building.def.emoji} ${building.def.name}</div>
          <div class="tile-animals">${animalEmojis || '<span class="empty-pen">空</span>'}</div>
          <div class="tile-building-info">
            ${building.animals.length}/${building.capacity}
            ${hasReady ? '<span class="badge-ready">!</span>' : ''}
            ${needsFeed ? '<span class="badge-warn">⚠️</span>' : ''}
          </div>
        `;
        el.title = `${building.def.name} (Lv.${building.level + 1}) — 點擊操作`;
        el.addEventListener('click', () => App.onBuildingTileClick(tile, building, state));
      } else if (tile.cropId) {
        const crop = state.crops.find(c => c.id === tile.cropId);
        el.classList.remove('tile--empty');
        el.classList.add('tile--crop');
        const pct = Math.round(crop.growthPct * 100);
        const icon = crop.isHarvestable ? '✅' : crop.def.emoji;
        el.innerHTML = `
          <div class="tile-crop-icon">${icon}</div>
          <div class="tile-crop-name">${crop.def.name}</div>
          <div class="tile-crop-progress"><div class="progress-bar" style="width:${pct}%"></div></div>
          <div class="tile-crop-pct">${pct}%</div>
        `;
        el.title = crop.isHarvestable ? '點擊收穫' : `${crop.def.name} — 成長中 ${pct}%`;
        el.addEventListener('click', () => App.onCropTileClick(tile, crop, state));
      } else {
        el.innerHTML = `<span class="tile-plus">+</span>`;
        el.title = '點擊在此建設或種植';
        el.addEventListener('click', () => App.onEmptyTileClick(tile, state));
      }

      grid.appendChild(el);
    });
  },
};
