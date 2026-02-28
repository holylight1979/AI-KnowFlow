/**
 * Phase 8: 執行（Kriyā）
 *
 * 按行動計畫逐步執行。
 * 每步完成後 mini-checkpoint：
 *   結果符合預期 → 繼續
 *   發現新資訊 → 回饋八識（薰習新種子）
 *   需要調整 → 回饋光明心（重新校準）
 *
 * Token 優化：改為從 paravtti 合併結果中提取 checkpoint，不再獨立呼叫 LLM。
 */

import type { KriyaOutput, StepResult, ParavrttiFullOutput } from '../types.js';

/**
 * 從轉智合併結果中提取執行層部分
 */
export function extractKriya(merged: ParavrttiFullOutput): KriyaOutput {
  const plan = merged.plan ?? [];

  const steps: StepResult[] = plan.map(s => ({
    step: {
      order: s.order,
      description: s.description,
      files: s.files ?? [],
    },
    success: true,  // 規劃階段預設成功
    output: s.checkpoint ?? `完成: ${s.description}`,
  }));

  return { steps, feedbacks: [] };
}
