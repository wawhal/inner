import { Suspense } from 'react'
import { SettingsContent } from '../../components/settings-content'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-subtle">
        Manage your connected model providers. OAuth tokens are stored locally and used only for direct model calls.
      </p>
      <Suspense fallback={<div>Loading settings…</div>}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
