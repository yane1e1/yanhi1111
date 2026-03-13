# Tasks: 動物農場遊戲 (Animal Farm Game)

**Input**: Design documents from `/specs/001-animal-farm-game/`
**Prerequisites**: plan.md ✓, spec.md ✓

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create directory structure: `src/`, `src/css/`, `src/js/`, `src/js/models/`, `src/js/services/`, `src/js/ui/`
- [X] T002 Create `src/js/config.js` — game constants (animal types, building types, crop types, pricing, timers)
- [X] T003 [P] Create `.gitignore` for browser project

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data models and infrastructure all stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create `src/js/models/player.js` — Player class (coins, level, xp, inventory, farmTiles)
- [X] T005 [P] Create `src/js/models/animal.js` — Animal class (id, type, health, hunger, lastFed, lastProduced)
- [X] T006 [P] Create `src/js/models/building.js` — Building class (id, type, level, capacity, animals)
- [X] T007 [P] Create `src/js/models/crop.js` — Crop class (id, type, plantedAt, stage, harvestable)
- [X] T008 [P] Create `src/js/models/achievement.js` — Achievement class (id, title, condition, reward, unlocked)
- [X] T009 Create `src/js/services/saveService.js` — localStorage save/load with auto-save
- [X] T010 Create `src/js/services/gameService.js` — GameState, game loop (setInterval tick), state init/reset
- [X] T011 Create `src/css/style.css` — base layout, farm grid, modal, HUD, shop styles
- [X] T012 Create `src/index.html` — HTML shell with game containers, modal placeholders, script/link tags

**Checkpoint**: Foundation ready — all data models, game loop, and HTML scaffold exist

---

## Phase 3: User Story 1 — 建立並管理農場 (Priority: P1) 🎯 MVP

**Goal**: Player can buy animals, place them in buildings, collect resources, sell for coins
**Independent Test**: Buy a chicken, wait for egg production, collect egg, sell egg, verify coin increase

### Implementation for User Story 1

- [X] T013 Create `src/js/services/farmService.js` — tile management, place/remove buildings and animals
- [X] T014 [P] [US1] Create `src/js/services/animalService.js` — production tick, resource generation per animal type
- [X] T015 [P] [US1] Create `src/js/services/marketService.js` — fixed prices for all resources, buy/sell transactions
- [X] T016 [US1] Create `src/js/ui/farmMapUI.js` — render farm grid (CSS grid), tiles, buildings, animals with emoji/icons
- [X] T017 [US1] Create `src/js/ui/hudUI.js` — display coins, level, current time, real-time update
- [X] T018 [US1] Create `src/js/ui/shopUI.js` — modal: list animals/buildings for purchase with prices; handle buy
- [X] T019 [US1] Create `src/js/ui/inventoryUI.js` — display warehouse resources and quantities
- [X] T020 [US1] Create `src/js/ui/marketUI.js` — display resource prices, sell buttons, handle sell transactions
- [X] T021 [US1] Create `src/js/ui/app.js` — main controller: init game, wire UI events, coordinate all UI modules
- [X] T022 [US1] Wire US1 end-to-end: shop → buy animal → place in building → tick produces resource → collect → sell

**Checkpoint**: US1 fully functional — buy chicken → egg produced → sold → coins increased

---

## Phase 4: User Story 2 — 飼養與照顧動物 (Priority: P2)

**Goal**: Animals have health/hunger; unfed animals lose health and produce less; feeding restores health
**Independent Test**: Stop feeding, verify health drops and production decreases; feed, verify recovery

### Implementation for User Story 2

- [X] T023 [US2] Extend `animalService.js` — hunger/health decay on tick; production penalty when health low
- [X] T024 [US2] Extend `farmMapUI.js` — show health bar and hunger indicator on animal tiles
- [X] T025 [US2] Extend `shopUI.js` — add feed/seed purchase section
- [X] T026 [US2] Add feed action to animal tiles — deduct feed from inventory, restore hunger/health
- [X] T027 [US2] Add low-feed warning notification in `hudUI.js` or modal alert

**Checkpoint**: US2 functional — unfed animals degrade; feeding restores state

---

## Phase 5: User Story 3 — 農場升級與擴展 (Priority: P3)

**Goal**: Players can unlock new animal types, upgrade buildings (capacity/efficiency), buy new land tiles
**Independent Test**: Accumulate enough coins, purchase land/upgrade building, verify map/capacity changes

### Implementation for User Story 3

- [X] T028 [US3] Extend `farmService.js` — unlock tiles based on player level/coins; expand farm grid
- [X] T029 [US3] Extend `building.js` + `animalService.js` — upgrade logic: higher level = more capacity + efficiency
- [X] T030 [US3] Extend `shopUI.js` — upgrade tab with building upgrade options and costs
- [X] T031 [US3] Extend `farmMapUI.js` — render expanded grid and show locked tiles with unlock cost

**Checkpoint**: US3 functional — land purchase and building upgrades work correctly

---

## Phase 6: User Story 4 — 作物種植與飼料生產 (Priority: P4)

**Goal**: Players plant crops on empty tiles; crops grow over time; harvest for feed or sell
**Independent Test**: Plant wheat on empty tile, wait for growth, harvest, verify feed inventory or coins increase

### Implementation for User Story 4

- [X] T032 [US4] Create `src/js/services/cropService.js` — plant crop on tile, growth tick, harvest logic
- [X] T033 [US4] Extend `farmMapUI.js` — render crop tiles with growth stage visuals
- [X] T034 [US4] Extend `shopUI.js` — seeds purchase section (wheat, corn, carrot seeds)
- [X] T035 [US4] Add harvest action on mature crop tiles — add feed/resource to inventory
- [X] T036 [US4] Add sell crop option in `marketUI.js`

**Checkpoint**: US4 functional — full crop planting → growth → harvest cycle works

---

## Phase 7: User Story 5 — 玩家進度與成就系統 (Priority: P5)

**Goal**: Track player progress (level, XP, totals); unlock achievements with rewards at milestones
**Independent Test**: Reach a milestone (e.g., 100 eggs), verify achievement notification and reward issued

### Implementation for User Story 5

- [X] T037 Create `src/js/services/achievementService.js` — define 10+ achievements, check conditions each tick, issue rewards
- [X] T038 [US5] Create `src/js/ui/achievementUI.js` — achievements modal (locked/unlocked list, progress)
- [X] T039 [US5] Extend `gameService.js` — XP gain on actions, level-up logic, unlock new content at each level
- [X] T040 [US5] Add achievement unlock toast notification in `app.js`
- [X] T041 [US5] Extend `hudUI.js` — show player level and XP progress bar

**Checkpoint**: US5 functional — achievements unlock with notifications and rewards

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T042 Add new player onboarding tutorial overlay (step-by-step first-time instructions)
- [X] T043 [P] Add resource market price display table in `marketUI.js`
- [X] T044 [P] Add responsive CSS for different screen sizes in `style.css`
- [X] T045 Add time-speed setting (1x/2x/5x) for game tick rate
- [X] T046 [P] Add favicon and page title, ensure proper HTML meta tags
- [X] T047 Verify auto-save works: reload page and confirm state restored
- [X] T048 Final end-to-end validation of all 5 user stories

---

## Dependencies & Execution Order

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundation)**: Depends on Phase 1
- **Phase 3 (US1)**: Depends on Phase 2 — delivers MVP
- **Phase 4 (US2)**: Depends on Phase 3
- **Phase 5 (US3)**: Depends on Phase 3
- **Phase 6 (US4)**: Depends on Phase 2
- **Phase 7 (US5)**: Depends on Phase 3
- **Phase 8 (Polish)**: Depends on all user stories
