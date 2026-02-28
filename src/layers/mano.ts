/**
 * Phase 3: 第六識（Mano-vijñāna）— 分別
 *
 * 對原始感知進行分析、分類、推理。
 * 第六識「力用最強」，但也最容易出錯（有「非量」）。
 * 必須明確區分「事實、推論、不確定」。
 *
 * 三量：現量（pratyakṣa）、比量（anumāna）、非量
 *
 * Token 優化：合併七識（四煩惱自檢）在同一次 LLM 呼叫中完成。
 * 回傳 ManoKlistaOutput，由 pipeline 拆分給 mano + klista。
 */

import type { PipelineState, ManoKlistaOutput, LlmAdapter, MemoryAdapter } from '../types.js';

const SYSTEM_PROMPT = `你是識流管線的第六識（Mano-vijñāna）分別層，同時執行第七識（Kliṣṭa-manas）自省。

## 三量分別
- 現量（pratyakṣa）：直接觀察到的事實，不加任何推測
- 比量（anumāna）：基於事實的合理推論，必須標明推論依據
- 非量：不確定、可能錯誤的假設，必須明確標記

## 四煩惱自檢
1. 我癡（avidyā）：有沒有不知道但假裝知道的？
2. 我見（ātma-dṛṣṭi）：有沒有執著於特定技術/方案？
3. 我慢（ātma-māna）：有沒有高估能力、低估外部資源？
4. 我愛（ātma-sneha）：有沒有偏袒舊作？

回覆 JSON 格式：
{
  "pratyaksa": ["事實1", "事實2"],
  "anumana": ["推論1（依據：XX）"],
  "nonValid": ["不確定項1"],
  "crossRef": ["與既有知識的比對結果"],
  "klesaCheck": {
    "avidya": "發現的問題（null 表示通過）",
    "atma_drsti": null,
    "atma_mana": null,
    "atma_sneha": null
  },
  "relatedDecisions": ["相關的既有決策"],
  "calibrated": "校正後的判斷摘要"
}`;

/**
 * 執行六識+七識合併分析
 *
 * 一次 LLM 呼叫完成三量分別 + 四煩惱自檢。
 */
export async function runManoKlista(
  state: PipelineState,
  llm: LlmAdapter,
  memory: MemoryAdapter,
): Promise<ManoKlistaOutput> {
  const sections: string[] = [];

  sections.push(`## 任務\n${state.sparsa?.taskSummary ?? state.input}`);

  // 如果有五識感知（full 模式），附上原始資料
  if (state.panca) {
    const p = state.panca;
    if (p.caksur.length > 0) sections.push(`## 眼識（檔案）\n${p.caksur.join('\n---\n')}`);
    if (p.ghrana.length > 0) sections.push(`## 鼻識（環境）\n${p.ghrana.join('\n')}`);
    if (p.jihva.length > 0) sections.push(`## 舌識（品質）\n${p.jihva.join('\n')}`);
    if (p.kaya.length > 0) sections.push(`## 身識（資源）\n${p.kaya.join('\n')}`);
  }

  // 載入既有決策供七識參考
  const decisions = await memory.getDecisions();
  if (decisions.length > 0) {
    sections.push(`## 既有決策\n${decisions.map((d: string) => `- ${d}`).join('\n')}`);
  }

  const prompt = sections.join('\n\n') +
    '\n\n請進行三量分別分析，同時執行四煩惱自檢。';

  return llm.completeJson<ManoKlistaOutput>(prompt, SYSTEM_PROMPT);
}
