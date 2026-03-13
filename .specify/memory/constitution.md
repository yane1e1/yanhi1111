<!--
SYNC IMPACT REPORT
==================
Version change: (template) → 1.0.0
Modified principles: N/A（首次填入模板，所有原則均為新增）
Added sections:
  - Core Principles (5 原則)
  - 開發工作流程與紀律
  - Governance
Removed sections: N/A
Templates updated:
  - .specify/templates/spec-template.md        ✅ 相容，無需修改
  - .specify/templates/plan-template.md        ✅ 相容，無需修改
  - .specify/templates/tasks-template.md       ✅ 相容，無需修改
  - .specify/templates/constitution-template.md ✅ 來源模板維持不變（刻意保留）
Deferred TODOs: 無
-->

# yanhi1111 Constitution

## Core Principles

### I. 繁體中文優先

所有規格文件（spec.md、plan.md、tasks.md、checklist.md）MUST 以繁體中文撰寫。
程式碼內的識別字（變數名、函數名、類別名）MUST 使用英文；
行內注釋得依情況選擇繁中或英文，以清晰表達為準。
回覆與討論一律使用繁體中文。

### II. 精簡設計（YAGNI / KISS）

- 只實作當前需求，MUST NOT 為假設的未來需求增加複雜度。
- MUST NOT 新增未被明確要求的功能、配置選項或抽象層。
- 錯誤處理、防禦性程式碼僅限系統邊界（使用者輸入、外部 API）。
- 不得在未被修改的程式碼中加入文件字串、型別注解或注釋。

### III. 測試驅動開發（TDD，NON-NEGOTIABLE）

- 實作前 MUST 先撰寫測試，確認測試為紅燈後才開始實作。
- 嚴格遵守 Red → Green → Refactor 循環。
- 未通過測試的程式碼 MUST NOT 合併至主分支。
- 測試範圍以使用者故事的驗收情境（Acceptance Scenarios）為基礎。

### IV. 前端靜態網站優先

- 網站專案 MUST 以純靜態前端為主（HTML / CSS / JavaScript），可部署至 GitHub Pages。
- MUST NOT 引入需要伺服器端執行環境的後端框架，除非需求明確說明。
- 第三方框架、函式庫的引入 MUST 以 CDN 或純靜態產出物為限，避免複雜建置流程。
- 若需建置工具，MUST 確保最終產出為可直接托管的靜態檔案。

### V. Git 嚴格版本控制

- 每個開發階段（setup、red tests、green implementation、refactor）MUST 各自提交一個 commit。
- Commit message MUST 遵守慣例格式：`type(scope): description`（英文或繁中皆可）。
- MUST NOT 使用 `--force`、`--no-verify` 或任何繞過安全檢查的指令，除非使用者明確授權。
- 合併前 MUST 確認所有測試通過。

## 開發工作流程與紀律

- **tasks.md 打勾紀律**：implement 階段每完成一項任務，MUST 立即將對應的 `[ ]` 更新為 `[x]`，
  不得批次補勾或事後補記。
- **規格文件保護**：implement 階段套用框架模板或建立專案結構時，MUST 事先確認
  spec.md、plan.md、tasks.md 等規格文件不會被覆蓋或刪除；若有衝突，以保留規格文件為優先。
- **分支策略**：每個 feature 使用獨立分支，命名格式 `###-feature-name`；完成後透過 PR 合併。
- **變更範圍**：每次 PR MUST 聚焦於單一功能或修復，避免混合不相關的變更。

## Governance

本憲法凌駕於所有其他開發慣例。若有衝突，以本文件為準。

**修訂程序**：
1. 提出修訂草案，說明修改理由與影響範圍。
2. 版本號依語意化版本規則遞增（MAJOR / MINOR / PATCH）。
3. 修訂後 MUST 更新 `LAST_AMENDED_DATE` 並同步檢查所有相依模板。
4. 每次修訂 MUST 在文件頂端的 Sync Impact Report 中記錄。

**版本政策**：
- MAJOR：原則刪除、定義不相容變更。
- MINOR：新增原則或章節、實質擴充現有指引。
- PATCH：措辭釐清、錯字修正、非語意細節調整。

**合規審查**：每個 PR review MUST 確認本憲法各項原則均被遵守。複雜度增加 MUST 在
plan.md 的 Complexity Tracking 中明確說明。

**Version**: 1.0.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-13
