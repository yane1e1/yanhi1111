# 實作計畫：動物農場遊戲 (Animal Farm Game)

**分支**：`001-animal-farm-game` | **日期**：2026-03-13 | **規格**：[spec.md](./spec.md)  
**輸入**：功能規格文件 `/specs/001-animal-farm-game/spec.md`

---

## 摘要

以純靜態前端（HTML5 / CSS3 / JavaScript ES6+）實作一款瀏覽器動物農場模擬遊戲，可直接部署至 GitHub Pages。玩家在二維農場地圖上購買並照料 5 種動物（雞、牛、豬、羊、兔）、種植 3 種作物（小麥、玉米、胡蘿蔔）、升級設施並累積成就；所有進度以 `localStorage` 自動儲存，無須後端服務。

---

## 技術背景

| 項目 | 決策 |
|------|------|
| **語言／版本** | HTML5、CSS3、JavaScript ES6+（原生，無轉譯） |
| **主要依賴** | 無後端框架；視覺輔助使用 CSS Grid / Flexbox；測試使用 Jest 27（CDN 載入） |
| **儲存方案** | `localStorage`（自動儲存，FR-013） |
| **測試工具** | Jest 27（`<script>` CDN 引入）+ `jest-environment-jsdom` 模擬瀏覽器 DOM |
| **目標平台** | 現代桌面 / 行動瀏覽器（Chrome 90+、Firefox 88+、Safari 14+） |
| **專案類型** | 純靜態網頁應用（Web Application，單頁） |
| **效能目標** | 畫面響應 ≤ 1 秒（SC-002）；儲存完成 ≤ 3 秒（SC-003）；目標 60 FPS 動畫 |
| **限制條件** | 無伺服器、無建置流程、無 npm、可離線執行、GitHub Pages 可部署 |
| **規模範圍** | 單人遊戲；5 種動物、3 種作物、10+ 項成就；農場地圖最大 10×10 格 |

---

## 憲法合規檢查

> **關卡：Phase 0 研究開始前必須全部通過；Phase 1 設計完成後重新確認。**

### 原則 I — 繁體中文優先 ✅

- 所有規格文件（spec.md、plan.md、tasks.md）以繁體中文撰寫。
- 程式碼識別字（變數名、函數名、類別名）使用英文。
- 行內注釋可混用繁中與英文，以清晰為準。

### 原則 II — 精簡設計（YAGNI / KISS） ✅

- 僅實作 spec.md 明確要求的功能，不預先加入多人模式、雲端同步或動態定價。
- 動物種類上限固定為 5 種（FR-002），作物 3 種（FR-009），不擴充。
- 錯誤處理僅限 `localStorage` 讀寫、使用者輸入邊界（如金幣不足、設施已滿）。
- 不引入多餘的設計模式（如 Redux 狀態管理、ORM 層）。

### 原則 III — 測試驅動開發（TDD，NON-NEGOTIABLE） ✅

- 每個實作單元先寫測試（Red），再實作（Green），再重構（Refactor）。
- 測試涵蓋所有 User Story 的 Acceptance Scenarios（US1–US5）。
- 以 Jest CDN 在獨立 `tests/` 目錄維護測試套件；未通過測試的程式碼不得合併。

### 原則 IV — 前端靜態網站優先 ✅

- 最終產出為靜態 HTML / CSS / JS，直接可部署至 GitHub Pages。
- 不引入 Node.js 伺服器、Express、Next.js 或任何後端框架。
- 第三方依賴（Jest CDN）僅限 `<script>` 標籤引入，無 npm 建置流程。

### 原則 V — Git 嚴格版本控制 ✅

- 每個開發階段（setup → red tests → green → refactor）各自提交獨立 commit。
- Commit message 遵守 `type(scope): description` 格式。
- 不使用 `--force`、`--no-verify`；合併前確認所有測試通過。

**→ 所有原則通過，無複雜度違規，無需填寫 Complexity Tracking。**

---

## 專案結構

### 文件（本功能）

```text
specs/001-animal-farm-game/
├── spec.md              # 功能規格（已完成）
├── plan.md              # 本文件（/speckit.plan 輸出）
├── research.md          # Phase 0 研究結果（/speckit.plan 輸出）
├── data-model.md        # Phase 1 資料模型（/speckit.plan 輸出）
├── quickstart.md        # Phase 1 快速入門指南（/speckit.plan 輸出）
├── contracts/           # Phase 1 介面契約（/speckit.plan 輸出）
│   ├── game-engine-api.md     # 遊戲引擎公開 API 契約
│   ├── storage-schema.md      # localStorage 資料結構契約
│   └── events.md              # 遊戲事件（自訂事件系統）契約
└── tasks.md             # Phase 2 任務清單（/speckit.tasks 輸出，本指令不建立）
```

### 原始碼（儲存庫根目錄）

```text
/（儲存庫根目錄）
├── index.html                  # 遊戲進入點，載入所有靜態資源
│
├── css/
│   ├── main.css                # 全域樣式、CSS 變數、版面
│   ├── farm-map.css            # 農場地圖格線與地塊樣式
│   ├── ui.css                  # HUD（金幣、等級、倉庫）、對話框
│   └── animations.css          # 動物動畫、收穫特效、成就通知
│
├── src/
│   ├── core/
│   │   ├── GameEngine.js       # 遊戲主迴圈（requestAnimationFrame / setInterval tick）
│   │   ├── EventBus.js         # 輕量事件匯流排（publish / subscribe）
│   │   └── Timer.js            # 即時週期計時器（生產、成長、餵食倒數）
│   │
│   ├── models/
│   │   ├── Player.js           # 玩家：金幣、等級、成就狀態
│   │   ├── Animal.js           # 動物：種類、健康值、飽食度、生產週期
│   │   ├── Building.js         # 設施：種類、等級、容量、內含動物清單
│   │   ├── Crop.js             # 作物：種類、成長階段、收穫時間
│   │   ├── Resource.js         # 資源：種類、數量、市場售價
│   │   └── Achievement.js      # 成就：條件、進度、獎勵、是否解鎖
│   │
│   ├── services/
│   │   ├── GameState.js        # 集中狀態物件（唯一真實來源）
│   │   ├── StorageService.js   # localStorage 序列化／反序列化、自動存檔
│   │   ├── ProductionService.js# 動物資源產出邏輯（週期計算、健康修正）
│   │   ├── FeedingService.js   # 餵食邏輯、健康值計算、飼料扣減
│   │   ├── CropService.js      # 作物種植、成長推進、收穫處理
│   │   ├── MarketService.js    # 資源買賣、固定定價表
│   │   ├── UpgradeService.js   # 設施升級條件驗證與執行
│   │   └── AchievementService.js # 成就條件偵測與獎勵發放
│   │
│   ├── ui/
│   │   ├── FarmMapRenderer.js  # 農場地圖 DOM 渲染（CSS Grid）
│   │   ├── HUDRenderer.js      # 金幣、等級、倉庫資訊列渲染
│   │   ├── ShopPanel.js        # 商店面板（購買動物、種子、升級）
│   │   ├── MarketPanel.js      # 市場面板（出售資源、查看價格）
│   │   ├── AchievementPanel.js # 成就清單面板
│   │   ├── NotificationSystem.js # 成就解鎖、警告提示（Toast）
│   │   └── TutorialFlow.js     # 首次遊戲引導流程（SC-001）
│   │
│   └── config/
│       ├── animals.js          # 動物種類定義（成本、產出、週期、健康閾值）
│       ├── buildings.js        # 設施種類定義（容量、升級費用、效率加成）
│       ├── crops.js            # 作物種類定義（成長時間、飼料轉換率、售價）
│       ├── resources.js        # 資源種類定義（名稱、市場收購價）
│       └── achievements.js     # 成就清單定義（條件、獎勵類型、獎勵數量）
│
└── tests/
    ├── test-runner.html        # 瀏覽器端 Jest 測試執行入口
    ├── unit/
    │   ├── models/
    │   │   ├── Animal.test.js
    │   │   ├── Building.test.js
    │   │   ├── Crop.test.js
    │   │   └── Player.test.js
    │   └── services/
    │       ├── ProductionService.test.js
    │       ├── FeedingService.test.js
    │       ├── CropService.test.js
    │       ├── MarketService.test.js
    │       ├── UpgradeService.test.js
    │       ├── StorageService.test.js
    │       └── AchievementService.test.js
    └── integration/
        ├── us1-farm-management.test.js   # US1：建立並管理農場
        ├── us2-animal-care.test.js        # US2：飼養與照顧動物
        ├── us3-farm-expansion.test.js     # US3：農場升級與擴展
        ├── us4-crop-planting.test.js      # US4：作物種植與飼料生產
        └── us5-achievements.test.js       # US5：玩家進度與成就系統
```

**結構決策**：採用單一靜態網頁應用結構，所有原始碼置於儲存庫根目錄（`index.html`、`src/`、`css/`、`tests/`），符合 GitHub Pages 直接托管需求，無需建置流程。

---

## 架構概覽

### 分層架構圖

```
┌─────────────────────────────────────────────────────────┐
│                    index.html（進入點）                   │
├─────────────────────────────────────────────────────────┤
│                   UI 層（ui/*.js）                        │
│  FarmMapRenderer  HUDRenderer  ShopPanel  MarketPanel   │
│  AchievementPanel  NotificationSystem  TutorialFlow     │
├─────────────────────────────────────────────────────────┤
│                服務層（services/*.js）                    │
│  GameState（唯一真實來源）  ←→  EventBus（事件匯流排）    │
│  ProductionService  FeedingService  CropService         │
│  MarketService  UpgradeService  AchievementService      │
│  StorageService（localStorage 讀寫）                     │
├─────────────────────────────────────────────────────────┤
│                模型層（models/*.js）                      │
│  Player  Animal  Building  Crop  Resource  Achievement  │
├─────────────────────────────────────────────────────────┤
│                核心層（core/*.js）                        │
│  GameEngine（主迴圈）  Timer（週期計時）  EventBus       │
├─────────────────────────────────────────────────────────┤
│                設定層（config/*.js）                      │
│  animals  buildings  crops  resources  achievements     │
└─────────────────────────────────────────────────────────┘
         ↓ 持久化                        ↑ 復原
    localStorage（JSON 序列化）
```

### 核心資料流

```
玩家操作（點擊）
    ↓
UI 層：處理 DOM 事件，呼叫對應 Service
    ↓
Service 層：更新 GameState，透過 EventBus 發布事件
    ↓
GameState 變更 → EventBus 通知所有已訂閱的 Renderer
    ↓
UI 層：Renderer 重新渲染受影響的 DOM 區塊
    ↓
StorageService：在下一個 tick 自動將 GameState 序列化至 localStorage
```

### 遊戲主迴圈（GameEngine）

```
requestAnimationFrame / setInterval（每秒 tick）
    ↓
Timer.tick(deltaTime)
    ├─ 更新所有動物飽食度（FeedingService）
    ├─ 推進動物生產倒數（ProductionService）
    ├─ 推進作物成長階段（CropService）
    └─ 檢查成就條件（AchievementService）
    ↓
EventBus 廣播 'tick' 事件
    ↓
HUDRenderer 更新倒數顯示
```

---

## 實作階段

### Phase 0：研究（Research）

**目標**：解決所有技術不確定點，為 Phase 1 設計奠定基礎。

| 研究任務 | 問題 | 預期產出 |
|----------|------|----------|
| R-001 | Jest 27 CDN 版本與 `jest-environment-jsdom` 在純 HTML/CDN 環境的相容性與整合方式（含 CORS、`file://` 協定限制） | CDN 引入策略、jsdom 版本相容矩陣、test-runner.html 範本 |
| R-002 | `localStorage` 序列化效能與大小限制（5MB）對遊戲狀態的影響 | 資料壓縮策略、增量儲存方案 |
| R-003 | CSS Grid 實作 10×10 農場地圖的效能與可用性最佳實踐 | 地圖渲染方案、觸控支援策略 |
| R-004 | `requestAnimationFrame` vs `setInterval` 在即時制遊戲的適用性 | 主迴圈實作方案 |
| R-005 | 純 JS 輕量事件系統（EventBus）實作模式 | EventBus 設計方案 |

**產出**：`specs/001-animal-farm-game/research.md`

---

### Phase 1：設計與契約（Design & Contracts）

**前置條件**：`research.md` 完成。

#### 1-A：資料模型（data-model.md）

定義所有實體欄位、關聯、驗證規則與狀態轉換：

| 實體 | 核心欄位 | 狀態轉換 |
|------|----------|----------|
| `Player` | `coins`、`level`、`experience`、`inventory`（資源庫存） | 等級提升條件（experience 閾值） |
| `Animal` | `type`、`health`（0–100）、`hunger`（0–100）、`productionTimer`、`facilityId` | `healthy` → `hungry`（health < 50） → `starving`（health < 20） |
| `Building` | `type`、`level`（1–3）、`capacity`、`animals[]`、`tilePosition` | `empty` → `occupied` → `full` |
| `Crop` | `type`、`growthStage`（0–4）、`plantedAt`、`tilePosition` | `seeded` → `sprouting` → `growing` → `mature` → `harvested` |
| `Resource` | `type`、`quantity` | 倉庫庫存增減 |
| `Achievement` | `id`、`condition`、`progress`、`unlocked`、`reward` | `locked` → `in_progress` → `unlocked` |

**狀態機圖（Animal 健康狀態）**：

```
┌─────────────┐    未餵食超過閾值     ┌─────────────┐
│   healthy   │ ──────────────────→ │   hungry    │
│ (health≥50) │                     │ (health<50) │
└─────────────┘ ←────────────────── └─────────────┘
      ↑                餵食               ↓ 持續未餵食
      │                              ┌─────────────┐
      └────────────── 餵食 ───────── │  starving   │
                                     │ (health<20) │
                                     └─────────────┘
```

#### 1-B：介面契約（contracts/）

- **`game-engine-api.md`**：遊戲引擎公開方法契約（`GameEngine.start()`、`GameEngine.pause()`、`GameEngine.save()` 等）
- **`storage-schema.md`**：`localStorage` 金鑰 `animal_farm_save` 的 JSON Schema，含版本欄位以支援未來遷移
- **`events.md`**：自訂事件清單（`animal:fed`、`resource:collected`、`achievement:unlocked`、`building:upgraded` 等）

#### 1-C：快速入門指南（quickstart.md）

說明如何在本機開啟遊戲（直接以瀏覽器開啟 `index.html`）及執行測試（開啟 `tests/test-runner.html`）。

**產出**：`data-model.md`、`contracts/`、`quickstart.md`

---

### Phase 2：任務規劃（Tasks）

> **本指令（/speckit.plan）到此結束；以下為交接 /speckit.tasks 的規劃框架，不由本指令執行。**

建議 `/speckit.tasks` 依下列順序產生任務，確保 TDD 紅燈先於實作：

| 批次 | 內容 | 依賴 |
|------|------|------|
| T-01 | 專案骨架：`index.html`、`css/main.css`、空白 `src/` 目錄 | 無 |
| T-02 | 核心層 TDD：`EventBus`、`Timer`（紅燈 → 綠燈 → 重構） | T-01 |
| T-03 | 模型層 TDD：`Player`、`Animal`、`Building`、`Crop`（含驗證規則） | T-02 |
| T-04 | 服務層 TDD：`StorageService`、`ProductionService`、`FeedingService` | T-03 |
| T-05 | 服務層 TDD：`CropService`、`MarketService`、`UpgradeService`、`AchievementService` | T-04 |
| T-06 | UI 層：`FarmMapRenderer`（CSS Grid 地圖）、`HUDRenderer` | T-03 |
| T-07 | UI 層：`ShopPanel`、`MarketPanel`（FR-003、FR-007、FR-008） | T-05、T-06 |
| T-08 | UI 層：`AchievementPanel`、`NotificationSystem` | T-05 |
| T-09 | `GameEngine` 主迴圈整合 | T-02–T-08 |
| T-10 | 整合測試：US1–US5 Acceptance Scenarios | T-09 |
| T-11 | `TutorialFlow` 引導流程（SC-001） | T-09 |
| T-12 | 效能調校：60 FPS、響應 ≤ 1 秒（SC-002） | T-10 |

---

## 風險評估

| # | 風險 | 可能性 | 影響 | 緩解策略 |
|---|------|--------|------|----------|
| R1 | `localStorage` 5MB 上限：遊戲存檔（含大量動物 / 地圖資料）超限 | 中 | 高 | 儲存前對 JSON 進行增量差異儲存；移除 UI 暫態資料；Phase 0 研究 R-002 驗證 |
| R2 | Jest CDN 在純 HTML 環境的執行限制（CORS、`file://` 協定） | 高 | 中 | Phase 0 研究 R-001 確認可行方案；備選：使用原生 `console.assert` 輕量測試框架 |
| R3 | 即時制時間計算在頁籤切換 / 休眠後的飄移（`setInterval` throttling） | 中 | 中 | 使用時間戳差值計算（`Date.now()`），而非累計 tick 次數；Phase 0 研究 R-004 |
| R4 | CSS Grid 農場地圖在行動裝置觸控的互動體驗不佳 | 中 | 低 | Phase 0 研究 R-003 確認最小點擊目標（44px × 44px）；響應式佈局 |
| R5 | 邊界案例：玩家金幣歸零且無任何資源，遊戲陷入死局 | 低 | 高 | 設計保底機制：初始金幣 200 枚；免費每日獎勵（基礎飼料 × 5）；spec.md Edge Cases 對應 |
| R6 | 作物長時間離線後的狀態一致性（應繼續成長或凍結） | 低 | 中 | 依 spec.md Assumption：遊戲時間為即時制，離線後按真實時間差推進；Phase 0 確認 |

---

## 成功標準追蹤

| 成功標準 | 驗證方式 | 對應 Phase |
|----------|----------|------------|
| SC-001：新手 5 分鐘完成引導 | `TutorialFlow` 整合測試計時 | T-11 |
| SC-002：畫面響應 ≤ 1 秒 | Chrome DevTools Performance 面板 | T-12 |
| SC-003：儲存 ≤ 3 秒 | `StorageService` 單元測試計時 | T-04 |
| SC-004：30 分鐘體驗 3 種動物 | 人工測試 + 設定配置驗證 | T-10 |
| SC-005：1 小時解鎖 2 種動物或 1 次升級 | 遊戲進度曲線計算（config 驗證） | T-03、T-05 |
| SC-006：80% 玩家 30 分鐘解鎖 1 項成就 | 成就觸發條件人工驗算 | T-08 |
| SC-007：90% 新玩家無需外部說明 | `TutorialFlow` UX 評審 | T-11 |

---

## 憲法合規重新確認（Phase 1 後）

> Phase 1 設計完成後填入，確認設計決策不違反任何憲法原則。

| 原則 | 設計決策確認 | 狀態 |
|------|-------------|------|
| I. 繁體中文優先 | plan.md、data-model.md、contracts/ 均以繁中撰寫 | ✅ 待確認 |
| II. 精簡設計 | 無預先加入多人、雲端、動態定價功能 | ✅ 待確認 |
| III. TDD | 所有任務批次均以紅燈測試先行 | ✅ 待確認 |
| IV. 靜態前端 | 最終產出為純靜態 HTML/CSS/JS | ✅ 待確認 |
| V. Git 嚴格版控 | 每批次各自 commit，遵守 type(scope) 格式 | ✅ 待確認 |

---

*本文件由 `/speckit.plan` 指令產生。Phase 2 任務清單請執行 `/speckit.tasks` 產生 `tasks.md`。*
