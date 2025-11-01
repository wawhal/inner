'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { db } from '../lib/store'
import type { Area, Note } from '../lib/types'

export function OnboardingContent() {
  const queryClient = useQueryClient()
  const { data: areas } = useQuery({ queryKey: ['areas'], queryFn: () => db.areas.toArray() })
  const [newArea, setNewArea] = useState('')

  const createArea = useMutation({
    mutationFn: async (name: string) => {
      const now = new Date().toISOString()
      const area: Area = { id: nanoid(), name, createdAt: now, updatedAt: now }
      await db.areas.add(area)
      return area
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['areas'] })
  })

  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const createNote = useMutation({
    mutationFn: async () => {
      if (!selectedArea) throw new Error('Select an area')
      const now = new Date().toISOString()
      const note: Note = {
        id: nanoid(),
        areaId: selectedArea,
        content: noteDraft,
        createdAt: now,
        updatedAt: now,
        meta: { source: 'user' }
      }
      await db.notes.add(note)
      return note
    },
    onSuccess: async () => {
      setNoteDraft('')
      await queryClient.invalidateQueries({ queryKey: ['notes', selectedArea] })
    }
  })

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-white/10 bg-black/40 p-6">
        <h2 className="text-lg font-semibold">Life areas</h2>
        <p className="mt-2 text-xs text-subtle">
          Areas focus Inner on what matters most. Start with a few and refine later.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {areas?.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                selectedArea === area.id ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/30'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
        <form
          className="mt-4 flex gap-3"
          onSubmit={async (event) => {
            event.preventDefault()
            if (!newArea.trim()) return
            await createArea.mutateAsync(newArea.trim())
            setNewArea('')
          }}
        >
          <input
            value={newArea}
            onChange={(event) => setNewArea(event.target.value)}
            placeholder="Add a new area (e.g., Creativity)"
            className="flex-1 rounded-lg border border-white/10 bg-black/60 p-3 text-sm text-white focus:border-accent"
          />
          <button className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-black">Add</button>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/40 p-6">
        <h2 className="text-lg font-semibold">Seed Inner with a reflection</h2>
        <p className="mt-2 text-xs text-subtle">Pick an area and capture what&apos;s top of mind.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={async (event) => {
            event.preventDefault()
            if (!noteDraft.trim()) return
            await createNote.mutateAsync()
          }}
        >
          <select
            value={selectedArea ?? ''}
            onChange={(event) => setSelectedArea(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-sm focus:border-accent"
          >
            <option value="" disabled>
              Select an area
            </option>
            {areas?.map((area) => (
              <option value={area.id} key={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          <textarea
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            placeholder="What are you thinking about in this area?"
            className="min-h-[120px] w-full rounded-lg border border-white/10 bg-black/60 p-3 text-sm focus:border-accent"
          />
          <button className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-black">Save note</button>
        </form>
      </section>
    </div>
  )
}
