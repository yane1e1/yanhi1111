// ============================================================
// Game Configuration — all constants for Animal Farm Game
// ============================================================

const CONFIG = {

  // ── Timing ────────────────────────────────────────────────
  TICK_INTERVAL_MS: 1000,         // Base tick interval at 1× speed (divided by speed multiplier)
  SAVE_DEBOUNCE_MS: 2000,
  STARTING_COINS: 500,
  STARTING_FARM_SIZE: 16,         // 4×4 grid

  // ── Farm expansion (tile unlocks) ─────────────────────────
  FARM_SIZES: [
    { tiles: 16, level: 1, cost: 0 },
    { tiles: 25, level: 3, cost: 800 },
    { tiles: 36, level: 5, cost: 2000 },
  ],

  // ── Animal definitions ────────────────────────────────────
  ANIMALS: {
    chicken: {
      id: 'chicken', name: '雞', emoji: '🐔',
      buyCost: 50, feedType: 'wheat', feedCost: 1,
      hungerDecayPerTick: 0.5,        // hunger units lost per tick
      healthDecayPerTick: 0.3,        // health lost per tick when starving
      productionTicks: 30,            // every 30 ticks produces
      produces: 'egg', produceAmount: 1,
      maxHealth: 100, maxHunger: 100,
      buildingType: 'coop',
    },
    cow: {
      id: 'cow', name: '牛', emoji: '🐄',
      buyCost: 200, feedType: 'corn', feedCost: 2,
      hungerDecayPerTick: 0.4,
      healthDecayPerTick: 0.25,
      productionTicks: 60,
      produces: 'milk', produceAmount: 2,
      maxHealth: 100, maxHunger: 100,
      buildingType: 'barn',
    },
    pig: {
      id: 'pig', name: '豬', emoji: '🐷',
      buyCost: 150, feedType: 'carrot', feedCost: 2,
      hungerDecayPerTick: 0.6,
      healthDecayPerTick: 0.35,
      productionTicks: 45,
      produces: 'pork', produceAmount: 1,
      maxHealth: 100, maxHunger: 100,
      buildingType: 'sty',
    },
    sheep: {
      id: 'sheep', name: '羊', emoji: '🐑',
      buyCost: 180, feedType: 'wheat', feedCost: 1,
      hungerDecayPerTick: 0.35,
      healthDecayPerTick: 0.2,
      productionTicks: 90,
      produces: 'wool', produceAmount: 2,
      maxHealth: 100, maxHunger: 100,
      buildingType: 'pen',
    },
    rabbit: {
      id: 'rabbit', name: '兔', emoji: '🐇',
      buyCost: 80, feedType: 'carrot', feedCost: 1,
      hungerDecayPerTick: 0.45,
      healthDecayPerTick: 0.3,
      productionTicks: 20,
      produces: 'fur', produceAmount: 1,
      maxHealth: 100, maxHunger: 100,
      buildingType: 'hutch',
    },
  },

  // ── Building definitions ──────────────────────────────────
  BUILDINGS: {
    coop: {
      id: 'coop', name: '雞舍', emoji: '🏠',
      buyCost: 100, forAnimal: 'chicken',
      levels: [
        { capacity: 2, efficiencyBonus: 1.0, upgradeCost: 0 },
        { capacity: 4, efficiencyBonus: 1.2, upgradeCost: 300 },
        { capacity: 6, efficiencyBonus: 1.5, upgradeCost: 600 },
      ],
    },
    barn: {
      id: 'barn', name: '牛棚', emoji: '🏚️',
      buyCost: 300, forAnimal: 'cow',
      levels: [
        { capacity: 1, efficiencyBonus: 1.0, upgradeCost: 0 },
        { capacity: 2, efficiencyBonus: 1.2, upgradeCost: 500 },
        { capacity: 3, efficiencyBonus: 1.5, upgradeCost: 1000 },
      ],
    },
    sty: {
      id: 'sty', name: '豬圈', emoji: '🐖',
      buyCost: 200, forAnimal: 'pig',
      levels: [
        { capacity: 2, efficiencyBonus: 1.0, upgradeCost: 0 },
        { capacity: 4, efficiencyBonus: 1.2, upgradeCost: 400 },
        { capacity: 6, efficiencyBonus: 1.5, upgradeCost: 800 },
      ],
    },
    pen: {
      id: 'pen', name: '羊欄', emoji: '⛺',
      buyCost: 250, forAnimal: 'sheep',
      levels: [
        { capacity: 2, efficiencyBonus: 1.0, upgradeCost: 0 },
        { capacity: 4, efficiencyBonus: 1.2, upgradeCost: 450 },
        { capacity: 6, efficiencyBonus: 1.5, upgradeCost: 900 },
      ],
    },
    hutch: {
      id: 'hutch', name: '兔窩', emoji: '🏡',
      buyCost: 120, forAnimal: 'rabbit',
      levels: [
        { capacity: 3, efficiencyBonus: 1.0, upgradeCost: 0 },
        { capacity: 5, efficiencyBonus: 1.2, upgradeCost: 300 },
        { capacity: 8, efficiencyBonus: 1.5, upgradeCost: 600 },
      ],
    },
  },

  // ── Crop definitions ──────────────────────────────────────
  CROPS: {
    wheat: {
      id: 'wheat', name: '小麥', emoji: '🌾',
      seedCost: 10,
      growthTicks: 60,        // seconds to mature
      harvestYield: 3,        // units of feed/resource per harvest
      sellPrice: 5,
    },
    corn: {
      id: 'corn', name: '玉米', emoji: '🌽',
      seedCost: 15,
      growthTicks: 90,
      harvestYield: 3,
      sellPrice: 8,
    },
    carrot: {
      id: 'carrot', name: '胡蘿蔔', emoji: '🥕',
      seedCost: 12,
      growthTicks: 75,
      harvestYield: 3,
      sellPrice: 6,
    },
  },

  // ── Resource sell prices ──────────────────────────────────
  MARKET: {
    egg:  { name: '雞蛋', emoji: '🥚', sellPrice: 8 },
    milk: { name: '牛奶', emoji: '🥛', sellPrice: 20 },
    pork: { name: '豬肉', emoji: '🥩', sellPrice: 15 },
    wool: { name: '羊毛', emoji: '🧶', sellPrice: 18 },
    fur:  { name: '兔毛', emoji: '🪶', sellPrice: 12 },
    wheat:  { name: '小麥', emoji: '🌾', sellPrice: 5 },
    corn:   { name: '玉米', emoji: '🌽', sellPrice: 8 },
    carrot: { name: '胡蘿蔔', emoji: '🥕', sellPrice: 6 },
  },

  // ── Feed items (from crops) ───────────────────────────────
  FEEDS: {
    wheat:  { name: '小麥飼料', emoji: '🌾', feedsAnimal: ['chicken', 'sheep'] },
    corn:   { name: '玉米飼料', emoji: '🌽', feedsAnimal: ['cow'] },
    carrot: { name: '胡蘿蔔', emoji: '🥕', feedsAnimal: ['pig', 'rabbit'] },
  },

  // ── XP per action ─────────────────────────────────────────
  XP: {
    buyAnimal: 20,
    collectResource: 5,
    sellResource: 3,
    harvestCrop: 10,
    feedAnimal: 2,
    buyBuilding: 30,
    upgradeBuilding: 50,
  },

  // ── Level thresholds (XP needed to reach each level) ──────
  LEVELS: [
    0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  ],

  // ── Achievements ──────────────────────────────────────────
  ACHIEVEMENTS: [
    { id: 'first_egg',     title: '初次收穫',    desc: '第一次收集到雞蛋',         condition: (s) => (s.stats.totalCollected.egg || 0) >= 1,   reward: { coins: 50 } },
    { id: 'egg_hoarder',   title: '雞蛋達人',    desc: '累計收集 10 顆雞蛋',       condition: (s) => (s.stats.totalCollected.egg || 0) >= 10,  reward: { coins: 100 } },
    { id: 'first_sell',    title: '初次交易',    desc: '第一次在市場出售資源',      condition: (s) => (s.stats.totalSold || 0) >= 1,           reward: { coins: 30 } },
    { id: 'rich_farmer',   title: '富農',        desc: '同時持有 1000 枚金幣',      condition: (s) => s.player.coins >= 1000,                   reward: { coins: 200 } },
    { id: 'five_animals',  title: '五畜興旺',    desc: '農場中同時擁有 5 隻動物',   condition: (s) => s.stats.animalCount >= 5,                 reward: { coins: 150 } },
    { id: 'all_species',   title: '動物達人',    desc: '擁有所有 5 種動物各一隻',   condition: (s) => s.stats.speciesOwned >= 5,                reward: { coins: 500 } },
    { id: 'first_harvest', title: '豐收季節',    desc: '第一次收穫作物',            condition: (s) => (s.stats.totalHarvested || 0) >= 1,       reward: { coins: 40 } },
    { id: 'crop_master',   title: '農耕高手',    desc: '累計收穫 20 次作物',        condition: (s) => (s.stats.totalHarvested || 0) >= 20,      reward: { coins: 200 } },
    { id: 'level5',        title: '農場老手',    desc: '達到 5 級',                 condition: (s) => s.player.level >= 5,                      reward: { coins: 300 } },
    { id: 'upgraded',      title: '設施升級',    desc: '第一次升級設施',            condition: (s) => (s.stats.totalUpgrades || 0) >= 1,        reward: { coins: 100 } },
    { id: 'well_fed',      title: '愛護動物',    desc: '累計餵食動物 50 次',        condition: (s) => (s.stats.totalFeeds || 0) >= 50,          reward: { coins: 150 } },
    { id: 'milk_producer', title: '牧場之星',    desc: '累計收集 10 瓶牛奶',        condition: (s) => (s.stats.totalCollected.milk || 0) >= 10, reward: { coins: 200 } },
  ],
};
