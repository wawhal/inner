import { nanoid } from 'nanoid'
import { db } from '../lib/store'
import type { PromptTemplate } from '../lib/types'

const starterTemplates: PromptTemplate[] = [
  {
    id: 'reflection-basic',
    name: 'Daily Reflection',
    version: '1.0.0',
    inputSchema: {
      type: 'object',
      properties: {
        area: { type: 'string' },
        notes: { type: 'array', items: { type: 'string' } }
      },
      required: ['area', 'notes']
    },
    outputSchema: {
      type: 'object',
      properties: {
        insights: { type: 'array', items: { type: 'string' } },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              dueAt: { type: ['string', 'null'] }
            },
            required: ['label']
          }
        }
      }
    },
    templateString:
      'Analyze the provided notes in the {{area}} area. Distill them into insights and actionable steps. Return JSON that matches the schema.',
    createdAt: new Date().toISOString()
  }
]

let bootstrapped = false

export const initStore = async () => {
  if (bootstrapped) return
  bootstrapped = true
  const existingTemplates = await db.promptTemplates.toArray()
  if (existingTemplates.length === 0) {
    await db.promptTemplates.bulkAdd(
      starterTemplates.map((tpl) => ({ ...tpl, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
    )
  }
  const existingAreas = await db.areas.count()
  if (existingAreas === 0) {
    const now = new Date().toISOString()
    await db.areas.bulkAdd(
      ['Health', 'Work', 'Relationships'].map((name) => ({
        id: nanoid(),
        name,
        createdAt: now,
        updatedAt: now
      }))
    )
  }
}
