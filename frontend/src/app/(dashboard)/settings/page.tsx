import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Panel } from '@/components/shared/Panel'

export const metadata: Metadata = {
  title: 'Settings',
}

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Manage your application settings." />

      <Panel title="Preferences">
        <p className="text-sm text-zinc-300">Settings will appear here.</p>
      </Panel>
    </div>
  )
}
