/**
 * 識流管線測試
 *
 * Token 優化後：mock LLM 只需匹配 2 個 prompt
 * - 六識+七識合併（三量分別分析 + 四煩惱自檢）
 * - 轉智+光明心+執行合併（四智行動計畫 + 原則校準 + checkpoint）
 *
 * sparsa 改為規則匹配，alaya / vasana 純自動，不需 LLM。
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runPipeline } from '../src/pipeline.js';
import { PassthroughLlm } from '../src/llm.js';
import { NullMemoryAdapter } from '../src/memory.js';
import type { LlmAdapter, PerceptionAdapter, PipelineConfig, LayerName } from '../src/types.js';

// ===== Mock Adapters =====

/** Mock LLM — 只需匹配 2 個 prompt（六識+七識、轉智+光明心+執行） */
function createMockLlm(): LlmAdapter {
  return new PassthroughLlm(async (prompt: string, _system?: string) => {
    // 六識+七識合併
    if (prompt.includes('三量分別分析')) {
      return JSON.stringify({
        pratyaksa: ['事實1: 檔案存在', '事實2: 使用 TypeScript'],
        anumana: ['推論1: 需要型別檢查（依據：TypeScript 專案）'],
        nonValid: ['不確定: 是否有現成工具可用'],
        crossRef: ['與 _AIDocs 比對: 無衝突'],
        klesaCheck: {
          avidya: null,
          atma_drsti: null,
          atma_mana: null,
          atma_sneha: null,
        },
        relatedDecisions: ['決策1: 使用零依賴架構'],
        calibrated: '無偏見，分析可信',
      });
    }

    // 轉智+光明心+執行合併
    if (prompt.includes('四智行動計畫')) {
      return JSON.stringify({
        principleCheck: {
          minimal: true,
          readable: true,
          thinFramework: true,
          secure: true,
        },
        shentong: {
          notEmpty: ['本地型別系統', '現有 atom 格式'],
          empty: ['不必要的 bundler'],
        },
        direction: '方向正確，保持簡約',
        wisdoms: {
          krtyanusthana: ['步驟1: 建立檔案', '步驟2: 寫入邏輯'],
          pratyaveksana: '基於現有架構擴展，不引入新依賴',
          samata: '影響範圍限於本專案',
          adarsa: '與整體架構一致',
        },
        plan: [
          { order: 1, description: '建立核心檔案', files: ['src/main.ts'], checkpoint: '檔案存在' },
          { order: 2, description: '寫入邏輯', files: ['src/logic.ts'], checkpoint: '測試通過' },
        ],
      });
    }

    return '{}';
  });
}

/** Mock Perception */
function createMockPerception(): PerceptionAdapter {
  return {
    async readFiles(patterns: string[]): Promise<string[]> {
      return patterns.map(p => `(mock content of ${p})`);
    },
    async getEnvState(): Promise<string> {
      return 'git: clean, platform: win32';
    },
  };
}

function createConfig(llm: LlmAdapter): PipelineConfig {
  return {
    llm,
    memory: new NullMemoryAdapter(),
    perception: createMockPerception(),
  };
}

// ===== Tests =====

describe('識流管線（Token 優化版）', () => {

  describe('Full 模式（高風險 — 含「修改」「核心」關鍵詞）', () => {
    it('應執行全部九層', async () => {
      const llm = createMockLlm();
      const layersExecuted: LayerName[] = [];

      const config: PipelineConfig = {
        ...createConfig(llm),
        onLayerComplete: (layer) => layersExecuted.push(layer),
      };

      // 包含「修改」「核心」觸發 high 風險 → full 模式
      const result = await runPipeline('修改核心業務邏輯', config);

      // 驗證所有層都被執行
      assert.ok(result.state.sparsa, '觸層應產出結果');
      assert.ok(result.state.panca, '五識層應產出結果');
      assert.ok(result.state.mano, '六識層應產出結果');
      assert.ok(result.state.klista, '七識層應產出結果');
      assert.ok(result.state.alaya, '八識層應產出結果');
      assert.ok(result.state.prabhsvara, '光明心層應產出結果');
      assert.ok(result.state.paravtti, '轉智層應產出結果');
      assert.ok(result.state.kriya, '執行層應產出結果');
      assert.ok(result.state.vasana, '薰習層應產出結果');

      // 驗證規則匹配的風險判定
      assert.equal(result.state.sparsa!.risk, 'high');
      assert.equal(result.state.sparsa!.mode, 'full');
    });

    it('應產出格式化報告', async () => {
      const config = createConfig(createMockLlm());
      const result = await runPipeline('修改核心業務邏輯', config);

      assert.ok(result.report.includes('識流報告'), '報告應包含標題');
      assert.ok(result.report.includes('觸 — 任務辨識'), '報告應包含觸層');
      assert.ok(result.report.includes('六識 — 分別分析'), '報告應包含六識層');
      assert.ok(result.report.includes('四智 — 行動計畫'), '報告應包含四智');
      assert.ok(result.report.includes('薰習 — 經驗迴寫'), '報告應包含薰習');
    });

    it('六識應區分三量', async () => {
      const config = createConfig(createMockLlm());
      const result = await runPipeline('修改核心業務邏輯', config);

      const mano = result.state.mano!;
      assert.ok(mano.pratyaksa.length > 0, '應有現量');
      assert.ok(mano.anumana.length > 0, '應有比量');
      assert.ok(mano.nonValid.length > 0, '應有非量');
    });

    it('七識應進行四煩惱自檢（從合併結果提取）', async () => {
      const config = createConfig(createMockLlm());
      const result = await runPipeline('修改核心業務邏輯', config);

      const klista = result.state.klista!;
      assert.ok('avidya' in klista.klesaCheck, '應檢查我癡');
      assert.ok('atma_drsti' in klista.klesaCheck, '應檢查我見');
      assert.ok('atma_mana' in klista.klesaCheck, '應檢查我慢');
      assert.ok('atma_sneha' in klista.klesaCheck, '應檢查我愛');
      assert.equal(klista.calibrated, '無偏見，分析可信');
    });

    it('光明心應從轉智合併結果提取', async () => {
      const config = createConfig(createMockLlm());
      const result = await runPipeline('修改核心業務邏輯', config);

      const pr = result.state.prabhsvara!;
      assert.ok(pr.principleCheck.minimal, '應檢查輕量極簡');
      assert.ok(pr.shentong.notEmpty.length > 0, '應有不空項');
      assert.ok(pr.direction, '應有方向');
    });
  });

  describe('Simplified 模式（低風險 — 含「讀取」關鍵詞）', () => {
    it('應跳過五識、七識、八識、光明心', async () => {
      const llm = createMockLlm();
      const layersExecuted: LayerName[] = [];

      const config: PipelineConfig = {
        ...createConfig(llm),
        onLayerComplete: (layer) => layersExecuted.push(layer),
      };

      // 包含「讀取」觸發 low 風險 → simplified 模式
      const result = await runPipeline('讀取 README.md', config);

      assert.equal(result.state.sparsa?.mode, 'simplified');
      assert.equal(result.state.panca, undefined, '五識應被跳過');
      assert.equal(result.state.klista, undefined, '七識應被跳過');
      assert.equal(result.state.alaya, undefined, '八識應被跳過');
      assert.equal(result.state.prabhsvara, undefined, '光明心應被跳過');

      // 但這些層應該執行
      assert.ok(result.state.sparsa, '觸層應執行');
      assert.ok(result.state.mano, '六識應執行');
      assert.ok(result.state.paravtti, '轉智應執行');
      assert.ok(result.state.kriya, '執行層應執行');
      assert.ok(result.state.vasana, '薰習應執行');
    });
  });

  describe('sparsa 規則匹配', () => {
    it('應正確判定風險等級', async () => {
      const config = createConfig(createMockLlm());

      // critical
      const r1 = await runPipeline('修改框架基類定義', config);
      assert.equal(r1.state.sparsa!.risk, 'critical');

      // high
      const r2 = await runPipeline('重構核心模組', config);
      assert.equal(r2.state.sparsa!.risk, 'high');

      // medium
      const r3 = await runPipeline('新增設定檔', config);
      assert.equal(r3.state.sparsa!.risk, 'medium');

      // low
      const r4 = await runPipeline('分析程式碼結構', config);
      assert.equal(r4.state.sparsa!.risk, 'low');
    });
  });

  describe('forceMode 覆蓋', () => {
    it('應允許外部強制 full 模式', async () => {
      const llm = createMockLlm();
      const config: PipelineConfig = {
        ...createConfig(llm),
        forceMode: 'full',
      };

      // 「讀取」觸發 low，但 forceMode 覆蓋為 full
      const result = await runPipeline('讀取 README.md', config);
      assert.equal(result.state.sparsa?.mode, 'full');
    });
  });

  describe('onLayerComplete callback', () => {
    it('應在每層完成時呼叫', async () => {
      const llm = createMockLlm();
      const callbacks: string[] = [];

      const config: PipelineConfig = {
        ...createConfig(llm),
        onLayerComplete: (layer) => callbacks.push(layer),
      };

      await runPipeline('讀取檔案', config);

      assert.ok(callbacks.includes('sparsa'), '應回報觸層');
      assert.ok(callbacks.includes('mano'), '應回報六識');
      assert.ok(callbacks.includes('vasana'), '應回報薰習');
    });
  });
});
