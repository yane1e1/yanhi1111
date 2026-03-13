# Implementation Plan: 動物農場遊戲 (Animal Farm Game)

**Branch**: `001-animal-farm-game` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-animal-farm-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

建立一個可在瀏覽器中執行的靜態網頁農場遊戲，玩家可購買並照顧動物（雞、牛、豬、羊、兔）、種植作物（小麥、玉米、胡蘿蔔）、收集與出售資源、升級設施，並累積成就。遊戲進度儲存於 localStorage，無需後端伺服器。技術選型為純 HTML5 / CSS3 / Vanilla JavaScript，以 DOM 渲染二維農場地圖。

## Technical Context

**Language/Version**: HTML5 / CSS3 / JavaScript (ES2020+)
**Primary Dependencies**: 無第三方框架（純靜態，無 CDN 依賴）
**Storage**: localStorage（瀏覽器本機儲存，JSON 序列化）
**Testing**: Jest（Node.js 執行，單元 + 整合測試）
**Target Platform**: 現代瀏覽器（Chrome 90+、Firefox 88+、Safari 14+）
**Project Type**: 靜態網頁應用（Web Game）
**Performance Goals**: 每次操作畫面響應 < 1 秒（SC-002）；存檔 < 3 秒（SC-003）
**Constraints**: 純靜態產出，可部署至 GitHub Pages；無伺服器端依賴
**Scale/Scope**: 單人本地遊戲；5 種動物、3 種作物、10+ 項成就

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | 原則 | 符合狀態 | 說明 |
|---|------|---------|------|
| I | 繁體中文優先 | ✅ PASS | 所有規格文件以繁體中文撰寫；程式碼識別字使用英文 |
| II | 精簡設計（YAGNI/KISS） | ✅ PASS | 只實作 spec 明確要求的功能；無後端、無多人模式 |
| III | TDD（NON-NEGOTIABLE） | ✅ PASS | 計劃先寫 Jest 單元測試（驗收情境），紅燈後實作 |
| IV | 前端靜態網站優先 | ✅ PASS | 純 HTML/CSS/JS，可部署 GitHub Pages，無伺服器框架 |
| V | Git 嚴格版本控制 | ✅ PASS | 每個開發階段各自 commit，遵守 conventional commits |

**Constitution Gate**: ✅ 所有原則均符合，可進入 Phase 0。

## Project Structure

### Documentation (this feature)

```text
specs/001-animal-farm-game/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── localStorage-schema.md
│   └── game-events.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
index.html               # 遊戲入口頁面
style.css                # 全域樣式
src/
├── constants.js         # 遊戲常數（動物定義、作物定義、成就定義）
├── store.js             # 狀態管理（讀寫 localStorage）
├── game.js              # 遊戲主迴圈與事件分派
├── farm-map.js          # 農場地圖渲染（DOM 格線）
├── animal.js            # 動物實體邏輯（健康、飽食、產出）
├── crop.js              # 作物實體邏輯（成長週期、收穫）
├── building.js          # 設施邏輯（容納量、升級）
├── inventory.js         # 倉庫管理（資源收取、出售）
├── market.js            # 市場定價與交易
├── achievement.js       # 成就追蹤與通知
└── ui.js                # UI 更新輔助函式

tests/
├── unit/
│   ├── animal.test.js
│   ├── crop.test.js
│   ├── building.test.js
│   ├── inventory.test.js
│   ├── market.test.js
│   └── achievement.test.js
└── integration/
    └── game-loop.test.js
```

**Structure Decision**: 選用單一靜態專案結構。純靜態前端，無需 backend/ 或 frontend/ 分離。所有 JS 模組以 ES Module 撰寫，直接由 `index.html` 載入，無建置工具需求。測試以 Jest（Node.js）執行模組邏輯。

## Complexity Tracking

> 無 Constitution Check 違規，此區塊保留但為空。
