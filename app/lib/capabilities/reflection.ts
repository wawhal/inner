import { nanoid } from 'nanoid'
import { CapabilityContract } from '../contracts'
import { db } from '../store'

interface ReflectionInput {
  areaId: string
  noteIds: string[]
}

interface ReflectionOutput {
  insightIds: string[]
  actionIds: string[]
}

export const reflectionCapability: CapabilityContract<ReflectionInput, ReflectionOutput> = {
  id: 'reflection-capability',
  name: 'Reflect on notes',
  version: '1.0.0',
  inputSchema: {
    type: 'object',
    properties: {
      areaId: { type: 'string' },
      noteIds: { type: 'array', items: { type: 'string' } }
    },
    required: ['areaId', 'noteIds']
  },
  outputSchema: {
    type: 'object',
    properties: {
      insightIds: { type: 'array', items: { type: 'string' } },
      actionIds: { type: 'array', items: { type: 'string' } }
    }
  },
  async invoke(input, ctx) {
    const { areaId, noteIds } = input
    const notes = await db.notes.bulkGet(noteIds)
    const prompt = `You are Inner, an intent-driven mental operating system. Summarize the following notes for clarity and suggest up to three concrete actions. Notes: ${notes
      .filter(Boolean)
      .map((note) => note?.content)
      .join('\n')}`

    const result = await ctx.llm.chat([
      { role: 'system', content: 'You distill thoughts into clarity and action.' },
      { role: 'user', content: prompt }
    ])

    let parsed: { insights?: string[]; actions?: { label: string; dueAt?: string | null }[] } = {}
    try {
      parsed = JSON.parse(result)
    } catch {
      parsed = { insights: [result], actions: [] }
    }

    const now = new Date().toISOString()
    const insightIds: string[] = []
    const actionIds: string[] = []

    for (const insight of parsed.insights ?? []) {
      const id = nanoid()
      await db.insights.add({
        id,
        areaId,
        content: insight,
        evidenceNoteIds: noteIds,
        createdAt: now,
        updatedAt: now
      })
      insightIds.push(id)
    }

    for (const action of parsed.actions ?? []) {
      const id = nanoid()
      await db.actions.add({
        id,
        areaId,
        label: action.label,
        done: false,
        dueAt: action.dueAt ?? null,
        createdAt: now,
        updatedAt: now
      })
      actionIds.push(id)
    }

    return { insightIds, actionIds }
  }
}
