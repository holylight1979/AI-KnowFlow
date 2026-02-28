#!/usr/bin/env node
/**
 * 識流 MCP Server — 透過 MCP 協定暴露識流管線
 *
 * Tools:
 *   consciousness_stream — 執行完整識流管線
 *   list_atoms           — 列出可用記憶 atoms
 *
 * Usage:
 *   consciousness-stream-mcp
 *
 * Environment:
 *   ANTHROPIC_API_KEY                  — Anthropic API Key (必要)
 *   CONSCIOUSNESS_STREAM_MEMORY_ROOT   — 記憶根目錄 (預設: cwd)
 *   CONSCIOUSNESS_STREAM_MODEL         — Anthropic 模型 (預設: claude-sonnet-4-20250514)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

import { runPipeline } from './pipeline.js';
import { AnthropicLlm } from './llm.js';
import { FileMemoryAdapter, NullMemoryAdapter } from './memory.js';
import { FilePerceptionAdapter } from './perception.js';
import type { PipelineMode, LlmAdapter, MemoryAdapter, PerceptionAdapter } from './types.js';

// ===== Adapters =====

interface Adapters {
  llm: LlmAdapter;
  memory: MemoryAdapter;
  perception: PerceptionAdapter;
}

function buildAdapters(): Adapters {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    process.stderr.write('錯誤: 未設定 ANTHROPIC_API_KEY 環境變數\n');
    process.exit(1);
  }

  const memoryRoot = resolve(
    process.env.CONSCIOUSNESS_STREAM_MEMORY_ROOT ?? process.cwd(),
  );
  const model = process.env.CONSCIOUSNESS_STREAM_MODEL;

  const llm = new AnthropicLlm(apiKey, model);
  const hasAIDocs = existsSync(join(memoryRoot, '_AIDocs'));
  const memory = hasAIDocs
    ? new FileMemoryAdapter(memoryRoot)
    : new NullMemoryAdapter();
  const perception = new FilePerceptionAdapter(memoryRoot);

  return { llm, memory, perception };
}

// ===== Tool Handlers（export 供測試用）=====

export async function handleStream(
  task: string,
  mode: string | undefined,
  adapters: Adapters,
): Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean }> {
  try {
    process.stderr.write(`識流管線啟動 — ${task.slice(0, 60)}${task.length > 60 ? '…' : ''}\n`);

    const result = await runPipeline(task, {
      ...adapters,
      forceMode: mode as PipelineMode | undefined,
      onLayerComplete: (layer) => {
        process.stderr.write(`  ✓ ${layer}\n`);
      },
    });

    return { content: [{ type: 'text', text: result.report }] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: `識流管線執行失敗: ${msg}` }],
      isError: true,
    };
  }
}

export async function handleListAtoms(
  triggers: string[],
  memory: MemoryAdapter,
): Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean }> {
  try {
    const atoms = await memory.searchAtoms(triggers);
    if (atoms.length === 0) {
      return { content: [{ type: 'text', text: '未找到匹配的 atoms。' }] };
    }

    const lines = atoms.map(
      (a) => `- ${a.title} [${a.confidence}] (trigger: ${a.trigger})`,
    );
    return { content: [{ type: 'text', text: lines.join('\n') }] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: `查詢失敗: ${msg}` }],
      isError: true,
    };
  }
}

// ===== MCP Server =====

function createServer(): McpServer {
  const server = new McpServer({
    name: 'consciousness-stream',
    version: '0.1.0',
  });

  // Tool 1: consciousness_stream — 執行識流管線
  server.registerTool(
    'consciousness_stream',
    {
      description: '執行識流管線 — 基於佛教八識體系的九層結構化分析。輸入任務描述，輸出識流報告。',
      inputSchema: {
        task: z.string().describe('任務描述'),
        mode: z.enum(['full', 'simplified']).optional()
          .describe('管線模式: full=九層全跑, simplified=簡化五層（預設由風險自動判定）'),
      },
    },
    async ({ task, mode }) => {
      const adapters = buildAdapters();
      return handleStream(task, mode, adapters);
    },
  );

  // Tool 2: list_atoms — 列出記憶 atoms
  server.registerTool(
    'list_atoms',
    {
      description: '列出識流記憶系統中的可用 atoms（原子記憶）。',
      inputSchema: {
        triggers: z.array(z.string()).optional()
          .describe('篩選觸發詞（留空列出全部）'),
      },
    },
    async ({ triggers }) => {
      const adapters = buildAdapters();
      return handleListAtoms(triggers ?? [], adapters.memory);
    },
  );

  return server;
}

export { createServer };

// ===== Main =====

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('識流 MCP Server 已啟動 (stdio)\n');
}

const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('/mcp.js');
if (isMain) {
  main().catch((err) => {
    process.stderr.write(`MCP Server 啟動失敗: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  });
}
