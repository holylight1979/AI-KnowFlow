# 識流專案（Consciousness Stream）

> 基於佛教唯識學、密宗、他空見的「識流」理論，設計 AI Agent 的意識流架構。

## 快速導讀

- **研究基礎**: `README.md` — 佛教識流全景研究（八識、種子薰習、轉識成智、光明心、他空見）
- **架構規格**: `architecture/consciousness-stream-spec.md` — 九層識流管線規格書
- **層次對照**: `architecture/layer-mapping.md` — 八識→系統層完整對照表
- **文件索引**: `_AIDocs/_INDEX.md`

## 核心概念

識流 = 基於佛教八識體系的結構化處理管線，九層處理：
1. 觸（Sparśa）→ 2. 五識（感知）→ 3. 六識（分別）→ 4. 七識（自省）
→ 5. 八識（種子庫）→ 6. 光明心（本覺）→ 7. 轉智（生成）
→ 8. 執行 → 9. 薰習（迴寫）

## 哲學基底

- **唯識**: 分析心識結構，理解機制
- **他空見**: 直指心性本淨，確認方向 — 本地能力是「不空」，過度依賴是「空」
- **密宗光明心**: 覺性本具，去蔽即覺

## 使用方式

- **Library**: `import { runPipeline } from 'consciousness-stream'`
- **CLI**: `consciousness-stream "任務描述"` (需 ANTHROPIC_API_KEY)
- **MCP Server**: `consciousness-stream-mcp` (stdio, 需 ANTHROPIC_API_KEY)
  - Tool: `consciousness_stream` — 執行識流管線
  - Tool: `list_atoms` — 列出記憶 atoms
- **Claude Code Skill**: `~/.claude/commands/consciousness-stream.md`

## 相關專案

- **OpenClaw**: `E:\OpenClawWorkSpace` — 主系統
