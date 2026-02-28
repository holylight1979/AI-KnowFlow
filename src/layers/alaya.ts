/**
 * Phase 5: 第八識（Ālaya-vijñāna）— 種子庫
 *
 * 從持久記憶中調取相關經驗。
 * 阿賴耶識「恆轉如瀑流」— 記憶不是靜態的，每次載入都應確認種子是否仍有效。
 *
 * 功能：載入 atoms、檢索 pitfalls、調取 changelog
 *
 * Token 優化：移除 LLM 參數，seedAssessment 改為統計文字。
 */

import type { PipelineState, AlayaOutput, MemoryAdapter } from '../types.js';

export async function runAlaya(
  state: PipelineState,
  memory: MemoryAdapter,
): Promise<AlayaOutput> {
  // 提取搜尋關鍵詞（從任務摘要和 domains）
  const triggers = extractTriggers(state);

  // 並行載入各種記憶
  const [atoms, pitfalls, changelog] = await Promise.all([
    memory.searchAtoms(triggers),
    memory.getPitfalls(),
    memory.getChangelog(8),
  ]);

  // 種子評估 — 純統計，不呼叫 LLM
  let seedAssessment: string;
  if (atoms.length > 0) {
    const counts = { '固': 0, '觀': 0, '臨': 0 };
    for (const a of atoms) {
      if (a.confidence in counts) counts[a.confidence]++;
    }
    const titles = atoms.map(a => a.title).join(', ');
    seedAssessment = `找到 ${atoms.length} 個相關 atoms [固: ${counts['固']}, 觀: ${counts['觀']}, 臨: ${counts['臨']}]: ${titles}`;
  } else {
    seedAssessment = '無相關歷史種子';
  }

  // 過濾相關 pitfalls
  const relevantPitfalls = pitfalls.filter((p: string) => {
    const lower = p.toLowerCase();
    return triggers.some(t => lower.includes(t.toLowerCase()));
  });

  return {
    relevantAtoms: atoms,
    pitfalls: relevantPitfalls.length > 0 ? relevantPitfalls : pitfalls.slice(0, 3),
    changelog,
    seedAssessment,
  };
}

/** 從管線狀態中提取搜尋觸發詞 */
function extractTriggers(state: PipelineState): string[] {
  const triggers: string[] = [];

  // 從任務摘要提取關鍵詞
  const summary = state.sparsa?.taskSummary ?? state.input;
  // 簡易中文分詞：以標點/空格分割，取長度 >= 2 的詞
  const words = summary.split(/[\s,，。！？；：、\-\+\(\)\[\]{}'"「」『』]+/)
    .filter((w: string) => w.length >= 2);
  triggers.push(...words);

  // 加入 domains
  if (state.sparsa?.domains) {
    triggers.push(...state.sparsa.domains);
  }

  // 去重
  return [...new Set(triggers)];
}
