import { Suspense } from 'react'
import { ReflectContent } from '../../components/reflect-content'

export default function ReflectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Guided reflection</h1>
      <p className="text-sm text-subtle">
        Inner uses your connected model provider to turn raw notes into insights and next actions. Only the prompt is shared
        with the AI.
      </p>
      <Suspense fallback={<div>Loading agent…</div>}>
        <ReflectContent />
      </Suspense>
    </div>
  )
}
