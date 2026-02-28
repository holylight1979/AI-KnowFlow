# _AIDocs 索引 — 識流專案

> 建立日期: 2026-02-28

## 文件清單

| 文件 | 說明 | 最後更新 |
|------|------|---------|
| `_CHANGELOG.md` | 變更記錄 | 2026-02-28 |
| `../README.md` | 佛教識流全景研究（八識、種子薰習、轉識成智、光明心、他空見） | 2026-02-28 |
| `../architecture/consciousness-stream-spec.md` | 識流九層管線規格書 | 2026-02-28 |
| `../architecture/layer-mapping.md` | 八識→系統層對照表 | 2026-02-28 |
| `../CLAUDE.md` | 專案導讀 | 2026-02-28 |
| `../src/types.ts` | 核心型別定義（管線狀態、各層 I/O、adapter 介面） | 2026-03-01 |
| `../src/pipeline.ts` | 管線協調器主入口 | 2026-03-01 |
| `../src/llm.ts` | LLM adapter（Passthrough + Anthropic API） | 2026-03-01 |
| `../src/memory.ts` | 記憶 adapter（FileMemory + NullMemory） | 2026-03-01 |
| `../src/report.ts` | 識流報告 markdown 格式化 | 2026-03-01 |
| `../src/layers/*.ts` | 九層管線實作（sparsa→vasana，各一檔） | 2026-03-01 |
| `../src/cli.ts` | CLI 入口（獨立執行識流管線） | 2026-03-01 |
| `../src/perception.ts` | 感知 Adapter（CLI/MCP 共用） | 2026-03-01 |
| `../src/mcp.ts` | MCP Server 入口（consciousness_stream + list_atoms） | 2026-03-01 |
| `../test/pipeline.test.ts` | 管線測試（mock LLM，9 cases） | 2026-03-01 |
| `../test/cli.test.ts` | CLI 元件測試（parseCliArgs，9 cases） | 2026-03-01 |
| `../test/mcp.test.ts` | MCP tool handler 測試（7 cases） | 2026-03-01 |
| `../.mcp.json` | MCP Server 配置 | 2026-03-01 |
