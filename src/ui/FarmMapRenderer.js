import { BUILDINGS } from '../config/buildings.js';
import { CROPS } from '../config/crops.js';

// Renders the 10×10 farm grid
export class FarmMapRenderer {
  constructor(gameState, eventBus) {
    this._state = gameState;
    this._bus = eventBus;
    this._container = document.getElementById('farm-grid');
    this._selectedAction = null; // { type: 'building'|'crop', value }
    this._tiles = [];
    this._init();
  }

  setSelectedAction(action) {
    this._selectedAction = action;
  }

  _init() {
    this._container.innerHTML = '';
    this._tiles = [];
    for (let i = 0; i < 100; i++) {
      const tile = document.createElement('div');
      tile.className = 'farm-tile';
      tile.dataset.index = i;
      tile.addEventListener('click', () => this._onTileClick(i));
      this._container.appendChild(tile);
      this._tiles.push(tile);
    }
  }

  _onTileClick(index) {
    const occupied = this._state.tiles[index];

    if (occupied) {
      // Check if it's a crop that's ready to harvest
      const crop = this._state.crops[occupied];
      if (crop && crop.isReady) {
        this._bus.emit('ui:harvest', { cropId: crop.id, tileIndex: index });
        return;
      }
      // Check if it's a building — open care panel
      const building = this._state.buildings[occupied];
      if (building) {
        this._bus.emit('ui:buildingClick', { buildingId: building.id });
        return;
      }
      return;
    }

    // Empty tile — act on selected action
    if (this._selectedAction) {
      if (this._selectedAction.type === 'building') {
        this._bus.emit('ui:placeBuilding', {
          buildingType: this._selectedAction.value,
          tileIndex: index,
        });
      } else if (this._selectedAction.type === 'crop') {
        this._bus.emit('ui:plantCrop', {
          cropType: this._selectedAction.value,
          tileIndex: index,
        });
      }
      this._selectedAction = null;
      this._bus.emit('ui:actionCleared');
    }
  }

  render() {
    for (let i = 0; i < 100; i++) {
      const tile = this._tiles[i];
      const occupantId = this._state.tiles[i];
      tile.className = 'farm-tile';
      tile.innerHTML = '';

      if (!occupantId) {
        tile.classList.add('empty');
        if (this._selectedAction) tile.classList.add('placeable');
        continue;
      }

      const building = this._state.buildings[occupantId];
      if (building) {
        tile.classList.add('building-tile');
        const cfg = BUILDINGS[building.type];
        tile.innerHTML = `<span class="tile-emoji">${cfg.emoji}</span>
          <span class="tile-name">${cfg.name}</span>
          <span class="tile-level">Lv${building.level}</span>
          <span class="tile-count">${building.animalIds.length}/${building.capacity}</span>`;
        tile.style.setProperty('--tile-color', cfg.color);

        // Add hungry indicator
        const animalsInBuilding = building.animalIds.map((id) => this._state.animals[id]).filter(Boolean);
        const hasHungry = animalsInBuilding.some((a) => a.hunger < 50);
        if (hasHungry) tile.classList.add('has-hungry');
        continue;
      }

      const crop = this._state.crops[occupantId];
      if (crop) {
        tile.classList.add('crop-tile');
        const cfg = CROPS[crop.type];
        const stageEmoji = cfg.stages[crop.stage];
        tile.innerHTML = `<span class="tile-emoji">${stageEmoji}</span>
          <span class="tile-name">${cfg.name}</span>`;
        if (crop.isReady) {
          tile.classList.add('ready');
          tile.innerHTML += `<span class="harvest-badge">收穫!</span>`;
        } else {
          const pct = Math.round(crop.progress * 100);
          tile.innerHTML += `<div class="progress-bar"><div style="width:${pct}%"></div></div>`;
        }
      }
    }
  }
}
