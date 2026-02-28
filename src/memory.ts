/**
 * Memory Adapter — 檔案系統記憶整合
 *
 * 讀寫 atoms、pitfalls、decisions、changelog。
 * 遵循 OpenClaw 原子記憶格式。
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, appendFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { MemoryAdapter, AtomRef, Confidence } from './types.js';

/** 解析 atom metadata 的簡易 parser */
function parseAtomMeta(content: string): {
  title: string;
  confidence: Confidence;
  trigger: string;
} {
  const titleMatch = content.match(/^#\s+(?:Atom:\s*)?(.+)/m);
  const confMatch = content.match(/Confidence:\s*\[([固觀臨])\]/);
  const triggerMatch = content.match(/Trigger:\s*(.+)/);

  return {
    title: titleMatch?.[1]?.trim() ?? '(untitled)',
    confidence: (confMatch?.[1] as Confidence) ?? '臨',
    trigger: triggerMatch?.[1]?.trim() ?? '',
  };
}

/** 遞迴掃描目錄中的 .md 檔案 */
function walkMd(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      results.push(...walkMd(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full);
    }
  }

  return results;
}

/**
 * 基於檔案系統的記憶 adapter。
 * 直接讀寫 markdown 檔案，相容 OpenClaw atoms 格式。
 */
export class FileMemoryAdapter implements MemoryAdapter {
  constructor(
    private basePath: string,     // workspace 根路徑
    private atomsPath?: string,   // atoms 目錄（預設 basePath/atoms 或 basePath）
  ) {
    this.atomsPath = atomsPath ?? basePath;
  }

  private resolveAtoms(): string {
    return this.atomsPath!;
  }

  async searchAtoms(triggers: string[]): Promise<AtomRef[]> {
    const atomDir = this.resolveAtoms();
    const files = walkMd(atomDir);
    const results: AtomRef[] = [];
    const lowerTriggers = triggers.map(t => t.toLowerCase());

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const meta = parseAtomMeta(content);

      if (!meta.trigger) continue;

      // Trigger 欄位的關鍵詞比對
      const atomTriggers = meta.trigger.toLowerCase().split(/[,、，;；]+/).map(s => s.trim());
      const matched = lowerTriggers.some(t =>
        atomTriggers.some(at => at.includes(t) || t.includes(at))
      );

      if (matched) {
        results.push({
          path: relative(atomDir, file),
          title: meta.title,
          confidence: meta.confidence,
          trigger: meta.trigger,
          relevant: `Trigger matched: ${triggers.join(', ')}`,
        });
      }
    }

    return results;
  }

  async readAtom(path: string): Promise<string> {
    const full = join(this.resolveAtoms(), path);
    if (!existsSync(full)) {
      throw new Error(`Atom not found: ${full}`);
    }
    return readFileSync(full, 'utf-8');
  }

  async getPitfalls(): Promise<string[]> {
    return this.readListFile('pitfalls.md');
  }

  async getChangelog(limit = 8): Promise<string[]> {
    const clPath = this.findFile('_CHANGELOG.md', '_AIDocs/_CHANGELOG.md');
    if (!clPath) return [];

    const content = readFileSync(clPath, 'utf-8');
    // 以 ## 開頭的段落為各條目
    const entries = content.split(/^## /m).slice(1).map((s: string) => s.trim());
    return entries.slice(0, limit);
  }

  async getDecisions(): Promise<string[]> {
    return this.readListFile('decisions.md');
  }

  async writeAtom(path: string, content: string): Promise<void> {
    const full = join(this.resolveAtoms(), path);
    writeFileSync(full, content, 'utf-8');
  }

  async appendChangelog(entry: string): Promise<void> {
    const clPath = this.findFile('_CHANGELOG.md', '_AIDocs/_CHANGELOG.md');
    if (!clPath) return;

    const content = readFileSync(clPath, 'utf-8');
    const lines = content.split('\n');

    // 在標題行之後插入新條目
    const headerEnd = lines.findIndex((l: string, i: number) => i > 0 && l.startsWith('## '));
    const insertAt = headerEnd === -1 ? lines.length : headerEnd;

    const date = new Date().toISOString().slice(0, 10);
    const newEntry = `\n## ${date} — ${entry}\n`;
    lines.splice(insertAt, 0, newEntry);

    writeFileSync(clPath, lines.join('\n'), 'utf-8');
  }

  async appendPitfall(entry: string): Promise<void> {
    const path = this.findFile('pitfalls.md');
    if (path) {
      appendFileSync(path, `\n- ${entry}\n`, 'utf-8');
    }
  }

  async appendDecision(entry: string): Promise<void> {
    const path = this.findFile('decisions.md');
    if (path) {
      appendFileSync(path, `\n- [臨] ${entry}\n`, 'utf-8');
    }
  }

  // --- 內部工具 ---

  private findFile(...candidates: string[]): string | null {
    for (const c of candidates) {
      // 在 basePath 和 atomsPath 下搜尋
      for (const base of [this.basePath, this.resolveAtoms()]) {
        const full = join(base, c);
        if (existsSync(full)) return full;
      }
      // 搜尋 global/ 子目錄
      const globalPath = join(this.resolveAtoms(), 'global', c);
      if (existsSync(globalPath)) return globalPath;
    }
    return null;
  }

  private readListFile(filename: string): string[] {
    const path = this.findFile(filename);
    if (!path) return [];

    const content = readFileSync(path, 'utf-8');
    // 提取 ## 知識 或 ## 內容 區塊下的列表項
    const knowledgeMatch = content.match(/## (?:知識|內容|Knowledge)\n([\s\S]*?)(?=\n## |$)/);
    const block = knowledgeMatch?.[1] ?? content;

    return block
      .split('\n')
      .filter((l: string) => l.startsWith('- '))
      .map((l: string) => l.slice(2).trim());
  }
}

/**
 * Null Memory Adapter — 用於測試或無記憶場景
 */
export class NullMemoryAdapter implements MemoryAdapter {
  async searchAtoms(): Promise<AtomRef[]> { return []; }
  async readAtom(): Promise<string> { return ''; }
  async getPitfalls(): Promise<string[]> { return []; }
  async getChangelog(): Promise<string[]> { return []; }
  async getDecisions(): Promise<string[]> { return []; }
  async writeAtom(): Promise<void> { /* noop */ }
  async appendChangelog(): Promise<void> { /* noop */ }
  async appendPitfall(): Promise<void> { /* noop */ }
  async appendDecision(): Promise<void> { /* noop */ }
}
