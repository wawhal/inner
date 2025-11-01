'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ReactNode, useState } from 'react'
import { StoreHydrator } from './store-hydrator'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <StoreHydrator>{children}</StoreHydrator>
      </QueryClientProvider>
    </SessionProvider>
  )
}
