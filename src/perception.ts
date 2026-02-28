/**
 * 感知 Adapter — 檔案系統 + 環境偵測
 *
 * CLI 和 MCP 共用。
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import type { PerceptionAdapter } from './types.js';

const MAX_FILE_SIZE = 10 * 1024; // 10KB per file

export class FilePerceptionAdapter implements PerceptionAdapter {
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
