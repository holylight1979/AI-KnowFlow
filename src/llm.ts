/**
 * LLM Adapter — 極薄抽象層
 *
 * 兩種模式：
 * 1. PassthroughLlm — 外部處理（Claude Code skill 內嵌使用）
 * 2. AnthropicLlm  — 直接呼叫 Anthropic API（原生 fetch，零依賴）
 */

import type { LlmAdapter } from './types.js';

/**
 * Passthrough 模式 — 不直接呼叫 API，
 * 由外部（如 Claude Code）提供 completion handler。
 */
export class PassthroughLlm implements LlmAdapter {
  private handler: (prompt: string, systemPrompt?: string) => Promise<string>;

  constructor(handler: (prompt: string, systemPrompt?: string) => Promise<string>) {
    this.handler = handler;
  }

  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    return this.handler(prompt, systemPrompt);
  }

  async completeJson<T>(prompt: string, systemPrompt?: string): Promise<T> {
    const result = await this.handler(
      prompt + '\n\n請只回覆有效 JSON，不要包含其他文字或 markdown code fence。',
      systemPrompt,
    );
    return extractJson<T>(result);
  }
}

/**
 * Anthropic API 直接呼叫模式 — 零 npm 依賴，使用原生 fetch。
 * 適用於 MCP server 或獨立運行場景。
 */
export class AnthropicLlm implements LlmAdapter {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'claude-sonnet-4-20250514') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    const body: Record<string, unknown> = {
      model: this.model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    };
    if (systemPrompt) {
      body.system = systemPrompt;
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Anthropic API error ${resp.status}: ${text}`);
    }

    const data = await resp.json() as { content: Array<{ text: string }> };
    return data.content[0].text;
  }

  async completeJson<T>(prompt: string, systemPrompt?: string): Promise<T> {
    const result = await this.complete(
      prompt + '\n\n請只回覆有效 JSON，不要包含其他文字或 markdown code fence。',
      systemPrompt,
    );
    return extractJson<T>(result);
  }
}

/** 從 LLM 回覆中提取 JSON（容忍 markdown code fence） */
function extractJson<T>(text: string): T {
  const trimmed = text.trim();

  // 嘗試直接解析
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // 嘗試提取 code fence 中的 JSON
    const match = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (match?.[1]) {
      return JSON.parse(match[1].trim()) as T;
    }
    throw new Error(`Failed to parse JSON from LLM response: ${trimmed.slice(0, 200)}...`);
  }
}
