#!/usr/bin/env node
/**
 * 識流 CLI — 獨立執行識流管線
 *
 * Usage:
 *   consciousness-stream "任務描述"
 *   echo "任務描述" | consciousness-stream
 *   consciousness-stream --mode full --memory-root ./project "任務描述"
 */

import { parseArgs } from 'node:util';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, join } from 'node:path';

import { runPipeline } from './pipeline.js';
import { AnthropicLlm } from './llm.js';
import { FileMemoryAdapter, NullMemoryAdapter } from './memory.js';
import type { PerceptionAdapter, PipelineMode } from './types.js';

// ===== CLI Perception Adapter =====

const MAX_FILE_SIZE = 10 * 1024; // 10KB per file

class CliPerceptionAdapter implements PerceptionAdapter {
  constructor(private cwd: string) {}

  async readFiles(patterns: string[]): Promise<string[]> {
    const results: string[] = [];
    for (const pattern of patterns) {
      const filePath = resolve(this.cwd, pattern);
      if (!existsSync(filePath)) {
        results.push(`(檔案不存在: ${pattern})`);
        continue;
      }
      try {
        const content = readFileSync(filePath, 'utf-8');
        results.push(
          content.length > MAX_FILE_SIZE
            ? content.slice(0, MAX_FILE_SIZE) + `\n... (截斷, 原始 ${content.length} bytes)`
            : content,
        );
      } catch {
        results.push(`(無法讀取: ${pattern})`);
      }
    }
    return results;
  }

  async getEnvState(): Promise<string> {
    const parts: string[] = [`platform: ${process.platform}`];
    try {
      const branch = execSync('git branch --show-current', { cwd: this.cwd, encoding: 'utf-8' }).trim();
      const status = execSync('git status --porcelain', { cwd: this.cwd, encoding: 'utf-8' }).trim();
      parts.push(`git branch: ${branch}`);
      parts.push(`git status: ${status || '(clean)'}`);
    } catch {
      parts.push('git: not a repository');
    }
    return parts.join('\n');
  }
}

// ===== Argument Parsing =====

interface CliArgs {
  help: boolean;
  mode?: string;
  memoryRoot?: string;
  model?: string;
  task?: string;
}

export function parseCliArgs(argv?: string[]): CliArgs {
  const { values, positionals } = parseArgs({
    args: argv,
    options: {
      help: { type: 'boolean', short: 'h', default: false },
      mode: { type: 'string', short: 'm' },
      'memory-root': { type: 'string' },
      model: { type: 'string' },
    },
    allowPositionals: true,
    strict: false,
  });

  return {
    help: values.help as boolean,
    mode: values.mode as string | undefined,
    memoryRoot: values['memory-root'] as string | undefined,
    model: values.model as string | undefined,
    task: positionals[0],
  };
}

// ===== stdin =====

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return '';

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

// ===== Usage =====

function printUsage(): void {
  const usage = `
識流 CLI — Consciousness Stream Pipeline

用法:
  consciousness-stream "任務描述"
  echo "任務" | consciousness-stream
  consciousness-stream --mode full --memory-root ./project "任務"

選項:
  -m, --mode <full|simplified>  覆蓋風險判定模式
  --memory-root <path>          記憶根目錄 (預設: cwd)
  --model <model-id>            Anthropic 模型 (預設: claude-sonnet-4-20250514)
  -h, --help                    顯示此說明

環境變數:
  ANTHROPIC_API_KEY             Anthropic API Key (必要)
`.trim();
  console.log(usage);
}

// ===== Main =====

async function main(): Promise<void> {
  const args = parseCliArgs();

  if (args.help) {
    printUsage();
    return;
  }

  // Task from positional arg or stdin
  const task = args.task || await readStdin();
  if (!task) {
    printUsage();
    process.exit(1);
  }

  // API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    process.stderr.write('錯誤: 未設定 ANTHROPIC_API_KEY 環境變數\n');
    process.exit(1);
  }

  // Build adapters
  const llm = new AnthropicLlm(apiKey, args.model);
  const memoryRoot = resolve(args.memoryRoot ?? process.cwd());
  const hasAIDocs = existsSync(join(memoryRoot, '_AIDocs'));
  const memory = hasAIDocs
    ? new FileMemoryAdapter(memoryRoot)
    : new NullMemoryAdapter();
  const perception = new CliPerceptionAdapter(memoryRoot);

  process.stderr.write(`識流管線啟動 — ${task.slice(0, 60)}${task.length > 60 ? '…' : ''}\n`);

  // Run pipeline
  const result = await runPipeline(task, {
    llm,
    memory,
    perception,
    forceMode: args.mode as PipelineMode | undefined,
    onLayerComplete: (layer) => {
      process.stderr.write(`  ✓ ${layer}\n`);
    },
  });

  // Output report to stdout
  console.log(result.report);
}

// 只在直接執行時啟動（import 時不執行，供測試用）
const isMain = process.argv[1]?.replace(/\\/g, '/').endsWith('/cli.js');
if (isMain) {
  main().catch(err => {
    process.stderr.write(`錯誤: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  });
}
