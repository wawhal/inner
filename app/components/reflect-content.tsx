'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { db } from '../lib/store'
import { useAreas, useNotesByArea } from '../lib/hooks'
import { ensureDefaultAgent, runAgent } from '../lib/agent/runtime'
import type { ProviderId } from '../lib/providers'

export function ReflectContent() {
  const queryClient = useQueryClient()
  const { data: areas } = useAreas()
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const { data: notes } = useNotesByArea(selectedAreaId)
  const { data: session } = useSession()
  const { data: providers } = useQuery({ queryKey: ['model-providers'], queryFn: () => db.modelProviders.toArray() })
  const [status, setStatus] = useState<string>('Select an area and run reflection.')

  useEffect(() => {
    ensureDefaultAgent().catch((error) => console.error('Failed to bootstrap agent', error))
  }, [])

  const providerRecord = useMemo(() => {
    if (!session?.provider) return undefined
    return providers?.find((p) => p.id === session.provider)
  }, [providers, session?.provider])

  const reflectionMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAreaId) throw new Error('Pick an area')
      if (!providerRecord) throw new Error('Connect a model provider first')
      const areaNotes = notes?.map((note) => note.id) ?? []
      setStatus('Running agent…')
      await db.agentStates.update('reflection-agent', {
        definitionJson: {
          start: 'step-reflect',
          nodes: [
            {
              id: 'step-reflect',
              capabilityId: 'reflection-capability',
              input: { areaId: selectedAreaId, noteIds: areaNotes }
            }
          ]
        }
      })
      await runAgent({
        agentStateId: 'reflection-agent',
        provider: session?.provider as ProviderId,
        providerConfig: providerRecord.config
      })
      await queryClient.invalidateQueries({ queryKey: ['insights'] })
      await queryClient.invalidateQueries({ queryKey: ['actions'] })
      setStatus('Reflection complete. New insights and actions ready.')
    },
    onError: (error: Error) => {
      setStatus(error.message)
    }
  })

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-black/40 p-6">
        <label className="text-sm font-medium text-subtle">Choose an area</label>
        <select
          value={selectedAreaId ?? ''}
          onChange={(event) => setSelectedAreaId(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-black/60 p-3 text-sm focus:border-accent"
        >
          <option value="" disabled>
            Select
          </option>
          {areas?.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Prepare notes</h2>
          <button
            onClick={() => reflectionMutation.mutateAsync()}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
            disabled={!selectedAreaId || reflectionMutation.isPending}
          >
            {reflectionMutation.isPending ? 'Reflecting…' : 'Run reflection'}
          </button>
        </div>
        <p className="mt-2 text-xs text-subtle">Only the selected notes and prompt are sent to the AI model.</p>
        <ul className="mt-4 space-y-3 text-sm">
          {notes?.map((note) => (
            <li key={note.id} className="rounded-lg border border-white/10 bg-black/60 p-3">
              {note.content}
            </li>
          ))}
          {notes?.length === 0 && <div className="text-xs text-subtle">Add notes in this area to reflect.</div>}
        </ul>
      </div>

      <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm text-accent">
        {status}
      </div>
    </div>
  )
}
