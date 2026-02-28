/**
 * 識流報告格式化
 *
 * 將 PipelineState 轉換為 markdown 格式的識流報告，
 * 遵循 consciousness-stream-spec.md 定義的輸出格式。
 */

import type { PipelineState } from './types.js';

export function formatReport(state: PipelineState): string {
  const lines: string[] = [];
  const task = state.sparsa?.taskSummary ?? state.input;

  lines.push(`## 識流報告：${task}`);
  lines.push('');

  // 觸 — 任務辨識
  if (state.sparsa) {
    const s = state.sparsa;
    lines.push('### 觸 — 任務辨識');
    lines.push(`- 本質：${s.taskSummary}`);
    lines.push(`- 風險：${s.risk}`);
    lines.push(`- 涉及：${s.domains.join(', ')}`);
    lines.push(`- 模式：${s.mode}`);
    if (s.skipLayers.length > 0) {
      lines.push(`- 跳過：${s.skipLayers.join(', ')}`);
    }
    lines.push('');
  }

  // 五識 — 感知摘要
  if (state.panca) {
    const p = state.panca;
    lines.push('### 五識 — 感知摘要');
    if (p.caksur.length > 0) lines.push(`- 眼識（檔案）：${summarize(p.caksur)}`);
    if (p.srotra.length > 0) lines.push(`- 耳識（訊息）：${summarize(p.srotra)}`);
    if (p.ghrana.length > 0) lines.push(`- 鼻識（環境）：${summarize(p.ghrana)}`);
    if (p.jihva.length > 0) lines.push(`- 舌識（品質）：${summarize(p.jihva)}`);
    if (p.kaya.length > 0) lines.push(`- 身識（資源）：${summarize(p.kaya)}`);
    lines.push('');
  }

  // 六識 — 分別分析
  if (state.mano) {
    const m = state.mano;
    lines.push('### 六識 — 分別分析');
    if (m.pratyaksa.length > 0) {
      lines.push('**現量（直接事實）：**');
      m.pratyaksa.forEach(s => lines.push(`- ${s}`));
    }
    if (m.anumana.length > 0) {
      lines.push('**比量（推論）：**');
      m.anumana.forEach(s => lines.push(`- ${s}`));
    }
    if (m.nonValid.length > 0) {
      lines.push('**非量（不確定）：**');
      m.nonValid.forEach(s => lines.push(`- ${s}`));
    }
    if (m.crossRef.length > 0) {
      lines.push('**交叉比對：**');
      m.crossRef.forEach(s => lines.push(`- ${s}`));
    }
    lines.push('');
  }

  // 七識 — 自省校正
  if (state.klista) {
    const k = state.klista;
    lines.push('### 七識 — 自省校正');
    if (k.klesaCheck) {
      lines.push('**四煩惱自檢：**');
      lines.push(`- 我癡：${k.klesaCheck.avidya ?? '✓ 通過'}`);
      lines.push(`- 我見：${k.klesaCheck.atma_drsti ?? '✓ 通過'}`);
      lines.push(`- 我慢：${k.klesaCheck.atma_mana ?? '✓ 通過'}`);
      lines.push(`- 我愛：${k.klesaCheck.atma_sneha ?? '✓ 通過'}`);
    }
    if (k.relatedDecisions?.length) {
      lines.push('**既有決策：**');
      k.relatedDecisions.forEach(d => lines.push(`- ${d}`));
    }
    lines.push(`**校正判斷：** ${k.calibrated}`);
    lines.push('');
  }

  // 八識 — 種子檢索
  if (state.alaya) {
    const a = state.alaya;
    lines.push('### 八識 — 種子檢索');
    if (a.relevantAtoms?.length) {
      lines.push('**相關 atoms：**');
      a.relevantAtoms.forEach(atom =>
        lines.push(`- ${atom.title} [${atom.confidence}] — ${atom.relevant}`)
      );
    }
    if (a.pitfalls?.length) {
      lines.push('**歷史坑點：**');
      a.pitfalls.forEach(p => lines.push(`- ${p}`));
    }
    if (a.seedAssessment) lines.push(`**種子評估：** ${a.seedAssessment}`);
    lines.push('');
  }

  // 光明心 — 原則校準
  if (state.prabhsvara) {
    const pr = state.prabhsvara;
    lines.push('### 光明心 — 原則校準');
    if (pr.principleCheck) {
      const pc = pr.principleCheck;
      lines.push(`- 輕量極簡：${pc.minimal ? '✓' : '✗ 需調整'}`);
      lines.push(`- 高可讀性：${pc.readable ? '✓' : '✗ 需調整'}`);
      lines.push(`- 薄框架層：${pc.thinFramework ? '✓' : '✗ 需調整'}`);
      lines.push(`- 安全合規：${pc.secure ? '✓' : '✗ 需調整'}`);
    }
    if (pr.shentong) lines.push('**他空見校準：**');
    if (pr.shentong?.notEmpty?.length) {
      lines.push(`- 不空（善用）：${pr.shentong.notEmpty.join('、')}`);
    }
    if (pr.shentong?.empty?.length) {
      lines.push(`- 空（放下）：${pr.shentong.empty.join('、')}`);
    }
    if (pr.direction) lines.push(`**方向：** ${pr.direction}`);
    lines.push('');
  }

  // 四智 — 行動計畫
  if (state.paravtti) {
    const w = state.paravtti.wisdoms;
    lines.push('### 四智 — 行動計畫');
    if (w) {
      lines.push('');
      lines.push('| 智 | 內容 |');
      lines.push('|----|------|');
      lines.push(`| 成所作智 | ${w.krtyanusthana?.join('; ') ?? '-'} |`);
      lines.push(`| 妙觀察智 | ${w.pratyaveksana ?? '-'} |`);
      lines.push(`| 平等性智 | ${w.samata ?? '-'} |`);
      lines.push(`| 大圓鏡智 | ${w.adarsa ?? '-'} |`);
      lines.push('');
    }
    if (state.paravtti.plan?.length) {
      lines.push('**執行步驟：**');
      state.paravtti.plan.forEach(s =>
        lines.push(`${s.order}. ${s.description}${s.files?.length ? ` (${s.files.join(', ')})` : ''}`)
      );
      lines.push('');
    }
  }

  // 薰習 — 經驗迴寫
  if (state.vasana) {
    const v = state.vasana;
    lines.push('### 薰習 — 經驗迴寫');
    if (v.memoryUpdates?.length) {
      v.memoryUpdates.forEach(u => lines.push(`- ${u}`));
    } else {
      lines.push('- 無需迴寫');
    }
    lines.push('');
  }

  return lines.join('\n');
}

/** 將長字串陣列摘要化 */
function summarize(items: string[], maxLen = 100): string {
  const joined = items.join('; ');
  if (joined.length <= maxLen) return joined;
  return joined.slice(0, maxLen) + `... (共 ${items.length} 項)`;
}
