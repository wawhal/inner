export type EntityId = string

export interface BaseEntity {
  id: EntityId
  createdAt: string
  updatedAt?: string
}

export interface Area extends BaseEntity {
  name: string
}

export interface Note extends BaseEntity {
  areaId: EntityId
  content: string
  meta: {
    source: 'user' | 'ai'
    emotion?: string
  }
}

export interface Insight extends BaseEntity {
  areaId: EntityId | null
  content: string
  evidenceNoteIds: EntityId[]
}

export interface Action extends BaseEntity {
  areaId: EntityId | null
  label: string
  done: boolean
  dueAt: string | null
}

export interface Session extends BaseEntity {
  startedAt: string
  endedAt: string | null
}

export interface PromptTemplate extends BaseEntity {
  name: string
  version: string
  inputSchema: JsonSchema
  outputSchema: JsonSchema
  templateString: string
}

export interface Capability extends BaseEntity {
  name: string
  version: string
  inputSchema: JsonSchema
  outputSchema: JsonSchema
}

export interface AgentState extends BaseEntity {
  name: string
  version: string
  definitionJson: Record<string, unknown>
}

export interface ModelProvider extends BaseEntity {
  name: string
  config: {
    oauthToken: string
    baseUrl?: string
    model: string
  }
  capabilities: {
    chat: boolean
    embed?: boolean
  }
}

export type JsonSchema = Record<string, unknown>
