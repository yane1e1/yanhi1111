# Tasks: 動物農場遊戲 (Animal Farm Game)

**Input**: 設計文件來自 `/specs/001-animal-farm-game/`  
**Prerequisites**: `plan.md` ✅、`spec.md` ✅  
**Branch**: `001-animal-farm-game`  
**Generated**: 2026-03-13

---

## 格式說明：`[ID] [P?] [Story?] 描述`

- **[P]**：可平行執行（不同檔案，無未完成任務的依賴）
- **[Story]**：任務所屬 User Story（US1–US5）
- 所有任務均附具體檔案路徑

---

## Phase 1：專案設置（Setup）

**目的**：建立專案基礎骨架、樣式框架、測試環境與設定檔，為所有後續開發奠定基礎。

- [x] T001 建立完整專案目錄結構：`src/core/`、`src/models/`、`src/services/`、`src/ui/`、`src/config/`、`css/`、`tests/unit/core/`、`tests/unit/models/`、`tests/unit/services/`、`tests/integration/`（在儲存庫根目錄執行 `mkdir -p`）
- [x] T002 建立 `index.html` 基礎骨架（HTML5 DOCTYPE、`<meta charset="UTF-8">`、`<meta name="viewport">`、`<title>動物農場</title>`、`<link>` 載入四個 CSS 檔、`<script type="module">` 佔位載入 `src/core/GameEngine.js`）
- [x] T003 [P] 建立 `css/main.css`（CSS 自訂變數 `--color-*`、`--spacing-*`、全域 reset、`body` Flexbox 版面、`button` 基礎樣式、字型大小設定）
- [x] T004 [P] 建立 `css/farm-map.css`（`.farm-map` CSS Grid `repeat(10, 1fr)`、`.tile` 基礎樣式含 `min-width/height: 44px`、`:hover` 高亮、地塊狀態 class：`.tile--empty`、`.tile--building`、`.tile--crop`、`.tile--locked`）
- [x] T005 [P] 建立 `css/ui.css`（HUD 列：`.hud`、`.hud__coins`、`.hud__level`；面板：`.panel`、`.panel--shop`、`.panel--market`、`.panel--achievement`；對話框：`.dialog`；Toast 通知容器：`.notification-container`）
- [x] T006 [P] 建立 `css/animations.css`（`@keyframes bounce`、`@keyframes fadeIn`、`@keyframes slideUp`；動物搖晃動畫 `.animal--idle`；收穫特效 `.harvest-pop`；Toast 淡入淡出 `.toast-enter`、`.toast-exit`）
- [x] T007 建立 `tests/test-runner.html`（使用 Jest 27 CDN `<script src="https://unpkg.com/jest@27/build/jest.js">`、引入 jsdom 環境設定、建立 `<div id="test-output">` 顯示測試結果、逐一 `<script>` 載入所有 `*.test.js` 檔案）
- [x] T008 [P] 建立 `src/config/animals.js`（匯出 `ANIMALS` 物件：5 種動物—雞 `chicken`、牛 `cow`、豬 `pig`、羊 `sheep`、兔 `rabbit`；每種含 `cost`、`feedCost`、`productionInterval`（ms）、`resourceType`、`resourceAmount`、`healthThreshold: 50`、`starvingThreshold: 20`、`unlockLevel`）
- [x] T009 [P] 建立 `src/config/buildings.js`（匯出 `BUILDINGS` 物件：雞舍 `henhouse`、牛棚 `barn`、豬圈 `pigsty`、羊圈 `sheepfold`、兔窩 `hutch`；每種含三個等級設定 `level1/2/3`：`cost`、`capacity`、`productionBonus`、`upgradeCost`、`tileSize`）
- [x] T010 [P] 建立 `src/config/crops.js`（匯出 `CROPS` 物件：小麥 `wheat`、玉米 `corn`、胡蘿蔔 `carrot`；每種含 `seedCost`、`growthDuration`（ms，4 個階段等分）、`feedValue`、`sellPrice`、`yieldAmount`）
- [x] T011 [P] 建立 `src/config/resources.js`（匯出 `RESOURCES` 物件：蛋 `egg`、牛奶 `milk`、羊毛 `wool`、豬肉 `pork`、兔毛 `rabbitFur`；每種含 `name`（繁中）、`sellPrice`、`icon` 文字符號）
- [x] T012 [P] 建立 `src/config/achievements.js`（匯出 `ACHIEVEMENTS` 陣列，含 10+ 項成就；每項含 `id`、`name`（繁中）、`description`（繁中）、`condition`（`{ type: 'resourceCollected' | 'animalCount' | 'level' | 'coinsEarned', target, resourceType? }`）、`reward`（`{ type: 'coins' | 'item', amount }`）、`unlocked: false`）

---

## Phase 2：基礎建設（Foundational）

**目的**：核心層（EventBus、Timer）與模型層（Player、Animal、Building、Crop、Resource、Achievement）的 TDD 實作，以及 GameState / StorageService，為所有 User Story 提供可複用的共同基礎。

**⚠️ 關鍵**：此 Phase 完成前，任何 User Story 均無法開始實作。

### 2-A：核心層 TDD（Red → Green）

- [ ] T013 撰寫 `tests/unit/core/EventBus.test.js`（測試案例：`subscribe` 後 `publish` 觸發回呼、同事件多個訂閱者全部觸發、`unsubscribe` 後不再觸發、`publish` 傳遞 payload 物件正確）【RED — 確認測試失敗後再實作】
- [ ] T014 [P] 撰寫 `tests/unit/core/Timer.test.js`（測試案例：`tick(deltaTime)` 更新累計時間、`pause()` 暫停累計、`resume()` 恢復、`reset()` 清零、多個計時器獨立運作不互相影響）【RED】
- [x] T015 實作 `src/core/EventBus.js`（`class EventBus`：`subscribe(event, callback)`、`unsubscribe(event, callback)`、`publish(event, payload)`；使用 `Map<string, Set<Function>>` 儲存訂閱者；匯出單例 `export const eventBus = new EventBus()`）【GREEN — 確認 T013 測試全數通過】
- [x] T016 實作 `src/core/Timer.js`（`class Timer`：`constructor(interval, callback)`；`tick(deltaTime)` 累加並在超過 `interval` 時觸發 `callback` 並重置；`pause()`、`resume()`、`reset()`；使用 `Date.now()` 差值計算，不依賴 tick 計數以避免頁籤切換飄移）【GREEN — 確認 T014 測試全數通過】

### 2-B：模型層 TDD（Red → Green）

- [ ] T017 [P] 撰寫 `tests/unit/models/Player.test.js`（測試案例：初始金幣 200、`addCoins` / `deductCoins` 邊界（不允許負值）、`addToInventory` / `removeFromInventory` 正確增減、等級計算 `calculateLevel(experience)` 閾值正確、`toJSON` / `fromJSON` 序列化往返）【RED】
- [ ] T018 [P] 撰寫 `tests/unit/models/Animal.test.js`（測試案例：初始 `health=100`、`hunger=100`；`decreaseHunger(amount)` 正確減少；`health < 50` 時 `getState()` 回傳 `'hungry'`；`health < 20` 時回傳 `'starving'`；`isProductionReady(currentTime)` 依週期正確判斷；`toJSON` / `fromJSON` 往返）【RED】
- [ ] T019 [P] 撰寫 `tests/unit/models/Building.test.js`（測試案例：`addAnimal` 在未滿時成功/已滿時回傳錯誤；`removeAnimal` 正確移除；`upgrade()` 等級上限為 3；`getCapacity()` 依等級回傳正確容量；`toJSON` / `fromJSON` 往返）【RED】
- [ ] T020 [P] 撰寫 `tests/unit/models/Crop.test.js`（測試案例：初始 `growthStage=0`；`advanceGrowth(elapsed)` 依 `growthDuration/4` 推進階段；`isMature()` 在 `growthStage===4` 時回傳 `true`；`harvest()` 重置狀態；`toJSON` / `fromJSON` 往返）【RED】
- [ ] T021 [P] 撰寫 `tests/unit/models/Resource.test.js`（測試案例：`add(amount)` 正確累加；`remove(amount)` 在庫存充足時成功、不足時拋出錯誤；`getQuantity()` 正確；`toJSON` / `fromJSON` 往返）【RED】
- [ ] T022 [P] 撰寫 `tests/unit/models/Achievement.test.js`（測試案例：初始 `unlocked=false`、`progress=0`；`updateProgress(value)` 正確更新；`isUnlocked()` 在 `progress >= condition.target` 時回傳 `true`；已解鎖後 `unlock()` 不重複觸發；`toJSON` / `fromJSON` 往返）【RED】
- [x] T023 [P] 實作 `src/models/Player.js`（`class Player`：`coins`、`level`、`experience`、`inventory: Map<string, number>`；方法：`addCoins(n)`、`deductCoins(n)` — 不足時拋出 `InsufficientCoinsError`；`addToInventory(type, qty)`、`removeFromInventory(type, qty)`；`calculateLevel()`；靜態 `fromJSON(data)`；實例 `toJSON()`）【GREEN — T017 通過】
- [x] T024 [P] 實作 `src/models/Animal.js`（`class Animal`：`id`（`crypto.randomUUID()`）、`type`、`health`、`hunger`、`productionTimer`、`facilityId`、`lastFedAt`；方法：`decreaseHunger(amount)`、`increaseHealth(amount)`、`getState()` → `'healthy'|'hungry'|'starving'`；`isProductionReady(now)` → boolean；`resetProductionTimer(now)`；`toJSON()`；靜態 `fromJSON(data)`）【GREEN — T018 通過】
- [x] T025 [P] 實作 `src/models/Building.js`（`class Building`：`id`、`type`、`level`（1–3）、`animals: Animal[]`、`tilePosition: {row, col}`；方法：`addAnimal(animal)` — 已滿時拋出 `BuildingFullError`；`removeAnimal(animalId)`；`getCapacity()` — 查詢 `BUILDINGS[type][level].capacity`；`getProductionBonus()`；`upgrade()` — level ≤ 3 限制；`toJSON()`；靜態 `fromJSON(data)`）【GREEN — T019 通過】
- [x] T026 [P] 實作 `src/models/Crop.js`（`class Crop`：`id`、`type`、`growthStage`（0–4）、`plantedAt`（timestamp）、`tilePosition`；方法：`advanceGrowth(elapsedMs)` — 依 `CROPS[type].growthDuration/4` 計算階段；`isMature()`；`harvest()` — 重置 `growthStage=0`、`plantedAt=null`；`toJSON()`；靜態 `fromJSON(data)`）【GREEN — T020 通過】
- [x] T027 [P] 實作 `src/models/Resource.js`（`class Resource`：`type`、`quantity`；方法：`add(amount)`、`remove(amount)` — 不足時拋出 `InsufficientResourceError`；`getQuantity()`；`toJSON()`；靜態 `fromJSON(data)`）【GREEN — T021 通過】
- [x] T028 [P] 實作 `src/models/Achievement.js`（`class Achievement`：`id`、`name`、`description`、`condition`、`progress`、`unlocked`、`reward`；方法：`updateProgress(value)`；`isUnlocked()`；`unlock()` — 僅在未解鎖時執行（防重複）；`getReward()`；`toJSON()`；靜態 `fromJSON(data)`）【GREEN — T022 通過】

### 2-C：狀態與儲存服務 TDD（Red → Green）

- [ ] T029 撰寫 `tests/unit/services/StorageService.test.js`（測試案例：`save(state)` 正確序列化至 `localStorage['animal_farm_save']`；`load()` 正確反序列化並重建所有模型實例；存入版本欄位 `version: '1.0'`；`localStorage` 不可用時（模擬 SecurityError）不拋出且回傳 `null`；舊版本資料 `migrate(data)` 正確轉換）【RED】
- [x] T030 實作 `src/services/GameState.js`（匯出 `gameState` 單例：`player: Player`、`buildings: Map<string, Building>`、`crops: Map<string, Crop>`、`resources: Map<string, Resource>`、`achievements: Achievement[]`、`farmMap: Array<Array<Tile>>`（10×10）、`gameTime: number`；方法：`init()` — 建立初始玩家（`coins: 200`）、初始農場地圖；`update(partialState)` — 合併並發布 `'state:updated'` 事件至 `eventBus`）【GREEN】
- [x] T031 實作 `src/services/StorageService.js`（`class StorageService`：`STORAGE_KEY = 'animal_farm_save'`；`save(gameState)` — `try/catch` 保護、`JSON.stringify` 序列化、加入 `version: '1.0'`、`savedAt: Date.now()`；`load()` — 反序列化後以各 `Model.fromJSON()` 重建；`migrate(data)` — 版本差異升級骨架；`setupAutoSave(gameState, intervalMs = 3000)` — 使用 `setInterval` 定期儲存（SC-003：≤ 3 秒）；`clear()`）【GREEN — T029 通過】

**檢查點**：Phase 2 完成 → 所有核心/模型/儲存測試通過 → 可同時開啟 US1–US5 任何 Phase

---

## Phase 3：User Story 1 — 建立並管理農場（P1）🎯 MVP

**目標**：玩家可購買動物並放入設施、等待自動生產資源、收集並出售換取金幣，完成核心遊戲迴圈。

**獨立測試**：開啟 `index.html` → 以初始 200 金幣購買一隻雞（成本 50）→ 點擊農場地圖將雞放入雞舍 → 等待生產週期（測試模式快轉）→ 點擊收集雞蛋 → 開啟市場面板出售蛋 → 確認金幣數量增加 ✅

### 測試（Red）

- [ ] T032 [P] [US1] 撰寫 `tests/unit/services/ProductionService.test.js`（測試案例：`produce(animal, now)` 在生產計時器到期且 `health >= 20` 時回傳資源物件；`health < 20`（`starving`）時回傳 `null`；健康加成係數：`health 50–100` → `1.0`、`20–49` → `0.5`；多種動物同時觸發各自產出；`eventBus` 收到 `'resource:produced'` 事件）【RED】
- [ ] T033 [P] [US1] 撰寫 `tests/unit/services/MarketService.test.js`（測試案例：`sellResource(type, qty, player)` 正確增加金幣、減少庫存；金幣計算符合 `RESOURCES[type].sellPrice * qty`；`buyAnimal(type, player)` 金幣不足時拋出 `InsufficientCoinsError`；`buyBuilding(type, player)` 正確扣款並回傳新 `Building` 實例）【RED】
- [ ] T034 [US1] 撰寫 `tests/integration/us1-farm-management.test.js`（驗證三個 Acceptance Scenarios：①購買動物→金幣減少、動物出現在地圖；②等待生產週期→倉庫資源增加；③出售資源→資源減少、金幣增加，金額符合定價）【RED】

### 實作（Green）

- [x] T035 [US1] 實作 `src/services/ProductionService.js`（`class ProductionService`：`tick(animals, now, resources)` — 遍歷所有動物，呼叫 `animal.isProductionReady(now)` 檢查，依健康加成計算產出量，呼叫 `resource.add(amount)`，`animal.resetProductionTimer(now)`，並透過 `eventBus.publish('resource:produced', { animalId, type, amount })` 廣播；匯出單例 `productionService`）【GREEN — T032 通過】
- [x] T036 [US1] 實作 `src/services/MarketService.js`（`class MarketService`：`sellResource(resourceType, qty, player, resources)` — 計算金額、`resource.remove(qty)`、`player.addCoins(coins)`；`buyAnimal(animalType, player)` — 驗證金幣、`player.deductCoins(cost)`、回傳新 `Animal` 實例；`buyBuilding(buildingType, player)` — 同上，回傳新 `Building` 實例；`buyFeed(qty, player)` — 從 `CROPS` 設定取得飼料成本並扣款；匯出單例 `marketService`）【GREEN — T033 通過】
- [x] T037 [P] [US1] 實作 `src/ui/FarmMapRenderer.js`（`class FarmMapRenderer`：`constructor(containerId)`；`render(farmMap, buildings, animals, crops)` — 以 `document.createElement` 產生 CSS Grid 地圖，每個 `.tile` 元素帶資料屬性 `data-row` / `data-col`；`attachClickHandler(callback)` — 事件委派至地圖容器；`updateTile(row, col, tileData)` — 局部更新單一地塊 DOM（避免全圖重繪）；動物以 `<span class="animal-icon">` 文字符號顯示；訂閱 `eventBus` 的 `'state:updated'` 事件自動重繪）
- [x] T038 [P] [US1] 實作 `src/ui/HUDRenderer.js`（`class HUDRenderer`：`constructor(containerId)`；`render(player, resources)` — 更新 `.hud__coins` 金幣數字、`.hud__level` 等級、倉庫各資源圖示與數量；訂閱 `eventBus` 的 `'state:updated'` 事件自動更新；金幣增加/減少時觸發 CSS 動畫高亮提示）
- [x] T039 [US1] 實作 `src/ui/ShopPanel.js`（`class ShopPanel`：以 `ANIMALS`、`BUILDINGS` 設定動態產生商品列表；每項顯示名稱（繁中）、成本、圖示；金幣不足時按鈕 `disabled` 並顯示提示文字；點擊購買呼叫 `marketService.buyAnimal` / `marketService.buyBuilding`，並透過 `eventBus` 發布 `'shop:purchase'` 事件；包含飼料購買標籤頁）
- [x] T040 [US1] 實作 `src/ui/MarketPanel.js`（`class MarketPanel`：以 `RESOURCES` 設定列出各資源的現有庫存與收購單價；「全部出售」按鈕逐一呼叫 `marketService.sellResource`；顯示出售後的預期金幣收入；出售後觸發 HUD 更新；庫存為零時自動隱藏對應列）
- [x] T041 [US1] 更新 `index.html`（加入農場地圖容器 `<div id="farm-map">`、HUD 列 `<header id="hud">`、商店按鈕與側邊面板 `<aside id="shop-panel">`、市場按鈕與側邊面板 `<aside id="market-panel">`；以 `<script type="module">` 依序載入：`config/` → `models/` → `services/` → `ui/` → `GameEngine.js`；初始化各 Renderer 並掛載至 DOM）

**檢查點**：US1 可獨立運作 — 購買動物→等待生產→收集資源→出售換幣完整流程，T034 整合測試全數通過 ✅

---

## Phase 4：User Story 2 — 飼養與照顧動物（P2）

**目標**：動物需定期餵食維持健康值；未餵食則健康下降、產出效率降低；飼料不足時提示玩家。

**獨立測試**：購買動物後停止餵食（模擬時間推進）→ 觀察農場地圖健康條變紅 → 確認資源產出量下降 → 點擊餵食按鈕 → 確認健康值回升 → 確認產出恢復正常效率 ✅

### 測試（Red）

- [ ] T042 [P] [US2] 撰寫 `tests/unit/services/FeedingService.test.js`（測試案例：`feed(animal, feedAmount, inventory)` 在庫存充足時增加 `health`，減少庫存飼料；飼料不足（`qty < feedAmount`）時拋出 `InsufficientFeedError` 並發布 `'feed:insufficient'` 事件；`autoDecayHunger(animals, deltaTime)` 依時間差降低所有動物 `hunger`；`hunger` 歸零後 `health` 開始下降；餵食後 `lastFedAt` 更新）【RED】
- [ ] T043 [P] [US2] 撰寫 `tests/integration/us2-animal-care.test.js`（驗證三個 Acceptance Scenarios：①未餵食超過閾值→健康下降、產出效率降低；②使用飼料餵食→健康回升、效率恢復；③飼料不足→提示引導購買）【RED】

### 實作（Green）

- [x] T044 [US2] 實作 `src/services/FeedingService.js`（`class FeedingService`：`feed(animal, feedType, qty, player)` — 從庫存扣除飼料、`animal.increaseHealth(amount)` 依飼料數量計算回復量；`autoDecayHunger(animals, deltaTimeMs)` — 依設定速率降低 `hunger`，`hunger=0` 後開始降低 `health`；`checkAllAnimals(animals)` — 遍歷動物發布 `'animal:hungry'` / `'animal:starving'` 警告事件；匯出單例 `feedingService`）【GREEN — T042 通過】
- [x] T045 [US2] 更新 `src/ui/FarmMapRenderer.js`（在動物圖示下方加入 `<div class="health-bar">` 血條，顏色依健康值變化：`≥50 → 綠`、`20–49 → 黃`、`<20 → 紅`；地塊顯示 `hungry` CSS class；點擊動物地塊顯示餵食按鈕 Tooltip；訂閱 `'animal:hungry'` 事件閃爍提示）
- [x] T046 [US2] 更新 `src/ui/HUDRenderer.js`（加入飼料庫存圖示與數量顯示；飼料 `< 5` 份時顯示低量警告 `⚠️`；訂閱 `'feed:insufficient'` 事件觸發 Toast 通知「飼料不足，請前往商店購買！」）
- [x] T047 [US2] 更新 `src/ui/ShopPanel.js`（完善飼料購買標籤頁：顯示三種飼料（小麥飼料/玉米飼料/胡蘿蔔飼料）的單位重量、金幣價格、目前庫存；「快速補充」按鈕一次購買 10 份；金幣不足時 `disabled`）
- [x] T048 [US2] 更新 `src/core/GameEngine.js`（在 `tick(deltaTime)` 中加入 `feedingService.autoDecayHunger(animals, deltaTime)` 呼叫；確保 `FeedingService` 在 `ProductionService` 前執行（先更新健康，再計算產出加成））

**檢查點**：US2 可獨立驗證，US1 農場管理核心流程不受影響 ✅

---

## Phase 5：User Story 3 — 農場升級與擴展（P3）

**目標**：玩家累積金幣後可升級現有設施（提高容量與效率）、購買新土地擴大農場，並解鎖新動物種類。

**獨立測試**：積累足夠金幣 → 點擊設施「升級」→ 確認容量增加且舊動物仍在 → 購買新土地 → 確認地圖可用地塊增加 → 農場等級達標後牛/豬可從商店購買 ✅

### 測試（Red）

- [ ] T049 [P] [US3] 撰寫 `tests/unit/services/UpgradeService.test.js`（測試案例：`upgradeBuilding(building, player)` 金幣充足時升級成功、等級+1、費用正確扣除；等級已達 3 時拋出 `MaxLevelError`；金幣不足時拋出 `InsufficientCoinsError`；`unlockLand(tilePos, player)` 解鎖新地塊並扣除費用；發布 `'building:upgraded'` / `'land:unlocked'` 事件）【RED】
- [ ] T050 [P] [US3] 撰寫 `tests/integration/us3-farm-expansion.test.js`（驗證三個 Acceptance Scenarios：①等級達標→新動物在商店可購買；②升級設施→容量增加；③購買新土地→可用區域擴大）【RED】

### 實作（Green）

- [x] T051 [US3] 實作 `src/services/UpgradeService.js`（`class UpgradeService`：`upgradeBuilding(building, player)` — 查詢 `BUILDINGS[type][level+1].upgradeCost`、驗證金幣、`player.deductCoins()`、`building.upgrade()`、發布 `'building:upgraded'` 事件；`unlockLand(row, col, player)` — 驗證地塊可解鎖且玩家等級達標、扣除費用、解鎖 `farmMap[row][col]`、發布 `'land:unlocked'` 事件；`canUpgrade(building, player)` — 回傳可升級性布林值與原因；匯出單例 `upgradeService`）【GREEN — T049 通過】
- [x] T052 [US3] 更新 `src/ui/FarmMapRenderer.js`（已鎖定地塊 `.tile--locked` 顯示「🔒 X 金幣」解鎖按鈕；點擊後呼叫 `upgradeService.unlockLand`；解鎖動畫 `@keyframes unlockReveal`；設施地塊右上角加入「⬆ 升級」小按鈕，當 `upgradeService.canUpgrade` 回傳 `true` 時啟用）
- [x] T053 [US3] 更新 `src/ui/ShopPanel.js`（加入「升級設施」標籤頁：列出所有已建設施的目前等級、下一級費用與效益說明；已滿等級顯示「✅ 已達上限」；新動物（牛/豬/羊/兔）標示等級解鎖條件，未達標時顯示灰色並說明解鎖需求）
- [x] T054 [US3] 更新 `src/config/animals.js`（完善 `unlockLevel` 欄位：雞 `1`、兔 `2`、羊 `3`、豬 `4`、牛 `5`；確保 `ShopPanel` 依 `player.level` 動態顯示可購買動物清單）
- [x] T055 [US3] 更新 `src/config/buildings.js`（補齊三個等級的 `capacity` 與 `productionBonus` 數值：Lv1 容量 2/效率 1.0、Lv2 容量 4/效率 1.2、Lv3 容量 6/效率 1.5；`upgradeCost` Lv1→2 為 150 金幣、Lv2→3 為 300 金幣）

**檢查點**：US3 可獨立驗證，農場規模擴展完整流程測試通過 ✅

---

## Phase 6：User Story 4 — 作物種植與飼料生產（P4）

**目標**：玩家可在農地種植小麥、玉米、胡蘿蔔；作物經歷 4 個成長階段後收穫，可用作飼料或出售。

**獨立測試**：選取空農地 → 點擊「種植小麥」→ 觀察地塊顯示成長階段進度 → 等待成熟（或快轉）→ 點擊收穫 → 確認飼料庫存增加 → 透過市場出售部分收穫 → 確認金幣增加 ✅

### 測試（Red）

- [ ] T056 [P] [US4] 撰寫 `tests/unit/services/CropService.test.js`（測試案例：`plant(cropType, tilePos, player)` 扣除種子成本、回傳新 `Crop` 實例；`tick(crops, deltaTime)` 正確推進所有作物成長階段；`harvest(crop, player)` 在成熟時增加庫存、重置地塊；未成熟時 `harvest` 拋出 `NotMatureError`；`sellCrop(cropType, qty, player)` 正確換算金幣）【RED】
- [ ] T057 [P] [US4] 撰寫 `tests/integration/us4-crop-planting.test.js`（驗證三個 Acceptance Scenarios：①種植→土地顯示進度、種子扣除；②成長完成→收穫→庫存增加、地塊重置；③出售收穫物→金幣增加）【RED】

### 實作（Green）

- [x] T058 [US4] 實作 `src/services/CropService.js`（`class CropService`：`plant(cropType, row, col, player)` — 驗證地塊空置且可耕種、從玩家庫存扣除種子（或扣金幣購種）、建立 `new Crop({ type, tilePosition: {row,col}, plantedAt: Date.now() })`、發布 `'crop:planted'` 事件；`tick(crops, deltaTimeMs)` — 遍歷所有作物呼叫 `crop.advanceGrowth(deltaTime)`；`harvest(crop, player)` — 驗證成熟、加入玩家飼料庫存（`player.addToInventory`）、`crop.harvest()`、發布 `'crop:harvested'` 事件；`sellCrop(cropType, qty, player)` — 呼叫 `marketService.sellResource`；匯出單例 `cropService`）【GREEN — T056 通過】
- [x] T059 [US4] 更新 `src/ui/FarmMapRenderer.js`（作物地塊依 `growthStage` 顯示不同圖示：🌱→🌿→🌾→🌽/🥕（依作物類型）；成熟作物顯示閃爍動畫；點擊成熟地塊觸發 `cropService.harvest`；可種植空地滑鼠移入顯示「＋ 種植」提示）
- [x] T060 [US4] 更新 `src/ui/ShopPanel.js`（加入「種子」標籤頁：列出三種作物的種子購買選項，顯示名稱（繁中）、種子成本、成長週期、收穫產量、飼料轉換率；庫存顯示已持有種子數量）
- [x] T061 [US4] 更新 `src/core/GameEngine.js`（在 `tick(deltaTime)` 中加入 `cropService.tick(crops, deltaTime)` 呼叫，置於 `ProductionService` 之後）
- [x] T062 [US4] 更新 `src/ui/MarketPanel.js`（加入「農產品」標籤頁：列出庫存中已收穫的作物與收購單價；支援「全部出售」與數量輸入出售；出售後更新 HUD 金幣顯示）

**檢查點**：US4 可獨立驗證，種植→成長→收穫→使用/出售完整流程測試通過 ✅

---

## Phase 7：User Story 5 — 玩家進度與成就系統（P5）

**目標**：追蹤玩家等級/累計資產/動物數量，達成里程碑時顯示成就通知並自動發放獎勵，提供長期遊戲目標。

**獨立測試**：完成首次收集 100 顆蛋 → 確認 Toast 通知「🏆 成就解鎖：蛋農初體驗！」顯示 → 確認金幣獎勵自動加入 → 開啟成就面板確認該項目為已解鎖狀態 ✅

### 測試（Red）

- [ ] T063 [P] [US5] 撰寫 `tests/unit/services/AchievementService.test.js`（測試案例：`checkAll(gameState)` 在達成條件時呼叫 `achievement.unlock()` 並發布 `'achievement:unlocked'` 事件；獎勵自動發放（`player.addCoins(reward.amount)`）；已解鎖成就不重複觸發；`getProgress(achievementId, gameState)` 正確回傳當前進度 / 目標值）【RED】
- [ ] T064 [P] [US5] 撰寫 `tests/integration/us5-achievements.test.js`（驗證三個 Acceptance Scenarios：①達成條件→成就解鎖提示＋獎勵；②開啟成就頁→完整清單含進度；③農場規模達標→玩家等級提升＋新內容解鎖）【RED】

### 實作（Green）

- [x] T065 [US5] 實作 `src/services/AchievementService.js`（`class AchievementService`：`checkAll(gameState)` — 遍歷 `ACHIEVEMENTS`，依 `condition.type` 分支判斷（`resourceCollected`、`animalCount`、`level`、`coinsEarned`）；`updateProgress(achievement, gameState)` 更新進度；`unlockAchievement(achievement, player)` — 呼叫 `achievement.unlock()`、依 `reward.type` 發放獎勵（金幣：`player.addCoins`、道具：`player.addToInventory`）、發布 `'achievement:unlocked'` 事件；`getProgress(id, gameState)` → `{ current, target, percentage }`；匯出單例 `achievementService`）【GREEN — T063 通過】
- [x] T066 [US5] 實作 `src/ui/NotificationSystem.js`（`class NotificationSystem`：`show(message, type: 'achievement'|'warning'|'info', duration = 3000)` — 建立 `.toast` DOM 元素、加入 `.notification-container`、觸發 `slideUp` CSS 動畫、`duration` 後自動移除；訂閱 `eventBus` 的 `'achievement:unlocked'` 事件自動顯示成就通知（含獎勵說明）；訂閱 `'feed:insufficient'`、`'animal:starving'` 發出警告 Toast；單例模式）
- [x] T067 [US5] 實作 `src/ui/AchievementPanel.js`（`class AchievementPanel`：`render(achievements, gameState)` — 動態產生成就清單：已解鎖顯示 `🏆 + 名稱 + 解鎖日期`（繁中格式）、未解鎖顯示進度條 `progress / target`；依「已解鎖 / 未解鎖」分組顯示；訂閱 `'achievement:unlocked'` 事件即時更新面板（若已開啟））
- [x] T068 [US5] 更新 `src/services/GameState.js`（加入 `totalResourcesCollected: Map<string, number>` 累計統計；加入 `totalCoinsEarned: number`；每次 `resource:produced` / `resource:sold` 事件時更新統計；加入 `addExperience(amount)` 方法在每次操作後給予經驗值並觸發等級檢查）
- [x] T069 [US5] 更新 `src/core/GameEngine.js`（在 `tick(deltaTime)` 末尾加入 `achievementService.checkAll(gameState)` 呼叫；確保每次 tick 後 `storageService.autoSave()` 觸發條件正確）

**檢查點**：US5 可獨立驗證，成就覆蓋所有主要玩法，T064 整合測試通過 ✅

---

## Phase 8：整合、教學引導與收尾（Polish）

**目的**：完成 GameEngine 主迴圈整合、新手引導流程、效能調校、行動裝置響應式、離線狀態處理與最終驗收。

- [x] T070 完整實作 `src/core/GameEngine.js` 主迴圈（`class GameEngine`：`start()` — 使用 `requestAnimationFrame` 主迴圈，計算 `deltaTime = now - lastTime`；`tick(deltaTime)` 依序呼叫：`feedingService.autoDecayHunger` → `productionService.tick` → `cropService.tick` → `achievementService.checkAll`；`pause()` / `resume()` 切換標誌；`save()` 手動觸發 `storageService.save`；`load()` 從 `localStorage` 重建 `gameState`；處理頁面 `visibilitychange` 事件暫停遊戲；目標 60 FPS，SC-002 響應 ≤ 1 秒）
- [ ] T071 實作 `src/ui/TutorialFlow.js`（`class TutorialFlow`：`shouldShow(player)` — 首次遊玩（無存檔）時觸發；步驟 1–5 序列引導：①歡迎說明 → ②點擊商店購買雞 → ③點擊農場放置雞舍 → ④等待並點擊收集雞蛋 → ⑤開啟市場出售並查看金幣增加；每步以 `.tutorial-highlight` CSS class 高亮目標 UI 元素；完成後記錄 `player.tutorialCompleted = true`；SC-001：5 分鐘內完成引導）
- [ ] T072 更新 `index.html` 完整整合所有 UI 元件（加入成就按鈕 `<button id="achievement-btn">🏆</button>`；成就面板 `<aside id="achievement-panel">`；教學引導覆蓋層 `<div id="tutorial-overlay">`；確認所有 `<script>` 載入順序正確：`config → models → services → core → ui`；加入 `<noscript>` 提示）
- [ ] T073 [P] 效能調校 `css/farm-map.css`（為 `.tile` 加入 `contain: layout style`；動畫元素使用 `will-change: transform`、`transform: translateZ(0)` 啟用 GPU 合成層；驗證 Chrome DevTools Performance 面板達 60 FPS；`transition` 縮短至 ≤ 150ms）
- [ ] T074 [P] 效能調校 `src/ui/FarmMapRenderer.js`（改為局部更新：僅呼叫 `updateTile(row, col)` 替換單一地塊 DOM，避免整棵地圖重繪；使用 `DocumentFragment` 批次插入初始地圖；實測 10×10 地圖首次渲染 ≤ 100ms）
- [ ] T075 實作離線時間追趕邏輯於 `src/core/GameEngine.js` 的 `load()` 方法（讀取 `savedAt` 與 `Date.now()` 差值 `offlineMs`；呼叫 `productionService.tickOffline(animals, offlineMs)`、`cropService.tickOffline(crops, offlineMs)` 按比例快轉離線期間的資源產出與作物成長；顯示 Toast「歡迎回來！離線期間農場自動運作了 X 分鐘」）
- [ ] T076 [P] 行動裝置響應式調校（更新 `css/main.css`：`@media (max-width: 768px)` 將農場地圖縮為 8×8 / 字型放大；更新 `css/ui.css`：面板改為底部抽屜樣式、按鈕高度 ≥ 44px；測試 375px（iPhone SE）與 428px（iPhone 14 Pro Max）寬度）
- [ ] T077 [P] 撰寫 `specs/001-animal-farm-game/quickstart.md`（說明：①本機開啟遊戲直接以瀏覽器開啟 `index.html`；②執行測試開啟 `tests/test-runner.html`；③重置存檔方式（清除 `localStorage['animal_farm_save']`）；④開發技巧（使用 VS Code Live Server 避免 `file://` CORS 限制））
- [ ] T078 [P] 更新 `README.md`（加入遊戲截圖區、操作說明、5 種動物與 3 種作物介紹、技術架構簡介、快速開始與測試說明連結至 `quickstart.md`）
- [ ] T079 執行全套測試驗證（開啟 `tests/test-runner.html` 確認所有單元測試（T013–T028、T029–T031、T032–T033、T042、T049、T056、T063）與整合測試（T034、T043、T050、T057、T064）全數通過；記錄測試總數與通過率）
- [ ] T080 最終驗收（依 `spec.md` SC-001–SC-007 逐項人工驗證：①新手 5 分鐘引導 ✓；②畫面響應 ≤ 1 秒 ✓；③儲存 ≤ 3 秒 ✓；④30 分鐘體驗 3 種動物 ✓；⑤1 小時解鎖 2 種動物或升級 ✓；⑥30 分鐘解鎖 1 項成就 ✓；⑦無需說明理解基本操作 ✓）

---

## 依賴關係與執行順序

### Phase 依賴圖

```
Phase 1（設置）
    ↓
Phase 2（基礎建設）⚠️ 阻塞所有 User Story
    ├──→ Phase 3（US1 P1）🎯 MVP
    ├──→ Phase 4（US2 P2）← 依賴 Phase 3 的 FeedingService 整合
    ├──→ Phase 5（US3 P3）← 依賴 Phase 3 的設施模型
    ├──→ Phase 6（US4 P4）← 依賴 Phase 3 的市場服務
    └──→ Phase 7（US5 P5）← 依賴 Phase 3–6 的 GameState 統計
         ↓
     Phase 8（整合收尾）
```

### User Story 依賴關係

| User Story | 依賴 Phase | 可與誰平行 | 優先順序 |
|---|---|---|---|
| US1（農場管理）| Phase 2 完成 | 無（P1 優先獨立完成） | 🎯 最高 |
| US2（動物照顧）| Phase 2 + US1 ProductionService | 可與 US3/US4 平行 | P2 |
| US3（升級擴展）| Phase 2 完成 | 可與 US2/US4 平行 | P3 |
| US4（作物種植）| Phase 2 完成 | 可與 US2/US3 平行 | P4 |
| US5（成就系統）| Phase 2 + GameState 統計 | 無（依賴所有統計） | P5 |

### 各 User Story 內部依賴

```
RED 測試（必須先失敗）
    ↓
Config 設定（T008–T012）
    ↓
Models（T023–T028，可平行）
    ↓
Services（依賴對應 Models）
    ↓
UI Renderers（依賴 Services）
    ↓
GameEngine 整合（依賴所有 Services）
    ↓
整合測試通過（GREEN）
```

---

## 平行執行範例

### Phase 2 可平行執行的任務

```bash
# 同時啟動（不同檔案，無依賴）：
任務：撰寫 tests/unit/models/Player.test.js    # T017
任務：撰寫 tests/unit/models/Animal.test.js    # T018
任務：撰寫 tests/unit/models/Building.test.js  # T019
任務：撰寫 tests/unit/models/Crop.test.js      # T020
任務：撰寫 tests/unit/models/Resource.test.js  # T021
任務：撰寫 tests/unit/models/Achievement.test.js # T022

# 測試撰寫完成後，同時實作（T017–T022 通過後）：
任務：實作 src/models/Player.js      # T023
任務：實作 src/models/Animal.js      # T024
任務：實作 src/models/Building.js    # T025
任務：實作 src/models/Crop.js        # T026
任務：實作 src/models/Resource.js    # T027
任務：實作 src/models/Achievement.js # T028
```

### Phase 3（US1）可平行執行的任務

```bash
# 測試撰寫（全部 RED 後一起）：
任務：撰寫 tests/unit/services/ProductionService.test.js  # T032
任務：撰寫 tests/unit/services/MarketService.test.js      # T033

# UI Renderers（服務完成後可平行）：
任務：實作 src/ui/FarmMapRenderer.js  # T037
任務：實作 src/ui/HUDRenderer.js      # T038
```

### Phase 2 完成後可平行的 User Stories（多人團隊）

```bash
開發者 A：Phase 3（US1 MVP）
開發者 B：Phase 5（US3 升級擴展）
開發者 C：Phase 6（US4 作物種植）
→ US2（T042–T048）等 US1 ProductionService 完成後開始
→ US5（T063–T069）等所有 US 統計欄位確認後開始
```

---

## 實作策略

### MVP 優先（僅 User Story 1）

1. 完成 **Phase 1**（設置）
2. 完成 **Phase 2**（基礎建設）— **關鍵阻塞，不可跳過**
3. 完成 **Phase 3**（US1）— 購買→生產→出售完整迴圈
4. **停下來驗證**：開啟 `index.html`，手動完成一次資源收集與出售
5. 若 MVP 達標 → 部署 GitHub Pages → 繼續後續 Phase

### 增量交付

| 里程碑 | 包含 | 可展示功能 |
|---|---|---|
| MVP | Phase 1–3 | 購買動物、自動產出、收集出售資源 |
| v0.2 | + Phase 4 | 動物照顧、健康系統、飼料管理 |
| v0.3 | + Phase 5 | 升級設施、解鎖新動物、購買土地 |
| v0.4 | + Phase 6 | 種植作物、飼料自給自足 |
| v1.0 | + Phase 7–8 | 成就系統、教學引導、效能收尾 |

### TDD 節奏（每個 Phase 嚴格遵守）

```
1. 撰寫測試（確認紅燈 RED — 測試失敗）
2. 最小實作通過測試（綠燈 GREEN）
3. 重構優化（Refactor）
4. Commit：`test(scope): add red tests for [unit]`
         `feat(scope): implement [unit] - all tests green`
         `refactor(scope): cleanup [unit]`
```

---

## 任務統計

| Phase | 任務數 | 可平行任務 |
|---|---|---|
| Phase 1（設置） | 12 | 10（T003–T012） |
| Phase 2（基礎建設） | 19 | 14（T014, T017–T028） |
| Phase 3（US1 MVP） | 10 | 5（T032–T033, T037–T038） |
| Phase 4（US2） | 7 | 2（T042–T043） |
| Phase 5（US3） | 7 | 2（T049–T050） |
| Phase 6（US4） | 7 | 2（T056–T057） |
| Phase 7（US5） | 7 | 2（T063–T064） |
| Phase 8（收尾） | 11 | 4（T073–T074, T076–T078） |
| **合計** | **80** | **41（51%）** |

### 各 User Story 任務數

| User Story | 測試任務 | 實作任務 | 合計 |
|---|---|---|---|
| US1（農場管理） | 3（T032–T034） | 7（T035–T041） | **10** |
| US2（動物照顧） | 2（T042–T043） | 5（T044–T048） | **7** |
| US3（升級擴展） | 2（T049–T050） | 5（T051–T055） | **7** |
| US4（作物種植） | 2（T056–T057） | 5（T058–T062） | **7** |
| US5（成就系統） | 2（T063–T064） | 5（T065–T069） | **7** |

---

## 備註

- **[P]** 任務 = 操作不同檔案且無未完成任務的依賴，可安全平行執行
- **[USx]** 標籤 = 任務歸屬對應的 User Story，確保可追溯性
- TDD 原則不可妥協：測試必須先撰寫並確認失敗（RED），才能開始實作
- 每個 Checkpoint 應停下來手動驗證，再進入下一 Phase
- 所有 `commit` 訊息遵循 `type(scope): description` 格式（`test`、`feat`、`refactor`、`style`、`docs`）
- `localStorage` 金鑰統一使用 `animal_farm_save`（StorageService 常數）
- 遊戲時間為即時制，離線期間依 `Date.now()` 差值推進（Phase 8 T075 處理）
- 不引入任何建置工具（無 npm、Webpack、Vite）— 純瀏覽器可直接開啟
