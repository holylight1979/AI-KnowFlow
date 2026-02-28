/**
 * Phase 9: 薰習（Vāsanā）— 經驗迴寫
 *
 * 將本次經驗回存記憶系統，完成識流循環。
 * 如同「種子生現行，現行薰種子」— 三法展轉，因果同時。
 * 每次執行都是學習，每次學習都強化未來的執行。
 *
 * Token 優化：移除 LLM，改為規則化提取。
 * - mano.nonValid 中包含「坑」「問題」「風險」→ pitfalls
 * - klista.klesaCheck 非 null 項 → decisions
 * - changelog 已自動生成
 */

import type { PipelineState, VasanaOutput, MemoryAdapter } from '../types.js';

/**
 * 執行薰習層 — 經驗迴寫（規則化版）
 *
 * 從管線狀態中以規則提取需要記錄的新知識，回寫到記憶系統。
 */
export async function runVasana(
  state: PipelineState,
  memory: MemoryAdapter,
): Promise<VasanaOutput> {
  const output: VasanaOutput = {
    atomUpdates: [],
    pitfallUpdates: [],
    decisionUpdates: [],
    changelogEntry: '',
    memoryUpdates: [],
  };

  const date = new Date().toISOString().slice(0, 10);

  // 1. 生成 changelog 條目
  output.changelogEntry = generateChangelogEntry(state, date);
  if (output.changelogEntry) {
    await memory.appendChangelog(output.changelogEntry);
  }

  // 2. 規則化提取 pitfalls — 從非量中找含「坑」「問題」「風險」「bug」「error」的項
  const pitfallKeywords = ['坑', '問題', '風險', '錯誤', 'bug', 'error', 'issue', 'warning', '失敗'];
  if (state.mano?.nonValid?.length) {
    for (const item of state.mano.nonValid) {
      const lower = item.toLowerCase();
      if (pitfallKeywords.some(kw => lower.includes(kw))) {
        await memory.appendPitfall(`${date} — ${item}`);
        output.pitfallUpdates.push(item);
      }
    }
  }

  // 3. 規則化提取 decisions — 從七識四煩惱自檢中找非 null 項
  if (state.klista?.klesaCheck) {
    const k = state.klista.klesaCheck;
    const biasEntries: Array<[string, string | null]> = [
      ['我癡', k.avidya],
      ['我見', k.atma_drsti],
      ['我慢', k.atma_mana],
      ['我愛', k.atma_sneha],
    ];
    for (const [label, value] of biasEntries) {
      if (value) {
        const decision = `偏見修正（${label}）: ${value}`;
        await memory.appendDecision(`${date} — ${decision}`);
        output.decisionUpdates.push(decision);
      }
    }
  }

  // 4. 記錄記憶更新摘要
  output.memoryUpdates = [
    output.changelogEntry ? `CHANGELOG: ${output.changelogEntry}` : '',
    ...output.pitfallUpdates.map((p: string) => `PITFALL: ${p}`),
    ...output.decisionUpdates.map((d: string) => `DECISION: ${d}`),
  ].filter(Boolean);

  return output;
}

function generateChangelogEntry(state: PipelineState, _date: string): string {
  const task = state.sparsa?.taskSummary ?? state.input;
  const risk = state.sparsa?.risk ?? 'unknown';
  const mode = state.sparsa?.mode ?? 'unknown';

  const parts = [`識流處理 [${risk}/${mode}]: ${task}`];

  if (state.paravtti?.plan && state.paravtti.plan.length > 0) {
    parts.push(`行動: ${state.paravtti.plan.map(s => s.description).join('; ')}`);
  }

  return parts.join('\n- ');
}
