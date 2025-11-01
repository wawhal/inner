import { capabilityRegistry } from '../capability-registry'
import { db } from '../store'
import type { CapabilityCtx } from '../contracts'
import type { ProviderId } from '../providers'
import { getProvider } from '../providers'
import type { AgentState } from '../types'

interface StateMachineNode {
  id: string
  capabilityId: string
  input: Record<string, unknown>
  onSuccess?: string
}

interface AgentDefinition {
  start: string
  nodes: StateMachineNode[]
}

export interface RunAgentOptions {
  agentStateId: string
  provider: ProviderId
  providerConfig: {
    oauthToken: string
    baseUrl?: string
    model: string
  }
}

export async function runAgent(options: RunAgentOptions) {
  const agentState = await db.agentStates.get(options.agentStateId)
  if (!agentState) {
    throw new Error('Agent state not found')
  }

  const definition = agentState.definitionJson as AgentDefinition
  const ctx: CapabilityCtx = {
    now: () => new Date(),
    store: db,
    llm: getProvider(options.provider, options.providerConfig),
    registry: capabilityRegistry
  }

  let currentId: string | undefined = definition.start
  const visited = new Set<string>()

  while (currentId) {
    if (visited.has(currentId)) {
      throw new Error('State machine loop detected')
    }
    visited.add(currentId)
    const node = definition.nodes.find((n) => n.id === currentId)
    if (!node) {
      throw new Error(`Node ${currentId} missing`)
    }
    const capability = capabilityRegistry.get(node.capabilityId)
    if (!capability) {
      throw new Error(`Capability ${node.capabilityId} missing`)
    }

    await capability.invoke(node.input, ctx)
    currentId = node.onSuccess
  }
}

export async function ensureDefaultAgent() {
  const existing = await db.agentStates.get('reflection-agent')
  if (existing) return existing
  const definition: AgentDefinition = {
    start: 'step-reflect',
    nodes: [
      {
        id: 'step-reflect',
        capabilityId: 'reflection-capability',
        input: {
          areaId: 'dynamic-area',
          noteIds: []
        }
      }
    ]
  }
  const agent: AgentState = {
    id: 'reflection-agent',
    name: 'Reflection Agent',
    version: '1.0.0',
    definitionJson: definition,
    createdAt: new Date().toISOString()
  }
  await db.agentStates.add(agent)
  return agent
}
