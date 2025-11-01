import { createHttpProvider } from './base'
import type { LlmProviderConfig, LlmProvider } from '../contracts'

export const createOpenAIProvider = (config: LlmProviderConfig): LlmProvider =>
  createHttpProvider({
    ...config,
    baseUrl: config.baseUrl ?? 'https://api.openai.com/v1',
    chatPath: '/chat/completions',
    transformResponse: (raw) => raw.choices?.[0]?.message?.content ?? JSON.stringify(raw)
  })
