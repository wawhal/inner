'use client'

import { ReactNode, useEffect, useState } from 'react'
import { initStore } from '../store/initialize'

export function StoreHydrator({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    initStore()
      .catch((error) => console.error('Failed to initialize store', error))
      .finally(() => setReady(true))
  }, [])

  if (!ready) {
    return <div className="px-6 py-10 text-sm text-subtle">Preparing local workspace…</div>
  }

  return <>{children}</>
}
