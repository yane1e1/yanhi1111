import { Player } from '../models/Player.js';
import { Animal } from '../models/Animal.js';
import { Building } from '../models/Building.js';
import { Crop } from '../models/Crop.js';
import { Achievement } from '../models/Achievement.js';
import { ACHIEVEMENTS } from '../config/achievements.js';

// Central game state — single source of truth
export class GameState {
  constructor() {
    this.player = new Player();
    this.animals = {};     // id → Animal
    this.buildings = {};   // id → Building
    this.crops = {};       // id → Crop
    this.tiles = new Array(100).fill(null); // 10×10 grid; value = buildingId | cropId | null
    this.achievements = ACHIEVEMENTS.map((cfg) => new Achievement(cfg));
    this.lastSaved = null;

    // Computed / cached stats for achievements
    this._animalTypeSet = new Set();
  }

  // ----- Computed stats used by AchievementService -----
  getAchievementStats() {
    const animalList = Object.values(this.animals);
    const typeSet = new Set(animalList.map((a) => a.type));

    const buildingList = Object.values(this.buildings);
    const maxLevel = buildingList.reduce((m, b) => Math.max(m, b.level), 0);

    return {
      totalAnimals: animalList.length,
      cowCount: animalList.filter((a) => a.type === 'cow').length,
      animalTypesOwned: typeSet.size,
      maxBuildingLevel: maxLevel,
      playerLevel: this.player.level,
      totalCoinsEarned: this.player.stats.totalCoinsEarned,
      totalResourcesCollected: this.player.stats.totalResourcesCollected,
      eggsCollected: this.player.stats.eggsCollected,
      totalCropsHarvested: this.player.stats.totalCropsHarvested,
      totalFeedingActions: this.player.stats.totalFeedingActions,
    };
  }

  // ----- Serialization -----
  serialize() {
    return {
      player: this.player.serialize(),
      animals: Object.fromEntries(
        Object.entries(this.animals).map(([k, v]) => [k, v.serialize()])
      ),
      buildings: Object.fromEntries(
        Object.entries(this.buildings).map(([k, v]) => [k, v.serialize()])
      ),
      crops: Object.fromEntries(
        Object.entries(this.crops).map(([k, v]) => [k, v.serialize()])
      ),
      tiles: [...this.tiles],
      achievements: this.achievements.map((a) => a.serialize()),
      lastSaved: Date.now(),
    };
  }

  // ----- Restoration -----
  static fromSave(data) {
    const state = new GameState();
    state.player = new Player(data.player);
    state.animals = Object.fromEntries(
      Object.entries(data.animals || {}).map(([k, v]) => [k, new Animal(v)])
    );
    state.buildings = Object.fromEntries(
      Object.entries(data.buildings || {}).map(([k, v]) => [k, new Building(v)])
    );
    state.crops = Object.fromEntries(
      Object.entries(data.crops || {}).map(([k, v]) => [k, new Crop(v)])
    );
    state.tiles = data.tiles || new Array(100).fill(null);
    // Restore achievements with unlock state
    state.achievements = ACHIEVEMENTS.map((cfg) => {
      const saved = (data.achievements || []).find((a) => a.id === cfg.id);
      return new Achievement(cfg, saved || {});
    });
    state.lastSaved = data.lastSaved || null;
    return state;
  }
}
