/**
 * Phase 2: 前五識（Pañca-vijñāna）— 感知
 *
 * 收集原始資料，只感知不判斷。
 * 如同前五識的「現量」— 直接感知，不加概念分別。
 *
 * 眼識：讀取檔案         耳識：對話紀錄
 * 鼻識：環境狀態         舌識：程式碼品質
 * 身識：系統資源
 */

import type { PipelineState, PancaOutput, PerceptionAdapter } from '../types.js';

/**
 * 執行五識感知層 — 自動收集原始資料
 */
export async function runPanca(
  state: PipelineState,
  perception: PerceptionAdapter,
): Promise<PancaOutput> {
  const output: PancaOutput = {
    caksur: [],
    srotra: [],
    ghrana: [],
    jihva: [],
    kaya: [],
  };

  const domains = state.sparsa?.domains ?? [];

  // 眼識（cakṣur）— 讀取相關檔案
  const filePatterns = extractFilePatterns(state.input, domains);
  if (filePatterns.length > 0) {
    try {
      output.caksur = await perception.readFiles(filePatterns);
    } catch (e) {
      output.caksur = [`(讀取失敗: ${e instanceof Error ? e.message : String(e)})`];
    }
  }

  // 鼻識（ghrāṇa）— 環境狀態
  try {
    output.ghrana = [await perception.getEnvState()];
  } catch (e) {
    output.ghrana = [`(環境偵測失敗: ${e instanceof Error ? e.message : String(e)})`];
  }

  // 舌識（jihvā）— 程式碼品質（可選）
  if (perception.getCodeQuality && filePatterns.length > 0) {
    try {
      output.jihva = [await perception.getCodeQuality(filePatterns)];
    } catch {
      // 可選通道，靜默跳過
    }
  }

  // 身識（kāya）— 系統資源（可選）
  if (perception.getSystemResources) {
    try {
      output.kaya = [await perception.getSystemResources()];
    } catch {
      // 可選通道，靜默跳過
    }
  }

  return output;
}

/** 從輸入和 domains 中提取檔案路徑 pattern */
function extractFilePatterns(input: string, domains: string[]): string[] {
  const patterns: string[] = [];

  // 從 domains 中提取 file: 前綴
  for (const d of domains) {
    if (d.startsWith('file:')) {
      patterns.push(d.slice(5));
    }
  }

  // 從輸入文字中提取檔案路徑
  const fileRegex = /(?:^|\s)([\w./-]+\.(?:ts|js|md|json|py|cs|yaml|yml|toml))\b/g;
  let match;
  while ((match = fileRegex.exec(input)) !== null) {
    if (match[1] && !patterns.includes(match[1])) {
      patterns.push(match[1]);
    }
  }

  return patterns;
}
