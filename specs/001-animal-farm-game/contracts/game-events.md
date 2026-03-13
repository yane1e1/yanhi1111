# Game Events Contract

**Feature**: `001-animal-farm-game` | **Date**: 2026-03-13
**Scope**: 定義遊戲內部事件（DOM CustomEvent）與模組間通訊介面

---

## 事件設計原則

- 事件以 `CustomEvent` 派發至 `document`。
- 事件命名格式：`farm:<domain>:<action>`（全小寫、連字號分隔）。
- 所有事件 payload 封裝在 `event.detail` 中。
- 事件為單向通知（fire-and-forget），不使用回傳值。

---

## 事件清單

### 動物相關

#### `farm:animal:purchased`
玩家購買一隻新動物時觸發。

```js
// Payload
{
  animalId: string,   // 新動物的 UUID
  species: string,    // 動物種類
  cost: number,       // 扣除的金幣數
  buildingId: string, // 放入的設施 ID
}
```

#### `farm:animal:fed`
玩家餵食動物時觸發。

```js
{
  animalId: string,
  feedAmount: number,  // 消耗的飼料數量
  hungerAfter: number, // 餵食後的飽食度
}
```

#### `farm:animal:produced`
動物完成一次資源產出時觸發（由遊戲主迴圈觸發）。

```js
{
  animalId: string,
  species: string,
  resourceType: string,  // 'egg' | 'milk' | 'pork' | 'wool' | 'rabbitFur'
  amount: number,
}
```

---

### 作物相關

#### `farm:crop:planted`
玩家種植作物時觸發。

```js
{
  cropPlotId: string,
  cropType: string,    // 'wheat' | 'corn' | 'carrot'
  seedCost: number,
}
```

#### `farm:crop:harvested`
玩家收穫成熟作物時觸發。

```js
{
  cropPlotId: string,
  cropType: string,
  yieldAmount: number,
  yieldType: string,   // 'feed'
}
```

---

### 倉庫相關

#### `farm:inventory:sold`
玩家出售資源時觸發。

```js
{
  resourceType: string,
  amount: number,
  totalCoins: number,  // 獲得的金幣
  coinsAfter: number,  // 出售後玩家總金幣
}
```

---

### 設施相關

#### `farm:building:upgraded`
玩家升級設施時觸發。

```js
{
  buildingId: string,
  buildingType: string,
  newLevel: number,
  newCapacity: number,
  cost: number,
}
```

---

### 成就相關

#### `farm:achievement:unlocked`
成就解鎖時觸發（由 achievement.js 觸發）。

```js
{
  achievementId: string,
  name: string,        // 顯示用名稱
  reward: number,      // 發放的金幣獎勵
}
```

---

### 系統相關

#### `farm:game:saved`
遊戲狀態成功儲存至 localStorage 後觸發。

```js
{
  timestamp: number,   // Date.now()
}
```

#### `farm:game:tick`
遊戲主迴圈每秒觸發，供 UI 模組更新倒計時顯示。

```js
{
  tickCount: number,   // 累計 tick 次數
}
```

---

## 事件監聽範例

```js
// ui.js 監聽成就解鎖事件
document.addEventListener('farm:achievement:unlocked', (e) => {
  const { name, reward } = e.detail;
  showNotification(`🏆 成就解鎖：${name}！獲得 ${reward} 金幣`);
});

// game.js 派發動物購買事件
document.dispatchEvent(new CustomEvent('farm:animal:purchased', {
  detail: { animalId, species, cost, buildingId }
}));
```
