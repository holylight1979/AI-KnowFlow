/**
 * Phase 7: 轉識成智（Āśraya-parāvṛtti）— 生成
 *
 * 將分析結果轉化為可執行的行動計畫。
 * 四智：成所作智、妙觀察智、平等性智、大圓鏡智
 *
 * 這是認知基礎的「徹底翻轉」—
 * vijñāna（分別識）終止，被 jñāna（無分別直知）取代。
 *
 * Token 優化：合併光明心（原則校準）+ 執行（checkpoint）在同一次 LLM 呼叫中完成。
 * 回傳 ParavrttiFullOutput，由 pipeline 拆分給 prabhsvara + paravtti + kriya。
 */

import type { PipelineState, ParavrttiFullOutput, LlmAdapter } from '../types.js';

const SYSTEM_PROMPT = `你是識流管線的轉智層（Āśraya-parāvṛtti），同時執行光明心校準和執行規劃。

## 光明心 — 核心原則檢查
1. 輕量極簡？不加不必要的框架/抽象
2. 高可讀性？一個檔案看完邏輯
3. 反對過度綁定？框架層要薄
4. 安全合規？無敏感資料洩漏

## 他空見校準（Shentong Calibration）
- 「不空」= 本地能力、已有經驗 — 善用
- 「空」= 不必要的依賴、過度設計 — 放下

## 四智行動計畫
1. 成所作智（kṛtyānuṣṭhāna-jñāna）：具體行動清單
2. 妙觀察智（pratyavekṣaṇā-jñāna）：分析報告
3. 平等性智（samatā-jñāna）：影響評估
4. 大圓鏡智（ādarśa-jñāna）：全局一致性

回覆 JSON 格式：
{
  "principleCheck": { "minimal": true, "readable": true, "thinFramework": true, "secure": true },
  "shentong": { "notEmpty": ["善用1"], "empty": ["放下1"] },
  "direction": "校準後的方向摘要",
  "wisdoms": {
    "krtyanusthana": ["步驟1", "步驟2"],
    "pratyaveksana": "分析報告",
    "samata": "影響評估",
    "adarsa": "全局一致性"
  },
  "plan": [
    { "order": 1, "description": "步驟描述", "files": ["涉及檔案"], "checkpoint": "如何確認成功" }
  ]
}`;

/**
 * 執行轉智+光明心+執行合併分析
 *
 * 一次 LLM 呼叫完成原則校準 + 四智計畫 + checkpoint。
 */
export async function runParavrttiFull(
  state: PipelineState,
  llm: LlmAdapter,
): Promise<ParavrttiFullOutput> {
  const sections: string[] = [];
  sections.push(`## 任務\n${state.sparsa?.taskSummary ?? state.input}`);
  sections.push(`## 風險: ${state.sparsa?.risk ?? 'unknown'}`);

  // 彙整前面所有層的結果（防禦性存取）
  if (state.mano) {
    const m = state.mano;
    if (m.pratyaksa?.length) sections.push(`## 事實（現量）\n${m.pratyaksa.map((s: string) => `- ${s}`).join('\n')}`);
    if (m.anumana?.length) sections.push(`## 推論（比量）\n${m.anumana.map((s: string) => `- ${s}`).join('\n')}`);
    if (m.nonValid?.length) sections.push(`## 不確定（非量）\n${m.nonValid.map((s: string) => `- ${s}`).join('\n')}`);
  }

  if (state.klista) {
    const k = state.klista;
    if (k.calibrated) sections.push(`## 偏見校正\n${k.calibrated}`);
    if (k.relatedDecisions?.length) {
      sections.push(`## 既有決策\n${k.relatedDecisions.map((d: string) => `- ${d}`).join('\n')}`);
    }
  }

  if (state.alaya) {
    const a = state.alaya;
    if (a.seedAssessment) sections.push(`## 種子評估\n${a.seedAssessment}`);
    if (a.pitfalls?.length) sections.push(`## 已知坑點\n${a.pitfalls.map((p: string) => `- ${p}`).join('\n')}`);
  }

  const prompt = sections.join('\n\n') +
    '\n\n請進行核心原則檢查、他空見校準，並生成四智行動計畫（含 checkpoint）。';

  return llm.completeJson<ParavrttiFullOutput>(prompt, SYSTEM_PROMPT);
}
