/**
 * Phase 1: 觸（Sparśa）— 接觸
 *
 * 解析任務本質，判定風險等級與管線模式。
 * 三和合（根+境+識）生觸 — 是所有認知的起點。
 *
 * Token 優化：改為規則匹配，不再呼叫 LLM。
 * 風險/領域用關鍵詞判定即可，無需 LLM 推理。
 */

import type { SparsaOutput, RiskLevel, PipelineMode, LayerName } from '../types.js';

// ===== 關鍵詞規則表 =====

const RISK_RULES: Array<{ level: RiskLevel; keywords: string[] }> = [
  {
    level: 'critical',
    keywords: ['框架', '基類', '共用定義', 'breaking', 'base class', 'shared'],
  },
  {
    level: 'high',
    keywords: ['修改', '重構', '核心', '刪除', '遷移', '跨系統', 'refactor', 'delete', 'migrate', 'core'],
  },
  {
    level: 'medium',
    keywords: ['新增', '建立', '設定', '配置', 'create', 'add', 'config', 'setup'],
  },
  {
    level: 'low',
    keywords: ['讀取', '搜尋', '分析', '查看', '列出', '報告', 'read', 'search', 'analyze', 'list', 'report', 'view'],
  },
];

const DOMAIN_RULES: Array<{ domain: string; keywords: string[] }> = [
  { domain: 'code', keywords: ['程式', '函數', '類別', '模組', 'function', 'class', 'module', 'ts', 'js', 'code'] },
  { domain: 'config', keywords: ['設定', '配置', 'config', 'json', 'yaml', 'env', 'tsconfig'] },
  { domain: 'memory', keywords: ['記憶', 'atom', 'memory', 'pitfall', 'changelog', 'decision'] },
  { domain: 'docs', keywords: ['文件', '文檔', 'readme', 'doc', 'spec', 'md'] },
  { domain: 'desktop', keywords: ['桌面', 'desktop', 'electron', 'gui', 'ui'] },
  { domain: 'multi-platform', keywords: ['跨平台', '多平台', 'cross-platform', 'multi-platform'] },
  { domain: 'test', keywords: ['測試', 'test', 'spec', 'assert', 'mock'] },
];

/**
 * 執行觸層 — 任務辨識與風險分級（規則匹配版）
 *
 * 不需要 LLM，純關鍵詞匹配。
 */
export function runSparsa(input: string): SparsaOutput {
  const lower = input.toLowerCase();

  const risk = detectRisk(lower);
  const mode = deriveMode(risk);
  const domains = detectDomains(lower);
  const taskSummary = input.slice(0, 80) + (input.length > 80 ? '…' : '');
  const skipLayers = deriveSkipLayers(risk, mode);

  return { taskSummary, domains, risk, mode, skipLayers };
}

function detectRisk(lower: string): RiskLevel {
  for (const rule of RISK_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return rule.level;
    }
  }
  return 'low'; // 預設低風險
}

function detectDomains(lower: string): string[] {
  const found: string[] = [];
  for (const rule of DOMAIN_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      found.push(rule.domain);
    }
  }
  return found.length > 0 ? found : ['general'];
}

function deriveMode(risk: RiskLevel): PipelineMode {
  return risk === 'low' ? 'simplified' : 'full';
}

/**
 * 依風險等級決定跳過哪些層
 */
function deriveSkipLayers(risk: RiskLevel, mode: PipelineMode): LayerName[] {
  if (mode === 'simplified') {
    return ['panca', 'klista', 'alaya', 'prabhsvara'];
  }
  if (risk === 'medium') {
    return ['prabhsvara'];
  }
  return [];
}
