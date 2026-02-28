/**
 * 識流管線協調器（Pipeline Orchestrator）
 *
 * 主入口：runPipeline(input, config) → { state, report }
 *
 * 資料流：每層接收累積的 PipelineState，產出本層結果附加其上。
 * 支援 full（九層全跑）和 simplified（觸→六識→轉智→執行→薰習）兩種模式。
 *
 * Token 優化後 LLM 呼叫：
 * - full 模式: 2 次（mano+klista, paravtti+prabhsvara+kriya）
 * - simplified 模式: 1 次（mano+klista 合併，paravtti 在 simplified 中也合併）
 * - sparsa: 規則匹配（0 LLM）
 * - alaya: 純自動（0 LLM）
 * - vasana: 規則化提取（0 LLM）
 */

import type {
  PipelineState,
  PipelineResult,
  PipelineConfig,
  LayerName,
} from './types.js';

import { runSparsa } from './layers/sparsa.js';
import { runPanca } from './layers/panca.js';
import { runManoKlista } from './layers/mano.js';
import { extractKlista } from './layers/klista.js';
import { runAlaya } from './layers/alaya.js';
import { extractPrabhsvara } from './layers/prabhsvara.js';
import { runParavrttiFull } from './layers/paravtti.js';
import { extractKriya } from './layers/kriya.js';
import { runVasana } from './layers/vasana.js';
import { formatReport } from './report.js';

/** 全模式層序 */
const FULL_LAYERS: LayerName[] = [
  'sparsa', 'panca', 'mano', 'klista',
  'alaya', 'prabhsvara', 'paravtti', 'kriya', 'vasana',
];

/** 簡化模式層序 */
const SIMPLIFIED_LAYERS: LayerName[] = [
  'sparsa', 'mano', 'paravtti', 'kriya', 'vasana',
];

/**
 * 執行識流管線
 *
 * @param input  - 任務描述
 * @param config - 管線配置（LLM、Memory、Perception adapters）
 * @returns 管線狀態 + 格式化報告
 */
export async function runPipeline(
  input: string,
  config: PipelineConfig,
): Promise<PipelineResult> {
  const state: PipelineState = { input };
  const { onLayerComplete, forceMode } = config;

  // Phase 1: 觸 — 規則匹配，不需 LLM
  state.sparsa = runSparsa(input);

  // 允許外部覆蓋模式
  if (forceMode) {
    state.sparsa.mode = forceMode;
    if (forceMode === 'simplified') {
      state.sparsa.skipLayers = ['panca', 'klista', 'alaya', 'prabhsvara'];
    } else {
      state.sparsa.skipLayers = [];
    }
  }

  onLayerComplete?.('sparsa', state);

  // 選擇層序
  const layers = state.sparsa.mode === 'simplified'
    ? SIMPLIFIED_LAYERS
    : FULL_LAYERS;

  // 逐層執行（跳過已執行的 sparsa 和標記跳過的層）
  for (const layer of layers) {
    if (layer === 'sparsa') continue;  // 已執行
    if (state.sparsa.skipLayers.includes(layer)) continue;

    await executeLayer(layer, state, config);
    onLayerComplete?.(layer, state);
  }

  return {
    state,
    report: formatReport(state),
  };
}

/** 執行單一層 */
async function executeLayer(
  layer: LayerName,
  state: PipelineState,
  config: PipelineConfig,
): Promise<void> {
  const { llm, memory, perception } = config;

  switch (layer) {
    case 'panca':
      state.panca = await runPanca(state, perception);
      break;

    case 'mano': {
      // 合併呼叫：六識+七識一次 LLM
      const manoKlista = await runManoKlista(state, llm, memory);
      // 拆分 mano 部分
      state.mano = {
        pratyaksa: manoKlista.pratyaksa,
        anumana: manoKlista.anumana,
        nonValid: manoKlista.nonValid,
        crossRef: manoKlista.crossRef,
      };
      // 如果七識不在跳過列表中，同時提取 klista
      if (!state.sparsa?.skipLayers.includes('klista')) {
        state.klista = extractKlista(manoKlista);
      }
      break;
    }

    case 'klista':
      // 已在 mano 階段一起處理，跳過
      break;

    case 'alaya':
      // 純自動，不需 LLM
      state.alaya = await runAlaya(state, memory);
      break;

    case 'paravtti': {
      // 合併呼叫：光明心+轉智+執行一次 LLM
      const fullResult = await runParavrttiFull(state, llm);
      // 如果光明心不在跳過列表中，提取 prabhsvara
      if (!state.sparsa?.skipLayers.includes('prabhsvara')) {
        state.prabhsvara = extractPrabhsvara(fullResult);
      }
      // 拆分 paravtti 部分
      state.paravtti = {
        wisdoms: fullResult.wisdoms,
        plan: fullResult.plan.map(s => ({
          order: s.order,
          description: s.description,
          files: s.files ?? [],
        })),
      };
      // 同時提取 kriya
      state.kriya = extractKriya(fullResult);
      break;
    }

    case 'prabhsvara':
      // 已在 paravtti 階段一起處理，跳過
      break;

    case 'kriya':
      // 已在 paravtti 階段一起處理，跳過
      break;

    case 'vasana':
      // 規則化提取，不需 LLM
      state.vasana = await runVasana(state, memory);
      break;
  }
}

// Re-export 核心型別和工具
export { formatReport } from './report.js';
export type { PipelineState, PipelineResult, PipelineConfig } from './types.js';
export { PassthroughLlm, AnthropicLlm } from './llm.js';
export { FileMemoryAdapter, NullMemoryAdapter } from './memory.js';
export { FilePerceptionAdapter } from './perception.js';
