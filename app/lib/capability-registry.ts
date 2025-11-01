import { CapabilityContract } from './contracts'
import { reflectionCapability } from './capabilities/reflection'

const capabilities: CapabilityContract[] = [reflectionCapability]

export const capabilityRegistry = {
  list: () => capabilities,
  get: (id: string) => capabilities.find((cap) => cap.id === id)
}
