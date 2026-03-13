# Quickstart: 動物農場遊戲 (Animal Farm Game)

**Feature**: `001-animal-farm-game` | **Date**: 2026-03-13

---

## 先決條件

- Node.js 18+（僅測試需要）
- 現代瀏覽器（Chrome 90+ / Firefox 88+ / Safari 14+）
- 無需安裝任何建置工具

---

## 1. 取得專案

```bash
git clone https://github.com/yane1e1/yanhi1111.git
cd yanhi1111
git checkout 001-animal-farm-game
```

---

## 2. 執行遊戲

直接在瀏覽器開啟 `index.html`：

```bash
# 方法 A：直接開啟（大多數情況可行）
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

```bash
# 方法 B：使用簡易 HTTP 伺服器（若 ES Module 有 CORS 限制）
npx serve .
# 然後開啟 http://localhost:3000
```

---

## 3. 安裝測試依賴

```bash
npm install
```

`package.json` 中包含 Jest 及 Babel 設定。

---

## 4. 執行測試

```bash
# 執行所有測試
npm test

# 監看模式（開發時使用）
npm run test:watch

# 僅執行特定測試檔案
npm test -- tests/unit/animal.test.js
```

---

## 5. 遊戲基本操作流程

### 首次遊戲引導（5 分鐘內完成 SC-001）

1. **開始遊戲**：瀏覽器開啟後，畫面顯示 500 金幣與 5×5 農場地圖。
2. **建設雞舍**：點擊空白格子 → 選擇「建設雞舍」（費用：100 金幣）。
3. **購買雞**：點擊雞舍 → 選擇「購買動物」→ 選擇「雞」（費用：50 金幣）。
4. **等待產蛋**：雞每 5 分鐘產 1 顆蛋。畫面顯示倒計時。
5. **收集雞蛋**：倒計時結束後，點擊雞舍 → 「收集資源」，倉庫新增 1 顆蛋。
6. **出售雞蛋**：點擊「市場」→ 選擇「蛋」→ 出售，獲得 10 金幣。

> ✅ **驗證**：金幣從 350（500-100-50）增加至 360，測試通過。

---

## 6. 進階操作

### 餵食動物
- 點擊設施內的動物 → 「餵食」。
- 飼料不足時，前往「市場」購買飼料或種植作物。

### 種植作物
- 點擊空白格子 → 「開墾耕地」→ 選擇作物種類 → 等待成長週期 → 點擊收穫。

### 升級設施
- 點擊設施 → 「升級設施」→ 確認費用（等級 × 100 金幣）。

### 查看成就
- 點擊頁面右上角「🏆 成就」按鈕，查看進度與已解鎖清單。

---

## 7. 存檔說明

- 遊戲在每次操作後自動存檔至 `localStorage`（key: `animalFarmSave`）。
- 重新整理頁面後，進度自動讀取。
- 清除存檔：開啟瀏覽器 DevTools → Application → Local Storage → 刪除 `animalFarmSave`。

---

## 8. 專案結構速覽

```text
index.html         # 遊戲入口
style.css          # 全域樣式
src/
├── constants.js   # 遊戲常數與平衡數值
├── store.js       # localStorage 讀寫
├── game.js        # 主迴圈
├── farm-map.js    # 地圖渲染
├── animal.js      # 動物邏輯
├── crop.js        # 作物邏輯
├── building.js    # 設施邏輯
├── inventory.js   # 倉庫邏輯
├── market.js      # 市場交易
├── achievement.js # 成就系統
└── ui.js          # UI 輔助
tests/
├── unit/          # 各模組單元測試
└── integration/   # 遊戲迴圈整合測試
```

---

## 9. 常見問題

**Q: ES Module `import` 在瀏覽器出現 CORS 錯誤？**
A: 使用 `npx serve .` 啟動本地伺服器（步驟 2 方法 B）。

**Q: 如何重置遊戲？**
A: DevTools → Application → Local Storage → 刪除 `animalFarmSave` → 重新整理頁面。

**Q: 測試執行失敗，顯示 `SyntaxError: Cannot use import statement`？**
A: 確認 `package.json` 的 `jest` 設定包含 `transform` 與 `babel-jest`。執行 `npm install` 後重試。
