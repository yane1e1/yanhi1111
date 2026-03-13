// Crop configuration data
export const CROPS = {
  wheat: {
    id: 'wheat',
    name: '小麥',
    emoji: '🌾',
    seedCost: 10,
    growthTime: 6000,   // 60s real → 6s demo (10x)
    feedYield: 3,
    sellPrice: 8,
    description: '最基本的農作物，成熟後可當飼料',
    stages: ['🌱', '🌿', '🌾'],
  },
  corn: {
    id: 'corn',
    name: '玉米',
    emoji: '🌽',
    seedCost: 15,
    growthTime: 9000,   // 90s → 9s demo
    feedYield: 5,
    sellPrice: 12,
    description: '豐收的玉米，飼料產量高',
    stages: ['🌱', '🌿', '🌽'],
  },
  carrot: {
    id: 'carrot',
    name: '胡蘿蔔',
    emoji: '🥕',
    seedCost: 12,
    growthTime: 7500,   // 75s → 7.5s demo
    feedYield: 4,
    sellPrice: 10,
    description: '兔子最愛的胡蘿蔔',
    stages: ['🌱', '🌿', '🥕'],
  },
};
