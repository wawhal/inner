import { createHttpProvider } from './base'
import type { LlmProviderConfig, LlmProvider, ChatMessage, ChatCompletionOpts } from '../contracts'

export const createAnthropicProvider = (config: LlmProviderConfig): LlmProvider =>
  createHttpProvider({
    ...config,
    baseUrl: config.baseUrl ?? 'https://api.anthropic.com',
    chatPath: '/v1/messages',
    requestAdapter: (messages: ChatMessage[], opts?: ChatCompletionOpts) => ({
      model: config.model,
      messages,
      max_tokens: opts?.maxTokens ?? 512,
      temperature: opts?.temperature ?? 0.5
    }),
    transformResponse: (raw) => raw.content?.[0]?.text ?? JSON.stringify(raw)
  })
