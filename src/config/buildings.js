// Building configuration data
export const BUILDINGS = {
  henhouse: {
    id: 'henhouse',
    name: '雞舍',
    emoji: '🏠',
    animalType: 'chicken',
    levels: [
      { level: 1, cost: 0,   capacity: 3,  upgradeCost: 200 },
      { level: 2, cost: 200, capacity: 6,  upgradeCost: 500 },
      { level: 3, cost: 500, capacity: 10, upgradeCost: null },
    ],
    description: '用來飼養雞的小屋',
    color: '#f9a825',
  },
  barn: {
    id: 'barn',
    name: '牛棚',
    emoji: '🏚️',
    animalType: 'cow',
    levels: [
      { level: 1, cost: 0,   capacity: 2,  upgradeCost: 400 },
      { level: 2, cost: 400, capacity: 4,  upgradeCost: 800 },
      { level: 3, cost: 800, capacity: 6,  upgradeCost: null },
    ],
    description: '用來飼養牛的牛棚',
    color: '#8d6e63',
  },
  pigsty: {
    id: 'pigsty',
    name: '豬圈',
    emoji: '🐖',
    animalType: 'pig',
    levels: [
      { level: 1, cost: 0,   capacity: 3,  upgradeCost: 300 },
      { level: 2, cost: 300, capacity: 6,  upgradeCost: 600 },
      { level: 3, cost: 600, capacity: 10, upgradeCost: null },
    ],
    description: '用來飼養豬的圍欄',
    color: '#ec407a',
  },
  sheepPen: {
    id: 'sheepPen',
    name: '羊圈',
    emoji: '🐑',
    animalType: 'sheep',
    levels: [
      { level: 1, cost: 0,   capacity: 3,  upgradeCost: 350 },
      { level: 2, cost: 350, capacity: 6,  upgradeCost: 700 },
      { level: 3, cost: 700, capacity: 10, upgradeCost: null },
    ],
    description: '用來飼養羊的圍欄',
    color: '#b0bec5',
  },
  rabbitHutch: {
    id: 'rabbitHutch',
    name: '兔窩',
    emoji: '🐇',
    animalType: 'rabbit',
    levels: [
      { level: 1, cost: 0,   capacity: 5,  upgradeCost: 250 },
      { level: 2, cost: 250, capacity: 10, upgradeCost: 500 },
      { level: 3, cost: 500, capacity: 15, upgradeCost: null },
    ],
    description: '用來飼養兔子的小窩',
    color: '#a5d6a7',
  },
};
