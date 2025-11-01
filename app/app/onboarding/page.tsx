import { Suspense } from 'react'
import { OnboardingContent } from '../../components/onboarding-content'

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to Inner</h1>
      <p className="text-sm text-subtle">
        Define the areas of your life you want Inner to support and capture an initial reflection to seed the system.
      </p>
      <Suspense fallback={<div>Loading onboarding…</div>}>
        <OnboardingContent />
      </Suspense>
    </div>
  )
}
