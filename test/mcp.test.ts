/**
 * MCP Server 元件測試
 *
 * 測試 MCP tool handler 邏輯（mock adapters），不需 API key。
 * 直接呼叫 export 的 handler 函式，驗證輸入輸出。
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { handleStream, handleListAtoms } from '../src/mcp.js';
import { PassthroughLlm } from '../src/llm.js';
import { NullMemoryAdapter } from '../src/memory.js';
import type { LlmAdapter, PerceptionAdapter, MemoryAdapter, AtomRef } from '../src/types.js';

// ===== Mock Adapters =====

function createMockLlm(): LlmAdapter {
  return new PassthroughLlm(async (prompt: string) => {
    if (prompt.includes('三量分別分析')) {
      return JSON.stringify({
        pratyaksa: ['事實1'],
        anumana: ['推論1'],
        nonValid: [],
        crossRef: [],
        klesaCheck: {
          avidya: null,
          atma_drsti: null,
          atma_mana: null,
          atma_sneha: null,
        },
        relatedDecisions: [],
        calibrated: '分析可信',
      });
    }
    if (prompt.includes('四智行動計畫')) {
      return JSON.stringify({
        principleCheck: { minimal: true, readable: true, thinFramework: true, secure: true },
        shentong: { notEmpty: ['本地能力'], empty: [] },
        direction: '方向正確',
        wisdoms: {
          krtyanusthana: ['步驟1'],
          pratyaveksana: '分析',
          samata: '影響小',
          adarsa: '一致',
        },
        plan: [{ order: 1, description: '執行', files: [] }],
      });
    }
    return '{}';
  });
}

function createMockPerception(): PerceptionAdapter {
  return {
    async readFiles(patterns: string[]) { return patterns.map(p => `(mock: ${p})`); },
    async getEnvState() { return 'platform: test'; },
  };
}

function createMockAdapters() {
  return {
    llm: createMockLlm(),
    memory: new NullMemoryAdapter(),
    perception: createMockPerception(),
  };
}

// ===== Tests =====

describe('MCP Tool: consciousness_stream', () => {

  it('應回傳識流報告', async () => {
    const result = await handleStream('修改核心邏輯', undefined, createMockAdapters());
    assert.equal(result.isError, undefined);
    assert.equal(result.content.length, 1);
    assert.ok(result.content[0].text.includes('識流報告'));
  });

  it('應尊重 mode 覆蓋', async () => {
    const result = await handleStream('讀取檔案', 'full', createMockAdapters());
    assert.ok(result.content[0].text.includes('full'));
  });

  it('simplified 模式應正常運作', async () => {
    const result = await handleStream('讀取檔案', 'simplified', createMockAdapters());
    assert.ok(result.content[0].text.includes('識流報告'));
    // simplified 模式不應包含五識
    assert.ok(!result.content[0].text.includes('五識 — 感知摘要'));
  });

  it('LLM 錯誤時應回傳 isError', async () => {
    const brokenLlm = new PassthroughLlm(async () => { throw new Error('API 失敗'); });
    const result = await handleStream('任務', undefined, {
      llm: brokenLlm,
      memory: new NullMemoryAdapter(),
      perception: createMockPerception(),
    });
    assert.equal(result.isError, true);
    assert.ok(result.content[0].text.includes('執行失敗'));
    assert.ok(result.content[0].text.includes('API 失敗'));
  });
});

describe('MCP Tool: list_atoms', () => {

  it('NullMemory 時應回傳空訊息', async () => {
    const result = await handleListAtoms([], new NullMemoryAdapter());
    assert.ok(result.content[0].text.includes('未找到'));
    assert.equal(result.isError, undefined);
  });

  it('有 atoms 時應列出', async () => {
    const mockMemory = new NullMemoryAdapter();
    mockMemory.searchAtoms = async (): Promise<AtomRef[]> => [{
      path: 'test.md',
      title: '測試 Atom',
      confidence: '固',
      trigger: '測試',
      relevant: 'matched',
    }];
    const result = await handleListAtoms(['測試'], mockMemory);
    assert.ok(result.content[0].text.includes('測試 Atom'));
    assert.ok(result.content[0].text.includes('[固]'));
  });

  it('Memory 錯誤時應回傳 isError', async () => {
    const brokenMemory = new NullMemoryAdapter();
    brokenMemory.searchAtoms = async () => { throw new Error('磁碟錯誤'); };
    const result = await handleListAtoms(['test'], brokenMemory);
    assert.equal(result.isError, true);
    assert.ok(result.content[0].text.includes('查詢失敗'));
  });
});
