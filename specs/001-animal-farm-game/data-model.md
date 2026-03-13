# Data Model: 動物農場遊戲 (Animal Farm Game)

**Feature**: `001-animal-farm-game` | **Date**: 2026-03-13
**Prerequisite**: research.md complete ✅

---

## 實體關係概覽

```
Player (1) ──owns──> FarmMap (1)
FarmMap (1) ──contains──> Cell[] (N)
Cell (1) ──has──> Building | CropPlot | null
Building (1) ──houses──> Animal[] (N)
Player (1) ──has──> Inventory (1)
Player (1) ──has──> Achievement[] (N)
```

---

## 實體定義

### 1. Player（玩家）

```js
{
  coins: number,          // 當前金幣數量（初始 500）
  level: number,          // 玩家等級（初始 1）
  xp: number,             // 當前經驗值
  totalResourcesSold: number,  // 累計出售資源數（成就追蹤）
  totalAnimalsOwned: number,   // 累計購買動物數（成就追蹤）
  playtimeSeconds: number,     // 累計遊玩秒數（成就追蹤）
  lastSaveTime: number,        // Date.now() 時間戳（離線補算用）
}
```

**驗證規則**:
- `coins` ≥ 0（不允許負值；購買前需檢查餘額）
- `level` ≥ 1
- `xp` ≥ 0

**狀態轉換**:
- 每次出售資源 → `coins` 增加、`totalResourcesSold` 增加
- 每次購買 → `coins` 減少（前置條件：`coins >= price`）
- 達到 XP 閾值 → `level` 遞增、`xp` 歸零、解鎖新內容

---

### 2. FarmMap（農場地圖）

```js
{
  rows: number,           // 地圖列數（初始 5）
  cols: number,           // 地圖欄數（初始 5）
  unlockedCells: number,  // 已解鎖格子數量（初始 25，全開）
  cells: Cell[][],        // 二維陣列 cells[row][col]
}
```

**驗證規則**:
- `cells.length === rows`，每列長度 === `cols`
- 購買新地塊後 `unlockedCells` 遞增

---

### 3. Cell（農場格子）

```js
{
  row: number,
  col: number,
  type: 'empty' | 'building' | 'cropplot',
  buildingId: string | null,   // 指向 buildings[] 的 id
  cropPlotId: string | null,   // 指向 cropPlots[] 的 id
}
```

---

### 4. Building（設施）

```js
{
  id: string,             // UUID
  type: 'coop' | 'barn' | 'pigsty' | 'warehouse' | 'storehouse',
  level: number,          // 設施等級（初始 1）
  capacity: number,       // 最大容納動物數（依等級計算）
  animalIds: string[],    // 入住動物的 id 陣列
}
```

**設施類型對應動物**:
| 設施 | type 值 | 可容納動物 | 初始容量 | 每升一級增加容量 |
|------|---------|-----------|---------|----------------|
| 雞舍 | `coop` | 雞、兔 | 4 | +2 |
| 牛棚 | `barn` | 牛、羊 | 2 | +1 |
| 豬圈 | `pigsty` | 豬 | 2 | +1 |
| 倉庫 | `warehouse` | 資源儲存（非動物） | N/A | N/A |
| 穀倉 | `storehouse` | 飼料儲存（非動物） | N/A | N/A |

**驗證規則**:
- `animalIds.length <= capacity`（放入動物前需檢查）
- 升級費用 = `level × 100` 金幣

**狀態轉換**:
- 升級（`level++`）→ `capacity` 增加

---

### 5. Animal（動物）

```js
{
  id: string,             // UUID
  species: 'chicken' | 'cow' | 'pig' | 'sheep' | 'rabbit',
  health: number,         // 健康值 0–100（初始 100）
  hunger: number,         // 飽食度 0–100（初始 100；每小時降低）
  lastFedTime: number,    // Date.now() 時間戳
  lastProducedTime: number, // 上次產出資源的時間戳
  buildingId: string,     // 所在設施 id
}
```

**驗證規則**:
- `health` ∈ [0, 100]
- `hunger` ∈ [0, 100]；`hunger === 0` 時 `health` 開始每分鐘下降 5 點
- `health < 30` → 產出效率降為 50%；`health === 0` → 停止產出

**狀態轉換**:
- 餵食 → `hunger` 恢復至 100，`lastFedTime` 更新
- 時間流逝 → `hunger` 依 `(Date.now() - lastFedTime) / feedInterval` 計算扣減
- 達到產出週期 → 產出資源，`lastProducedTime` 更新

---

### 6. CropPlot（耕地）

```js
{
  id: string,
  cropType: 'wheat' | 'corn' | 'carrot' | null,  // null 表示空地
  plantedTime: number | null,  // Date.now() 時間戳，null 表示未種植
  stage: 'empty' | 'growing' | 'ready',
}
```

**狀態轉換**:
- 種植 → `stage: 'empty'` → `'growing'`，記錄 `plantedTime`
- 成長週期完成 → `stage: 'growing'` → `'ready'`
- 收穫 → `stage: 'ready'` → `'empty'`，清除 `cropType` 與 `plantedTime`

---

### 7. Inventory（倉庫）

```js
{
  resources: {
    egg: number,       // 蛋
    milk: number,      // 牛奶
    pork: number,      // 豬肉
    wool: number,      // 羊毛
    rabbitFur: number, // 兔毛
    wheat: number,     // 小麥（飼料）
    corn: number,      // 玉米（飼料）
    carrot: number,    // 胡蘿蔔（飼料）
  },
  feed: number,        // 通用飼料（由作物轉換而來）
}
```

**驗證規則**:
- 所有數量 ≥ 0
- 出售前需確認 `resources[type] >= amount`

---

### 8. Achievement（成就）

```js
{
  id: string,           // 成就 ID（如 'first_egg'）
  unlocked: boolean,    // 是否已解鎖
  unlockedAt: number | null,  // 解鎖時間戳
  progress: number,     // 當前進度值
  target: number,       // 目標值
}
```

**成就清單**（10 項）:

| ID | 名稱 | 條件 | 獎勵 |
|----|------|------|------|
| `first_egg` | 初次收穫 | 收集第 1 顆蛋 | +50 金幣 |
| `egg_collector` | 蛋蛋收藏家 | 累計收集 100 顆蛋 | +200 金幣 |
| `first_sell` | 第一桶金 | 首次出售資源 | +30 金幣 |
| `rich_farmer` | 富農 | 金幣達到 2000 | +100 金幣 |
| `animal_lover` | 動物愛好者 | 擁有 5 隻動物 | +150 金幣 |
| `diverse_farm` | 多元農場 | 擁有 3 種不同動物 | +200 金幣 |
| `green_thumb` | 綠手指 | 首次收穫作物 | +50 金幣 |
| `upgrade_master` | 設施達人 | 升級設施 1 次 | +100 金幣 |
| `speed_farmer` | 快手農夫 | 30 分鐘內完成 5 次資源收集 | +250 金幣 |
| `full_barn` | 滿欄 | 某設施達到容量上限 | +150 金幣 |

---

## 完整遊戲狀態物件（GameState）

```js
{
  version: string,          // 存檔版本，用於未來遷移（如 "1.0.0"）
  player: Player,
  farmMap: FarmMap,
  buildings: Building[],    // 全部設施（以 id 索引）
  animals: Animal[],        // 全部動物（以 id 索引）
  cropPlots: CropPlot[],    // 全部耕地（以 id 索引）
  inventory: Inventory,
  achievements: Achievement[],
}
```

**localStorage key**: `animalFarmSave`

---

## 數值常數摘要（來自 research.md）

### 動物常數

| species | buyCost | feedInterval(ms) | produceInterval(ms) | resourceType | resourceSellPrice |
|---------|---------|-----------------|---------------------|-------------|------------------|
| chicken | 50 | 3600000 (1hr) | 300000 (5min) | egg | 10 |
| cow | 200 | 3600000 (1hr) | 600000 (10min) | milk | 30 |
| pig | 150 | 3600000 (1hr) | 900000 (15min) | pork | 40 |
| sheep | 180 | 3600000 (1hr) | 720000 (12min) | wool | 35 |
| rabbit | 80 | 3600000 (1hr) | 480000 (8min) | rabbitFur | 20 |

### 作物常數

| cropType | seedCost | growthTime(ms) | yield | yieldType | sellPrice |
|----------|---------|---------------|-------|-----------|----------|
| wheat | 10 | 180000 (3min) | 3 | feed | 5 |
| corn | 15 | 300000 (5min) | 2 | feed | 8 |
| carrot | 12 | 240000 (4min) | 2 | feed | 7 |
