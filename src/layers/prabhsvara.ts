/**
 * Phase 6: 光明心（Prabhāsvara-citta）— 本覺
 *
 * 核心原則校準，確認方向。
 * 如同光明心 — 本然清淨，去蔽即現。
 *
 * Token 優化：改為從 paravtti 合併結果中提取，不再獨立呼叫 LLM。
 */

import type { PrabhasvaraOutput, ParavrttiFullOutput } from '../types.js';

/**
 * 從轉智合併結果中提取光明心部分
 */
export function extractPrabhsvara(merged: ParavrttiFullOutput): PrabhasvaraOutput {
  return {
    principleCheck: merged.principleCheck ?? {
      minimal: true,
      readable: true,
      thinFramework: true,
      secure: true,
    },
    shentong: merged.shentong ?? {
      notEmpty: [],
      empty: [],
    },
    direction: merged.direction ?? '方向待確認',
  };
}
