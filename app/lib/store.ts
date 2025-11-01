import Dexie, { Table } from 'dexie'
import type {
  Action,
  AgentState,
  Area,
  Capability,
  Insight,
  ModelProvider,
  Note,
  PromptTemplate,
  Session
} from './types'

export class InnerDB extends Dexie {
  areas!: Table<Area>
  notes!: Table<Note>
  insights!: Table<Insight>
  actions!: Table<Action>
  sessions!: Table<Session>
  promptTemplates!: Table<PromptTemplate>
  capabilities!: Table<Capability>
  agentStates!: Table<AgentState>
  modelProviders!: Table<ModelProvider>

  constructor() {
    super('inner-db')
    this.version(1).stores({
      areas: 'id, name, createdAt',
      notes: 'id, areaId, createdAt',
      insights: 'id, areaId, createdAt',
      actions: 'id, areaId, done, createdAt',
      sessions: 'id, startedAt',
      promptTemplates: 'id, name, version',
      capabilities: 'id, name, version',
      agentStates: 'id, name, version',
      modelProviders: 'id, name'
    })
  }
}

export type LocalStore = InnerDB

export const db = new InnerDB()
