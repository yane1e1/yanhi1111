// Animal configuration data
export const ANIMALS = {
  chicken: {
    id: 'chicken',
    name: '雞',
    emoji: '🐔',
    cost: 50,
    buildingType: 'henhouse',
    productionResource: 'egg',
    productionTime: 3000,   // 30s real-time → 3s demo (10x)
    productionAmount: 1,
    feedConsumptionRate: 1, // hunger per tick
    description: '勤勞的雞，定期產蛋',
  },
  cow: {
    id: 'cow',
    name: '牛',
    emoji: '🐄',
    cost: 150,
    buildingType: 'barn',
    productionResource: 'milk',
    productionTime: 6000,   // 60s → 6s demo
    productionAmount: 1,
    feedConsumptionRate: 2,
    description: '溫馴的乳牛，產出新鮮牛奶',
  },
  pig: {
    id: 'pig',
    name: '豬',
    emoji: '🐷',
    cost: 100,
    buildingType: 'pigsty',
    productionResource: 'pork',
    productionTime: 4500,   // 45s → 4.5s demo
    productionAmount: 1,
    feedConsumptionRate: 2,
    description: '肥嘟嘟的豬，提供豬肉',
  },
  sheep: {
    id: 'sheep',
    name: '羊',
    emoji: '🐑',
    cost: 120,
    buildingType: 'sheepPen',
    productionResource: 'wool',
    productionTime: 5000,   // 50s → 5s demo
    productionAmount: 1,
    feedConsumptionRate: 1,
    description: '可愛的羊，提供羊毛',
  },
  rabbit: {
    id: 'rabbit',
    name: '兔',
    emoji: '🐰',
    cost: 80,
    buildingType: 'rabbitHutch',
    productionResource: 'rabbitFur',
    productionTime: 3500,   // 35s → 3.5s demo
    productionAmount: 1,
    feedConsumptionRate: 1,
    description: '活潑的兔子，提供兔毛',
  },
};
