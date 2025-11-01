import { createHttpProvider } from './base'
import type { LlmProviderConfig, LlmProvider, ChatMessage } from '../contracts'

const mapMessages = (messages: ChatMessage[]) => ({
  contents: messages.map((msg) => ({ role: msg.role, parts: [{ text: msg.content }] }))
})

export const createGeminiProvider = (config: LlmProviderConfig): LlmProvider =>
  createHttpProvider({
    ...config,
    baseUrl: config.baseUrl ?? 'https://generativelanguage.googleapis.com',
    chatPath: `/v1beta/models/${config.model}:generateContent`,
    requestAdapter: (messages) => mapMessages(messages),
    transformResponse: (raw) => raw.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(raw)
  })
