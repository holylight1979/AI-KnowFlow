# _CHANGELOG — 識流專案

## 2026-03-01 — Phase 2: 增強 Skill + CLI

- 新增 CLI 入口（src/cli.ts）：AnthropicLlm + FileMemoryAdapter + CliPerceptionAdapter
- 支援 --mode / --memory-root / --model 選項，stdin 管道輸入
- 重寫 consciousness-stream.md skill：9 phase → 5 step 匹配 token 優化結構
- 嵌入 sparsa 風險關鍵詞規則表，輸出格式對齊 report.ts
- package.json 加 bin 欄位，支援 npx/npm link
- 新增 CLI 測試（9 cases），總測試 18 cases 全通過

## 2026-03-01 — Token 優化：LLM 呼叫精簡

- LLM 呼叫數: full 8→2 次, simplified 5→1 次
- 觸（sparsa）改為規則匹配（關鍵詞偵測風險/領域），移除 LLM 依賴
- 六識+七識合併為一次 LLM 呼叫（mano 回傳含 klesaCheck），klista 改為提取器
- 八識（alaya）移除 LLM，seedAssessment 改為統計文字
- 轉智+光明心+執行合併為一次 LLM 呼叫，prabhsvara/kriya 改為提取器
- 薰習（vasana）移除 LLM，改為規則化提取 pitfalls/decisions
- 新增合併型別: ManoKlistaOutput, ParavrttiFullOutput
- pipeline.ts 呼叫鏈重構: 合併呼叫 + 拆分提取
- 測試更新: 9 cases 全通過（新增 sparsa 規則匹配 + 光明心提取測試）

## 2026-03-01 — Phase 1: 核心管線引擎實作

- 建立 TypeScript 專案骨架（package.json, tsconfig.json, 零 runtime 依賴）
- 實作核心型別系統（types.ts）：PipelineState、九層輸出型別、三種 adapter 介面
- 實作 LLM adapter（llm.ts）：PassthroughLlm + AnthropicLlm 兩種模式
- 實作記憶 adapter（memory.ts）：FileMemoryAdapter（atom 讀寫）+ NullMemoryAdapter
- 實作九層管線：
  - 觸（sparsa）：任務解析 + 風險分級 + 動態層跳過
  - 五識（panca）：自動感知收集（眼耳鼻舌身五通道）
  - 六識（mano）：LLM 三量分別（現量/比量/非量）
  - 七識（klista）：LLM 四煩惱偏見自檢
  - 八識（alaya）：記憶/種子庫檢索（atom Trigger 比對）
  - 光明心（prabhsvara）：核心原則 + 他空見校準
  - 轉智（paravtti）：四智行動計畫生成
  - 執行（kriya）：步驟規劃 + checkpoint
  - 薰習（vasana）：經驗迴寫（changelog、pitfalls、decisions）
- 實作報告格式化（report.ts）：遵循 spec 的識流報告格式
- 實作管線協調器（pipeline.ts）：full/simplified 雙模式 + forceMode + onLayerComplete
- 撰寫測試（7 cases 全通過）：Full/Simplified 模式、forceMode、callback

## 2026-02-28 — 專案初建

- 建立識流研究文件（README.md）：涵蓋八識體系、種子薰習、轉識成智、密宗光明心、他空見
- 建立架構規格書（consciousness-stream-spec.md）：九層識流管線
- 建立層次對照表（layer-mapping.md）：八識→系統層映射
- 建立 Claude Code Skill `/consciousness-stream`
- 建立 Claude Memory Atom + OpenClaw Memory Atom
- 梵文/英文交叉校驗完成（30+ 術語，Stanford/EoB/Tsadra 來源）
