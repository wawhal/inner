'use client'

import { useState } from 'react'
import { useActions, useAreas, useCreateNote, useInsights, useNotesByArea } from '../lib/hooks'

export function Dashboard() {
  const { data: areas } = useAreas()
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const { data: notes } = useNotesByArea(selectedAreaId)
  const { data: insights } = useInsights()
  const { data: actions } = useActions()
  const noteMutation = useCreateNote(selectedAreaId)
  const [draft, setDraft] = useState('')

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <section className="rounded-xl border border-white/10 bg-black/40 p-6">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Areas</h2>
          </header>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {areas?.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  selectedAreaId === area.id
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="text-sm font-medium">{area.name}</div>
                <div className="text-xs text-subtle">{new Date(area.createdAt).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-black/40 p-6">
          <h2 className="text-lg font-semibold">Notes</h2>
          {selectedAreaId ? (
            <>
              <form
                className="mt-4 flex flex-col gap-3"
                onSubmit={async (event) => {
                  event.preventDefault()
                  if (!draft.trim()) return
                  await noteMutation.mutateAsync(draft)
                  setDraft('')
                }}
              >
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Capture what's on your mind…"
                  className="min-h-[120px] rounded-lg border border-white/10 bg-black/60 p-3 text-sm text-white focus:border-accent"
                />
                <button
                  type="submit"
                  className="self-end rounded-full bg-accent px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
                  disabled={noteMutation.isPending}
                >
                  {noteMutation.isPending ? 'Saving…' : 'Save note'}
                </button>
              </form>
              <ul className="mt-6 space-y-3 text-sm">
                {notes?.map((note) => (
                  <li key={note.id} className="rounded-lg border border-white/10 bg-black/60 p-4">
                    <p>{note.content}</p>
                    <span className="mt-2 block text-xs text-subtle">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
                {notes?.length === 0 && <div className="text-xs text-subtle">No notes yet. Capture one to begin.</div>}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-sm text-subtle">Select an area to see or create notes.</p>
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-xl border border-white/10 bg-black/40 p-6">
          <h2 className="text-lg font-semibold">Insights</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {insights?.map((insight) => (
              <li key={insight.id} className="rounded-lg border border-white/10 bg-black/50 p-4">
                {insight.content}
              </li>
            ))}
            {insights?.length === 0 && <div className="text-xs text-subtle">No insights yet. Run a reflection.</div>}
          </ul>
        </section>
        <section className="rounded-xl border border-white/10 bg-black/40 p-6">
          <h2 className="text-lg font-semibold">Actions</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {actions?.map((action) => (
              <li key={action.id} className="rounded-lg border border-white/10 bg-black/50 p-4">
                <div className="font-medium">{action.label}</div>
                {action.dueAt && <div className="text-xs text-subtle">Due {new Date(action.dueAt).toLocaleDateString()}</div>}
              </li>
            ))}
            {actions?.length === 0 && <div className="text-xs text-subtle">Actions will appear after reflections.</div>}
          </ul>
        </section>
      </aside>
    </div>
  )
}
