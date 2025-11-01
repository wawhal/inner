import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Providers } from '../components/providers'

export const metadata: Metadata = {
  title: 'Inner — Mental Operating System',
  description: 'Private-first companion that turns thought into action.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white">
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-surface via-background to-black">
            <header className="border-b border-white/10">
              <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
                <span className="text-lg font-semibold tracking-wide">Inner</span>
                <nav className="flex items-center gap-4 text-sm text-subtle">
                  <Link href="/">Home</Link>
                  <Link href="/onboarding">Onboarding</Link>
                  <Link href="/reflect">Reflect</Link>
                  <Link href="/settings">Settings</Link>
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
