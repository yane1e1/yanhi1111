# Research: 動物農場遊戲 (Animal Farm Game)

**Feature**: `001-animal-farm-game` | **Date**: 2026-03-13
**Status**: Complete — 所有 NEEDS CLARIFICATION 已解決

---

## 研究主題一：前端靜態遊戲渲染方式

**Decision**: 使用 DOM + CSS Grid 渲染二維農場地圖，而非 HTML5 Canvas。

**Rationale**:
- DOM 方案無需建置工具，與靜態 HTML 直接配合，符合 Constitution IV（靜態優先）。
- 農場格線為離散格子（非連續動畫），DOM 足以應付，且易於 Jest 測試（JSDOM 環境）。
- Canvas 雖效能更高，但測試難度大（需 mock canvas API），違反 Constitution III（TDD）精神。

**Alternatives considered**:
- HTML5 Canvas：效能佳但難以單元測試，YAGNI——當前規模不需要。
- WebGL / Three.js：過度複雜，違反 YAGNI 原則。
- Phaser.js：強大遊戲框架但引入大型依賴，不符合「精簡設計」。

---

## 研究主題二：時間驅動機制（動物產出、作物成長）

**Decision**: 使用 `Date.now()` 時間戳差值計算離線進度，並以 `setInterval`（1 秒輪詢）驅動即時遊戲迴圈。

**Rationale**:
- 存檔時記錄 `lastSaveTime`，載入時計算 `elapsedMs` 補算離線期間的產出與成長。
- `setInterval` 每秒 tick 更新 UI，符合「操作響應 < 1 秒」目標（SC-002）。
- 不使用 Web Workers——遊戲邏輯簡單，無需多執行緒。

**Alternatives considered**:
- `requestAnimationFrame`：適合高頻動畫，此遊戲按秒計算無需 60fps。
- Server-side 時間驗證：需後端，違反靜態網站原則。

---

## 研究主題三：本機儲存策略

**Decision**: 使用 `localStorage` 以 JSON 字串序列化整個遊戲狀態，每次操作後觸發存檔。

**Rationale**:
- `localStorage` 無需任何 API 或安裝，瀏覽器原生支援，完全符合 Constitution IV。
- 整體狀態大小估算 < 50KB（5 種動物 × N 隻 + 地圖格 × M + 成就 10 項），遠低於 5MB 限制。
- 單一 key（`animalFarmSave`）存整棵 JSON 樹，簡化讀寫邏輯。

**Alternatives considered**:
- IndexedDB：功能更強但 API 複雜，YAGNI。
- sessionStorage：頁面關閉即消失，不符合「進度保留」需求。
- 雲端儲存：需帳號與後端，超出 MVP 範圍。

---

## 研究主題四：測試框架選擇

**Decision**: 使用 **Jest**（Node.js）搭配 ES Module 轉譯（`babel-jest` + `@babel/preset-env`）或 `--experimental-vm-modules` 旗標。

**Rationale**:
- Jest 是 JavaScript 生態中最成熟的單元測試框架，文件完整。
- JSDOM 環境可模擬 `localStorage`，支援 DOM 操作測試。
- 遊戲邏輯模組（animal.js、crop.js 等）為純函式，易於單元測試。

**Alternatives considered**:
- Mocha + Chai：同樣成熟但設定稍複雜，Jest 更 zero-config。
- Vitest：更現代但 ES Module 支援更好；若 Jest 設定困難可改用。
- Playwright：E2E 測試工具，適合驗收測試但不做為主要測試框架。

---

## 研究主題五：成就系統設計模式

**Decision**: 成就以靜態常數陣列定義（`ACHIEVEMENTS` in `constants.js`），每次狀態變更後由 `achievement.js` 的 `checkAchievements(state)` 函式掃描並標記已解鎖。

**Rationale**:
- 純函式設計易於單元測試（輸入 state → 輸出新解鎖成就陣列）。
- 無需事件系統，KISS 原則。
- 10 項成就規模下，每次全量掃描耗時 < 1ms，效能無虞。

**Alternatives considered**:
- 事件驅動（EventEmitter）：靈活但增加複雜度，YAGNI。
- 資料庫觸發器模式：需後端，超出範疇。

---

## 研究主題六：遊戲常數與平衡數值

**Decision**: 以下為遊戲初始數值設計（可在 `constants.js` 中調整）：

| 動物 | 購買費用 | 飼料消耗/hr | 資源產出 | 產出週期 | 出售價格 |
|------|---------|------------|---------|---------|---------|
| 雞 | 50 金幣 | 1 份飼料 | 蛋 1 顆 | 5 分鐘 | 10 金幣/顆 |
| 牛 | 200 金幣 | 3 份飼料 | 牛奶 1 瓶 | 10 分鐘 | 30 金幣/瓶 |
| 豬 | 150 金幣 | 2 份飼料 | 豬肉 1 份 | 15 分鐘 | 40 金幣/份 |
| 羊 | 180 金幣 | 2 份飼料 | 羊毛 1 份 | 12 分鐘 | 35 金幣/份 |
| 兔 | 80 金幣 | 1 份飼料 | 兔毛 1 份 | 8 分鐘 | 20 金幣/份 |

| 作物 | 種子費用 | 成長週期 | 收穫量 | 出售價格 |
|------|---------|---------|-------|---------|
| 小麥 | 10 金幣 | 3 分鐘 | 3 份飼料 | 5 金幣/份 |
| 玉米 | 15 金幣 | 5 分鐘 | 2 份飼料 | 8 金幣/份 |
| 胡蘿蔔 | 12 金幣 | 4 分鐘 | 2 份飼料 | 7 金幣/份 |

**初始資源**: 玩家從 500 金幣開始，農場地圖 5×5 格（25 格）。

**Rationale**: 雞為最便宜入門動物，符合「5 分鐘內完成首次引導」（SC-001）。作物種植比直接購買飼料划算（3 份飼料種子成本 10 金幣 vs 直購 3×5=15 金幣）。

---

## 結論

所有技術不確定項已解決，無剩餘 NEEDS CLARIFICATION。可進入 Phase 1 設計。
