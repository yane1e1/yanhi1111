# Tasks: 動物農場遊戲 (Animal Farm Game)

**Input**: Design documents from `/specs/001-animal-farm-game/`
**Prerequisites**: spec.md (user stories), no plan.md – tech stack inferred from spec

**Tech Stack** (inferred from spec.md – browser-based single-player game):
- Language: TypeScript
- Rendering: HTML5 Canvas (via Phaser 3 game framework)
- Persistence: localStorage (auto-save, no login required)
- Bundler: Vite
- Project root: `src/`

**Tests**: No test tasks generated – not explicitly requested in spec.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure

- [ ] T001 Initialize Vite + TypeScript project and install Phaser 3 in package.json
- [ ] T002 Create project directory structure: `src/scenes/`, `src/models/`, `src/services/`, `src/ui/`, `src/config/`, `src/utils/`, `public/assets/`
- [ ] T003 [P] Configure TypeScript in tsconfig.json with strict mode
- [ ] T004 [P] Configure Vite in vite.config.ts with Phaser alias and asset handling
- [ ] T005 [P] Create game entry point in src/main.ts and wire Phaser.Game config

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core engine, data models, and save system that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Define shared constants and game config in src/config/gameConfig.ts (animal types, crop types, building types, base prices, production cycles)
- [ ] T007 [P] Create Player model in src/models/Player.ts (coins, level, inventory/warehouse, animalCount, totalResourcesProduced)
- [ ] T008 [P] Create Animal model in src/models/Animal.ts (id, type, health, satiety, productionTimer, productionCycle, cost, resourceType)
- [ ] T009 [P] Create Building model in src/models/Building.ts (id, type, capacity, level, upgradeRequirements, contains Animal[])
- [ ] T010 [P] Create Resource model in src/models/Resource.ts (type, quantity, marketPrice)
- [ ] T011 [P] Create FarmMap model in src/models/FarmMap.ts (grid of Tiles, each Tile has type: empty/building/crop/locked)
- [ ] T012 Implement SaveService in src/services/SaveService.ts (serialize/deserialize full game state to localStorage, auto-save on every mutation)
- [ ] T013 Implement EventBus in src/utils/EventBus.ts (lightweight pub/sub for game-wide events like 'resourceCollected', 'animalFed', 'achievementUnlocked')
- [ ] T014 Create BootScene in src/scenes/BootScene.ts (load assets, restore saved game state via SaveService, transition to GameScene)
- [ ] T015 Create GameScene in src/scenes/GameScene.ts (bootstrap Phaser scene, render FarmMap, mount UI overlay, start game loop tick)
- [ ] T016 Implement GameLoop tick in src/services/GameLoopService.ts (real-time interval: advance production timers, reduce satiety, trigger resource generation, auto-save)

**Checkpoint**: Foundation ready – user story implementation can now begin in parallel

---

## Phase 3: User Story 1 – 建立並管理農場 / Build and Manage a Farm (Priority: P1) 🎯 MVP

**Goal**: Player starts with coins, buys animals, places them in buildings, collects resources, and sells them for coins – completing the core farm loop.

**Independent Test**: Launch game → buy a chicken from the shop (costs coins) → place it in a pen → wait for production cycle → collect egg → sell egg in market → confirm coin balance increased.

### Implementation for User Story 1

- [ ] T017 [P] [US1] Implement ShopService in src/services/ShopService.ts (buyAnimal, buyBuilding, buyFeed – deduct coins from Player, enforce balance checks)
- [ ] T018 [P] [US1] Implement MarketService in src/services/MarketService.ts (sellResource – add coins to Player using fixed price from gameConfig, reduce warehouse stock)
- [ ] T019 [US1] Implement FarmService in src/services/FarmService.ts (placeAnimal in Building, collectResource from Animal, validateCapacity)
- [ ] T020 [US1] Implement WarehouseService in src/services/WarehouseService.ts (addResource, removeResource, getStock – manage Player inventory)
- [ ] T021 [P] [US1] Create FarmMapRenderer in src/ui/FarmMapRenderer.ts (render 2D grid on Phaser canvas, draw buildings and animals as sprites on tiles)
- [ ] T022 [P] [US1] Create ShopPanel UI component in src/ui/ShopPanel.ts (display purchasable animals and buildings with costs, emit buy events)
- [ ] T023 [P] [US1] Create MarketPanel UI component in src/ui/MarketPanel.ts (display sellable resources with prices, emit sell events)
- [ ] T024 [P] [US1] Create WarehousePanel UI component in src/ui/WarehousePanel.ts (display current inventory quantities)
- [ ] T025 [US1] Create HUD in src/ui/HUD.ts (display player coins, level, and notification area – updates reactively via EventBus)
- [ ] T026 [US1] Wire US1 interactions in GameScene: tile click → place animal dialog, building click → open animal list + collect button, HUD sell button → MarketPanel

**Checkpoint**: User Story 1 fully functional – core farm loop works end-to-end

---

## Phase 4: User Story 2 – 飼養與照顧動物 / Animal Care and Feeding (Priority: P2)

**Goal**: Animals have health and satiety. Neglecting feeding reduces production. Feeding restores animal state.

**Independent Test**: Buy an animal → do not feed it → verify health/satiety decreases and resource output drops → feed the animal → verify recovery.

### Implementation for User Story 2

- [ ] T027 [US2] Extend GameLoopService in src/services/GameLoopService.ts to reduce Animal.satiety over time and lower production rate when satiety < threshold
- [ ] T028 [P] [US2] Implement FeedingService in src/services/FeedingService.ts (feedAnimal – consume feed from warehouse, restore satiety and health, trigger EventBus 'animalFed')
- [ ] T029 [P] [US2] Add FeedIndicator UI overlay in src/ui/FeedIndicator.ts (show hunger/health bar on each animal sprite using Phaser graphics)
- [ ] T030 [US2] Add low-feed warning in src/ui/NotificationManager.ts (show alert via HUD when warehouse feed stock is insufficient to feed all animals)
- [ ] T031 [US2] Update ShopPanel in src/ui/ShopPanel.ts to include feed purchase options (wheat bag, mixed feed) with costs from gameConfig
- [ ] T032 [US2] Wire feeding interactions in GameScene: animal click → show health/satiety tooltip + feed button; call FeedingService on confirm

**Checkpoint**: Animal care loop works – production degrades without feeding and recovers when fed

---

## Phase 5: User Story 3 – 農場升級與擴展 / Farm Expansion and Upgrades (Priority: P3)

**Goal**: Player can unlock new land tiles, upgrade buildings to increase capacity/efficiency, and purchase new animal types as coins accumulate.

**Independent Test**: Accumulate coins → buy new land tile → verify farm grid expands; upgrade a pen → verify capacity increases; verify new animal types appear in shop after meeting unlock conditions.

### Implementation for User Story 3

- [ ] T033 [P] [US3] Implement UpgradeService in src/services/UpgradeService.ts (upgradeBuilding – deduct coins, increment Building.level, increase capacity, update efficiency multiplier per gameConfig)
- [ ] T034 [P] [US3] Implement LandExpansionService in src/services/LandExpansionService.ts (purchaseTile – deduct coins, unlock locked FarmMap tile, trigger map re-render)
- [ ] T035 [US3] Update ShopService in src/services/ShopService.ts to gate new animal types (cow, pig, sheep, rabbit) behind player level / coin thresholds from gameConfig
- [ ] T036 [P] [US3] Create UpgradePanel UI component in src/ui/UpgradePanel.ts (display upgradeable buildings with current level, next level stats, and cost)
- [ ] T037 [P] [US3] Update FarmMapRenderer in src/ui/FarmMapRenderer.ts to render locked tile overlays and handle tile-purchase click interactions
- [ ] T038 [US3] Update GameScene to open UpgradePanel on building right-click / long-press, and wire LandExpansionService on locked tile click

**Checkpoint**: Farm expansion and upgrade loop works – new land and upgraded buildings function correctly

---

## Phase 6: User Story 4 – 作物種植與飼料生產 / Crop Planting and Feed Production (Priority: P4)

**Goal**: Player plants crops (wheat, corn, carrot) on empty tiles. Crops grow over time and can be harvested for feed or sold.

**Independent Test**: Select empty tile → plant wheat seed → wait for growth cycle → harvest → verify feed stock increases; optionally sell crop → verify coins increase.

### Implementation for User Story 4

- [ ] T039 [P] [US4] Create Crop model in src/models/Crop.ts (type, growthTimer, growthCycleDuration, harvestYield, seedCost, sellPrice)
- [ ] T040 [P] [US4] Implement CropService in src/services/CropService.ts (plantCrop – deduct seed from warehouse, set Tile type to 'crop', start growthTimer; harvestCrop – add yield to warehouse, reset Tile; sellCrop – add coins)
- [ ] T041 [US4] Extend GameLoopService in src/services/GameLoopService.ts to advance Crop.growthTimer and emit 'cropReady' event via EventBus when cycle completes
- [ ] T042 [P] [US4] Create CropRenderer in src/ui/CropRenderer.ts (render crop growth stages as sprites on farm tiles, update on 'cropReady' EventBus event)
- [ ] T043 [P] [US4] Create SeedShopPanel UI component in src/ui/SeedShopPanel.ts (display available seed types with costs; accessible from ShopPanel)
- [ ] T044 [US4] Wire crop interactions in GameScene: empty tile click → show plant menu, planted tile click → show harvest/progress overlay; call CropService

**Checkpoint**: Crop lifecycle works – planting, growing, harvesting, and selling all function correctly

---

## Phase 7: User Story 5 – 玩家進度與成就系統 / Player Progress and Achievement System (Priority: P5)

**Goal**: Track player level and stats. Unlock 10+ achievements with rewards when milestones are reached. Show achievement notifications and a progress page.

**Independent Test**: Complete first-harvest milestone → verify achievement unlock notification appears → open achievements page → confirm it shows unlocked/locked list with progress.

### Implementation for User Story 5

- [ ] T045 [P] [US5] Create Achievement model in src/models/Achievement.ts (id, title, description, condition type+threshold, reward type+value, unlocked boolean, progress)
- [ ] T046 [P] [US5] Define all 10+ achievement definitions in src/config/achievements.ts (e.g., firstEgg, collect100Eggs, firstCrop, farmLevel5, firstUpgrade, allAnimalTypes, richFarmer, fullWarehouse, master farmer, cropMaster)
- [ ] T047 [US5] Implement AchievementService in src/services/AchievementService.ts (checkAchievements – evaluate all conditions against Player stats after each action; unlockAchievement – mark unlocked, grant reward via WarehouseService/Player, emit 'achievementUnlocked')
- [ ] T048 [US5] Implement ProgressService in src/services/ProgressService.ts (calculateLevel – compute player level from cumulative stats; grantLevelUpRewards – unlock new content based on level thresholds from gameConfig)
- [ ] T049 [US5] Wire AchievementService calls in EventBus listeners in src/services/AchievementService.ts (subscribe to 'resourceCollected', 'animalFed', 'cropHarvested', 'buildingUpgraded' events)
- [ ] T050 [P] [US5] Create AchievementsPanel UI component in src/ui/AchievementsPanel.ts (display locked/unlocked achievements with progress bars and reward descriptions)
- [ ] T051 [P] [US5] Create AchievementToast UI component in src/ui/AchievementToast.ts (animated banner notification shown on achievement unlock via 'achievementUnlocked' event)
- [ ] T052 [US5] Update HUD in src/ui/HUD.ts to display player level and add button to open AchievementsPanel

**Checkpoint**: Achievement and progression system works – milestones trigger notifications, rewards are granted, panel shows full list

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T053 [P] Implement onboarding tutorial overlay in src/ui/TutorialOverlay.ts (step-by-step first-run guide covering: buy chicken → place → collect → sell; shown once, dismissable)
- [ ] T054 [P] Implement error/validation feedback in src/ui/NotificationManager.ts (unified toast system for: insufficient coins, building full, no feed available)
- [ ] T055 Add game speed setting in src/config/gameConfig.ts and in src/services/GameLoopService.ts (multiplier 0.5x / 1x / 2x for production and growth timers)
- [ ] T056 [P] Add offline progress calculation in src/services/SaveService.ts (on load, compute elapsed time since last save and fast-forward production/growth timers accordingly)
- [ ] T057 [P] Add edge-case handling: full-warehouse guard in WarehouseService.ts, full-building guard in FarmService.ts, dead-broke guidance flow in ShopService.ts (show hint when coins = 0 and no animals owned)
- [ ] T058 Run quickstart manual validation: launch game, complete US1 independent test end-to-end, verify auto-save persists across page reload
- [ ] T059 [P] Performance pass: ensure GameLoopService tick stays below 100ms; profile Phaser render loop for frame drops with 20+ animals on screen
- [ ] T060 [P] Update README.md with local dev setup instructions, tech stack, and feature overview

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies – can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion – **BLOCKS all user stories**
- **User Stories (Phases 3–7)**: All depend on Foundational (Phase 2) completion
  - Stories can be worked in parallel by separate developers once Phase 2 is done
  - Or implemented sequentially in priority order: P1 → P2 → P3 → P4 → P5
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Phase 2 – no dependency on other user stories
- **US2 (P2)**: Depends on Phase 2 + US1 (animals must exist to be fed)
- **US3 (P3)**: Depends on Phase 2 + US1 (buildings and animals must exist to upgrade)
- **US4 (P4)**: Depends on Phase 2 + US1 (warehouse and coins must exist); independent of US2/US3
- **US5 (P5)**: Depends on Phase 2 + all other stories (tracks actions across all gameplay systems)

### Within Each User Story

- Services before UI components
- Core models (Phase 2) before story-level services
- Story services before GameScene wiring
- Story complete and manually tested before moving to next priority

### Parallel Opportunities

- T003, T004, T005 (Setup) can run in parallel
- T007–T011 (core models) can run in parallel
- Within each user story: all tasks marked [P] can run in parallel
- US1, US3, and US4 can be worked in parallel once Phase 2 is complete
- UI components within a story marked [P] can be developed alongside their service counterparts

---

## Parallel Example: User Story 1

```bash
# Launch all parallel tasks for US1 together:
Task T017: "Implement ShopService in src/services/ShopService.ts"
Task T018: "Implement MarketService in src/services/MarketService.ts"
Task T021: "Create FarmMapRenderer in src/ui/FarmMapRenderer.ts"
Task T022: "Create ShopPanel UI component in src/ui/ShopPanel.ts"
Task T023: "Create MarketPanel UI component in src/ui/MarketPanel.ts"
Task T024: "Create WarehousePanel UI component in src/ui/WarehousePanel.ts"

# Sequential after parallel batch:
Task T019: FarmService (depends on ShopService + FarmMapRenderer context)
Task T020: WarehouseService
Task T025: HUD (depends on EventBus and coin tracking)
Task T026: Wire interactions in GameScene (depends on all above)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL – blocks all stories)
3. Complete Phase 3: User Story 1 (T017–T026)
4. **STOP and VALIDATE**: Launch game, run US1 Independent Test manually
5. Deploy/demo the working farm loop

### Incremental Delivery

1. Setup + Foundational → engine ready, farm map renders
2. + User Story 1 → playable core loop (buy → farm → sell) → **MVP demo**
3. + User Story 2 → animal needs system adds strategy depth
4. + User Story 3 → progression via upgrades and expansion
5. + User Story 4 → crop self-sufficiency strategy layer
6. + User Story 5 → achievement motivation and long-term retention
7. Each increment is independently deployable and testable

### Parallel Team Strategy

With 3 developers after Phase 2:
- **Dev A**: US1 (core farm loop – highest value)
- **Dev B**: US3 (expansion + upgrades – can stub animal placement)
- **Dev C**: US4 (crops – entirely independent subsystem)

US2 and US5 follow once their prerequisites are complete.

---

## Notes

- [P] tasks = operate on different files with no blocking dependencies – safe to run in parallel
- [USn] label maps each task to a specific user story for traceability
- Each user story is independently completable and manually testable via its Independent Test
- Auto-save (SaveService) must be wired before any user story work begins (Phase 2 prerequisite)
- Offline progress (T056) should be implemented before first deployment to avoid player confusion
- No test tasks generated – add test phases if TDD is adopted in future iterations
- Game speed config (T055) allows rapid manual testing of time-based mechanics during development
