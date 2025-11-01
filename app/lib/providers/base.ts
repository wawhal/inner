import type { ChatMessage, ChatCompletionOpts, LlmProvider, LlmProviderConfig } from '../contracts'

interface HttpProviderConfig extends LlmProviderConfig {
  chatPath: string
  transformResponse?: (raw: any) => string
  requestAdapter?: (messages: ChatMessage[], opts?: ChatCompletionOpts) => unknown
}

export function createHttpProvider(config: HttpProviderConfig): LlmProvider {
  return {
    id: config.model,
    name: config.model,
    async chat(messages, opts) {
      const payload =
        config.requestAdapter?.(messages, opts) ?? {
          model: config.model,
          messages,
          temperature: opts?.temperature ?? 0.2,
          max_tokens: opts?.maxTokens ?? 512
        }

      const response = await fetch(`${config.baseUrl ?? ''}${config.chatPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.oauthToken}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`LLM request failed: ${response.status}`)
      }

      const data = await response.json()
      return config.transformResponse?.(data) ?? data.choices?.[0]?.message?.content ?? JSON.stringify(data)
    }
  }
}
