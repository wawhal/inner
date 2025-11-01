import { createAnthropicProvider } from './anthropic'
import { createGeminiProvider } from './gemini'
import { createOpenAIProvider } from './openai'
import type { LlmProvider, LlmProviderConfig } from '../contracts'

export type ProviderId = 'openai' | 'anthropic' | 'gemini'

export const providerFactories: Record<ProviderId, (config: LlmProviderConfig) => LlmProvider> = {
  openai: createOpenAIProvider,
  anthropic: createAnthropicProvider,
  gemini: createGeminiProvider
}

export const getProvider = (provider: ProviderId, config: LlmProviderConfig): LlmProvider =>
  providerFactories[provider](config)
