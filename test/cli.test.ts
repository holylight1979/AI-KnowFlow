/**
 * CLI 元件測試
 *
 * 測試 CliPerceptionAdapter 和 parseCliArgs，不需 API key。
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parseCliArgs } from '../src/cli.js';

// ===== parseCliArgs =====

describe('parseCliArgs', () => {
  it('應解析 --help 旗標', () => {
    const args = parseCliArgs(['--help']);
    assert.equal(args.help, true);
  });

  it('應解析 -h 短旗標', () => {
    const args = parseCliArgs(['-h']);
    assert.equal(args.help, true);
  });

  it('應解析 --mode 選項', () => {
    const args = parseCliArgs(['--mode', 'full', '任務']);
    assert.equal(args.mode, 'full');
    assert.equal(args.task, '任務');
  });

  it('應解析 -m 短選項', () => {
    const args = parseCliArgs(['-m', 'simplified', '任務']);
    assert.equal(args.mode, 'simplified');
  });

  it('應解析 --memory-root 選項', () => {
    const args = parseCliArgs(['--memory-root', '/tmp/project', '任務']);
    assert.equal(args.memoryRoot, '/tmp/project');
  });

  it('應解析 --model 選項', () => {
    const args = parseCliArgs(['--model', 'claude-opus-4-20250514', '任務']);
    assert.equal(args.model, 'claude-opus-4-20250514');
  });

  it('應取得位置參數作為 task', () => {
    const args = parseCliArgs(['修改核心業務邏輯']);
    assert.equal(args.task, '修改核心業務邏輯');
    assert.equal(args.help, false);
  });

  it('無參數時 task 應為 undefined', () => {
    const args = parseCliArgs([]);
    assert.equal(args.task, undefined);
    assert.equal(args.help, false);
  });

  it('應同時接受多個選項', () => {
    const args = parseCliArgs([
      '--mode', 'full',
      '--memory-root', '/tmp',
      '--model', 'claude-haiku-4-5-20251001',
      '複雜任務',
    ]);
    assert.equal(args.mode, 'full');
    assert.equal(args.memoryRoot, '/tmp');
    assert.equal(args.model, 'claude-haiku-4-5-20251001');
    assert.equal(args.task, '複雜任務');
  });
});
