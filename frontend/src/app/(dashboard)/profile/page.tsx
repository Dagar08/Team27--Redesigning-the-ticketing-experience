import type { Metadata } from 'next'
import { getServerSession } from '@/actions/auth.actions'
import { PageHeader } from '@/components/layout/PageHeader'
import { Panel } from '@/components/shared/Panel'

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function ProfilePage() {
  const session = await getServerSession()

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Profile" description="Manage your account details." />

      <Panel title="Account">
        <p className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">Email</p>
        <p className="mt-1 text-sm text-white">{session?.email ?? '—'}</p>
      </Panel>
    </div>
  )
}
