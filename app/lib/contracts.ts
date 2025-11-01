import type { JsonSchema } from './types'
import type { LocalStore } from './store'

export interface CapabilityCtx {
  now: () => Date
  store: LocalStore
  llm: LlmProvider
  registry: CapabilityRegistry
}

export interface CapabilityContract<I = any, O = any> {
  id: string
  name: string
  version: string
  inputSchema: JsonSchema
  outputSchema: JsonSchema
  invoke: (input: I, ctx: CapabilityCtx) => Promise<O>
}

export interface LlmProviderConfig {
  oauthToken: string
  baseUrl?: string
  model: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionOpts {
  temperature?: number
  maxTokens?: number
}

export interface LlmProvider {
  id: string
  name: string
  chat: (messages: ChatMessage[], opts?: ChatCompletionOpts) => Promise<string>
}

export interface CapabilityRegistry {
  list: () => CapabilityContract[]
  get: (id: string) => CapabilityContract | undefined
}
