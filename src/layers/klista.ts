/**
 * Phase 4: 第七識（Kliṣṭa-manas）— 自省
 *
 * 偏見檢查與身份確認。
 * 末那識恆時執我，產生四根本煩惱：我癡、我見、我慢、我愛。
 * 此層的功能是反轉這些偏見 — Anti-bias Check。
 *
 * Token 優化：改為從 mano 合併結果中提取，不再獨立呼叫 LLM。
 */

import type { KlistaOutput, ManoKlistaOutput } from '../types.js';

/**
 * 從六識+七識合併結果中提取七識部分
 */
export function extractKlista(merged: ManoKlistaOutput): KlistaOutput {
  return {
    klesaCheck: merged.klesaCheck ?? {
      avidya: null,
      atma_drsti: null,
      atma_mana: null,
      atma_sneha: null,
    },
    identity: 'consciousness-stream session',
    relatedDecisions: merged.relatedDecisions ?? [],
    calibrated: merged.calibrated ?? '無偏見，分析可信',
  };
}
