import Link from 'next/link'
import { Suspense } from 'react'
import { Dashboard } from '../components/dashboard'

export default function HomePage() {
  return (
    <section className="space-y-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight">Clarity that leads to action</h1>
        <p className="mt-4 max-w-2xl text-sm text-subtle">
          Inner is your proactive mental operating system. Capture what matters, distill it into insight, and move forward with
          intent. Everything stays on your device — only model requests leave.
        </p>
        <div className="mt-6 flex gap-3 text-sm">
          <Link href="/onboarding" className="rounded-full bg-accent px-4 py-2 font-medium text-black">
            Start onboarding
          </Link>
          <Link href="/reflect" className="rounded-full border border-white/20 px-4 py-2 text-subtle">
            Reflect now
          </Link>
        </div>
      </div>
      <Suspense fallback={<div>Loading state…</div>}>
        <Dashboard />
      </Suspense>
    </section>
  )
}
