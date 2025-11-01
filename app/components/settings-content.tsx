'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { db } from '../lib/store'
import type { ModelProvider } from '../lib/types'

const providers = [
  { id: 'openai', label: 'OpenAI', defaultModel: 'gpt-4.1-mini' },
  { id: 'anthropic', label: 'Anthropic Claude', defaultModel: 'claude-3-haiku' },
  { id: 'gemini', label: 'Google Gemini', defaultModel: 'gemini-pro' }
] as const

type ProviderId = (typeof providers)[number]['id']

export function SettingsContent() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { data: storedProviders } = useQuery({ queryKey: ['model-providers'], queryFn: () => db.modelProviders.toArray() })

  const {
    mutate: persistProvider,
    isPending: persistPending
  } = useMutation({
    mutationFn: async (config: { provider: ProviderId; token: string }) => {
      const providerMeta = providers.find((p) => p.id === config.provider)!
      const existing = await db.modelProviders.get(config.provider)
      const record: ModelProvider = {
        id: config.provider,
        name: providerMeta.label,
        config: {
          oauthToken: config.token,
          model: providerMeta.defaultModel
        },
        capabilities: { chat: true },
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await db.modelProviders.put(record)
      return record
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['model-providers'] })
  })

  const disconnectProvider = useMutation({
    mutationFn: async (providerId: ProviderId) => {
      await db.modelProviders.delete(providerId)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['model-providers'] })
  })

  useEffect(() => {
    const provider = session?.provider as ProviderId | undefined
    if (!provider || !session?.accessToken || persistPending) return
    const existing = storedProviders?.find((item) => item.id === provider)
    if (existing?.config.oauthToken === session.accessToken) return
    persistProvider({ provider, token: session.accessToken })
  }, [
    session?.provider,
    session?.accessToken,
    persistProvider,
    persistPending,
    storedProviders
  ])

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-black/40 p-6">
        <h2 className="text-lg font-semibold">Connect a provider</h2>
        <p className="mt-2 text-xs text-subtle">
          Inner uses OAuth to connect directly to your model vendor. We never see your API keys.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {providers.map((provider) => {
            const connected = storedProviders?.find((p) => p.id === provider.id)
            return (
              <div key={provider.id} className="rounded-lg border border-white/10 bg-black/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{provider.label}</div>
                    <div className="text-xs text-subtle">Model: {provider.defaultModel}</div>
                  </div>
                  {connected ? (
                    <button
                      className="rounded-full border border-white/20 px-3 py-1 text-xs text-subtle hover:border-white/40"
                      onClick={() => disconnectProvider.mutate(provider.id)}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black"
                      onClick={() => signIn(provider.id)}
                    >
                      Connect
                    </button>
                  )}
                </div>
                {connected && (
                  <div className="mt-3 rounded-md border border-accent/40 bg-accent/10 p-3 text-xs text-accent">
                    Connected. Token stored locally.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/40 p-6">
        <h2 className="text-lg font-semibold">Session</h2>
        {session ? (
          <div className="space-y-3 text-sm">
            <div>Signed in with: {session.provider ?? 'Unknown'}</div>
            <div className="text-xs text-subtle">Token: {session.accessToken ? 'Available locally' : 'None'}</div>
            <div className="text-xs text-subtle">Expires: {session.expiresAt ? new Date(session.expiresAt).toLocaleString() : 'Unknown'}</div>
            <button className="rounded-full border border-white/20 px-3 py-1 text-xs" onClick={() => signOut({ callbackUrl: '/' })}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="text-sm text-subtle">Not signed in.</div>
        )}
      </section>
    </div>
  )
}
