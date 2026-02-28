/**
 * 識流引擎型別定義
 * Consciousness Stream Engine — Type Definitions
 *
 * 基於佛教唯識學八識體系的九層結構化處理管線
 */

// ===== 基礎列舉 =====

/** 風險等級 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/** 管線模式: full = 九層全跑, simplified = 觸→六識→轉智→執行→薰習 */
export type PipelineMode = 'full' | 'simplified';

/** 三量分類 (Triple Validation) */
export type Pramana = 'pratyaksa' | 'anumana' | 'non-valid';
// pratyaksa = 現量（直接事實）
// anumana  = 比量（合理推論）
// non-valid = 非量（不確定/錯誤）

/** 原子記憶信心度 */
export type Confidence = '固' | '觀' | '臨';

/** 管線層名稱 */
export type LayerName =
  | 'sparsa'      // 觸
  | 'panca'       // 五識
  | 'mano'        // 六識
  | 'klista'      // 七識
  | 'alaya'       // 八識
  | 'prabhsvara'  // 光明心
  | 'paravtti'    // 轉智
  | 'kriya'       // 執行
  | 'vasana';     // 薰習

// ===== 各層輸出型別 =====

/** Phase 1: 觸（Sparśa）— 接觸 */
export interface SparsaOutput {
  taskSummary: string;
  domains: string[];
  risk: RiskLevel;
  mode: PipelineMode;
  skipLayers: LayerName[];
}

/** Phase 2: 前五識（Pañca-vijñāna）— 感知 */
export interface PancaOutput {
  caksur: string[];   // 眼識：檔案內容、視覺輸入
  srotra: string[];   // 耳識：對話紀錄、訊息
  ghrana: string[];   // 鼻識：環境狀態（git status 等）
  jihva: string[];    // 舌識：程式碼品質
  kaya: string[];     // 身識：系統資源
}

/** Phase 3: 第六識（Mano-vijñāna）— 分別 */
export interface ManoOutput {
  pratyaksa: string[];  // 現量：直接觀察到的事實
  anumana: string[];    // 比量：基於事實的推論
  nonValid: string[];   // 非量：不確定或可能錯誤
  crossRef: string[];   // 交叉比對 _AIDocs 結果
}

/** 四煩惱自檢 */
export interface KlesaCheck {
  avidya: string | null;      // 我癡：不知裝知？
  atma_drsti: string | null;  // 我見：技術執著？
  atma_mana: string | null;   // 我慢：高估自己？
  atma_sneha: string | null;  // 我愛：偏袒舊作？
}

/** Phase 4: 第七識（Kliṣṭa-manas）— 自省 */
export interface KlistaOutput {
  klesaCheck: KlesaCheck;
  identity: string;
  relatedDecisions: string[];
  calibrated: string;
}

/** Atom 參照 */
export interface AtomRef {
  path: string;
  title: string;
  confidence: Confidence;
  trigger: string;
  relevant: string;  // 為何與當前任務相關
}

/** Phase 5: 第八識（Ālaya-vijñāna）— 種子庫 */
export interface AlayaOutput {
  relevantAtoms: AtomRef[];
  pitfalls: string[];
  changelog: string[];
  seedAssessment: string;
}

/** Phase 6: 光明心（Prabhāsvara-citta）— 本覺 */
export interface PrabhasvaraOutput {
  principleCheck: {
    minimal: boolean;     // 輕量極簡？
    readable: boolean;    // 高可讀性？
    thinFramework: boolean; // 反對過度綁定？
    secure: boolean;      // 安全合規？
  };
  shentong: {
    notEmpty: string[];   // 不空：善用本地能力
    empty: string[];      // 空：放下過度依賴
  };
  direction: string;
}

/** 四智 */
export interface FourWisdoms {
  krtyanusthana: string[];  // 成所作智：具體行動清單
  pratyaveksana: string;    // 妙觀察智：分析報告
  samata: string;           // 平等性智：影響評估
  adarsa: string;           // 大圓鏡智：全局一致性
}

/** 行動步驟 */
export interface ActionStep {
  order: number;
  description: string;
  files: string[];
}

/** Phase 7: 轉智（Āśraya-parāvṛtti）— 生成 */
export interface ParavrttiOutput {
  wisdoms: FourWisdoms;
  plan: ActionStep[];
}

// ===== 合併型別（Token 優化用）=====

/** 六識+七識合併輸出 — 一次 LLM 呼叫同時取得 */
export interface ManoKlistaOutput extends ManoOutput {
  klesaCheck: KlesaCheck;
  relatedDecisions: string[];
  calibrated: string;
}

/** 轉智+光明心+執行合併輸出 — 一次 LLM 呼叫同時取得 */
export interface ParavrttiFullOutput {
  principleCheck: PrabhasvaraOutput['principleCheck'];
  shentong: PrabhasvaraOutput['shentong'];
  direction: string;
  wisdoms: FourWisdoms;
  plan: Array<ActionStep & { checkpoint?: string }>;
}

/** 步驟執行結果 */
export interface StepResult {
  step: ActionStep;
  success: boolean;
  output: string;
  newInfo?: string;
}

/** 執行中回饋 */
export interface Feedback {
  type: 'new_seed' | 'recalibrate';
  targetLayer: LayerName;
  detail: string;
}

/** Phase 8: 執行（Kriyā） */
export interface KriyaOutput {
  steps: StepResult[];
  feedbacks: Feedback[];
}

/** Phase 9: 薰習（Vāsanā）— 經驗迴寫 */
export interface VasanaOutput {
  atomUpdates: string[];
  pitfallUpdates: string[];
  decisionUpdates: string[];
  changelogEntry: string;
  memoryUpdates: string[];
}

// ===== 管線狀態 =====

/** 管線累積狀態 — 每層產出附加其上 */
export interface PipelineState {
  input: string;
  sparsa?: SparsaOutput;
  panca?: PancaOutput;
  mano?: ManoOutput;
  klista?: KlistaOutput;
  alaya?: AlayaOutput;
  prabhsvara?: PrabhasvaraOutput;
  paravtti?: ParavrttiOutput;
  kriya?: KriyaOutput;
  vasana?: VasanaOutput;
}

/** 管線執行結果 */
export interface PipelineResult {
  state: PipelineState;
  report: string;
}

// ===== Adapter 介面 =====

/** LLM 呼叫介面 — 極薄抽象，支援多種 backend */
export interface LlmAdapter {
  /** 自由文字完成 */
  complete(prompt: string, systemPrompt?: string): Promise<string>;
  /** 結構化 JSON 完成 */
  completeJson<T>(prompt: string, systemPrompt?: string): Promise<T>;
}

/** 記憶系統介面 — 讀寫 atoms、pitfalls、changelog */
export interface MemoryAdapter {
  searchAtoms(triggers: string[]): Promise<AtomRef[]>;
  readAtom(path: string): Promise<string>;
  getPitfalls(): Promise<string[]>;
  getChangelog(limit?: number): Promise<string[]>;
  getDecisions(): Promise<string[]>;
  writeAtom(path: string, content: string): Promise<void>;
  appendChangelog(entry: string): Promise<void>;
  appendPitfall(entry: string): Promise<void>;
  appendDecision(entry: string): Promise<void>;
}

/** 感知系統介面 — 五識資料收集 */
export interface PerceptionAdapter {
  /** 眼識：讀取檔案 */
  readFiles(patterns: string[]): Promise<string[]>;
  /** 鼻識：環境狀態 */
  getEnvState(cwd?: string): Promise<string>;
  /** 舌識：程式碼品質（可選） */
  getCodeQuality?(paths: string[]): Promise<string>;
  /** 身識：系統資源（可選） */
  getSystemResources?(): Promise<string>;
}

// ===== 管線配置 =====

/** 管線配置 */
export interface PipelineConfig {
  llm: LlmAdapter;
  memory: MemoryAdapter;
  perception: PerceptionAdapter;
  /** 每層完成時的 callback */
  onLayerComplete?: (layer: LayerName, state: PipelineState) => void;
  /** 覆蓋管線模式（不由觸層判定） */
  forceMode?: PipelineMode;
}
