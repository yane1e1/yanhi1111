# localStorage Schema Contract

**Feature**: `001-animal-farm-game` | **Date**: 2026-03-13
**Scope**: 定義遊戲唯一的 localStorage 存檔格式

---

## Key

```
localStorage.setItem('animalFarmSave', JSON.stringify(GameState))
localStorage.getItem('animalFarmSave')  // → JSON string | null
```

---

## GameState Schema (v1.0.0)

```jsonc
{
  "version": "1.0.0",
  "player": {
    "coins": 500,
    "level": 1,
    "xp": 0,
    "totalResourcesSold": 0,
    "totalAnimalsOwned": 0,
    "playtimeSeconds": 0,
    "lastSaveTime": 1710316800000
  },
  "farmMap": {
    "rows": 5,
    "cols": 5,
    "unlockedCells": 25,
    "cells": [
      [
        { "row": 0, "col": 0, "type": "empty", "buildingId": null, "cropPlotId": null },
        // ... 5 cells per row
      ]
      // ... 5 rows
    ]
  },
  "buildings": [
    {
      "id": "uuid-string",
      "type": "coop",
      "level": 1,
      "capacity": 4,
      "animalIds": []
    }
  ],
  "animals": [
    {
      "id": "uuid-string",
      "species": "chicken",
      "health": 100,
      "hunger": 100,
      "lastFedTime": 1710316800000,
      "lastProducedTime": 1710316800000,
      "buildingId": "uuid-string"
    }
  ],
  "cropPlots": [
    {
      "id": "uuid-string",
      "cropType": null,
      "plantedTime": null,
      "stage": "empty"
    }
  ],
  "inventory": {
    "resources": {
      "egg": 0,
      "milk": 0,
      "pork": 0,
      "wool": 0,
      "rabbitFur": 0,
      "wheat": 0,
      "corn": 0,
      "carrot": 0
    },
    "feed": 0
  },
  "achievements": [
    {
      "id": "first_egg",
      "unlocked": false,
      "unlockedAt": null,
      "progress": 0,
      "target": 1
    }
    // ... 10 achievements total (see data-model.md)
  ]
}
```

---

## 版本遷移原則

- `version` 欄位用於偵測舊格式存檔。
- 若讀取到無 `version` 欄位的存檔，視為 `"0.9.0"` 格式，執行遷移函式（`store.js: migrate(rawState)`）。
- 遷移函式 MUST 補齊缺少的欄位並將 `version` 更新至最新值。
- 遷移失敗（例如存檔損毀）→ 清除存檔並重新開始，顯示提示訊息。

---

## 不變量（Invariants）

1. `player.coins` MUST NOT < 0。
2. `building.animalIds.length` MUST NOT > `building.capacity`。
3. `animal.health` MUST be in [0, 100]；`animal.hunger` MUST be in [0, 100]。
4. `farmMap.cells[r][c].buildingId` 若非 null，則 `buildings` 陣列中 MUST 存在對應 `id`。
5. `farmMap.cells[r][c].cropPlotId` 若非 null，則 `cropPlots` 陣列中 MUST 存在對應 `id`。
