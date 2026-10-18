import type { Metadata } from 'next'
import { TeamMemberCard } from '@/components/team/TeamMemberCard'
import { TrackDivider } from '@/components/brand/Brand'
import { teamMembers, TEAM_NAME } from '@/features/team/data'
import { cn } from '@/lib/utils'
import { displayTitle } from '@/lib/styles'

export const metadata: Metadata = {
  title: 'Team',
  description: `Meet ${TEAM_NAME}`,
}

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 py-4">
      <header className="text-center">
        <h1 className={cn(displayTitle, 'text-4xl font-black text-white sm:text-6xl')}>
          Meet the team
        </h1>
        <TrackDivider className="mx-auto my-6 max-w-sm" />
        <p className="mx-auto max-w-2xl text-zinc-300">
          {TEAM_NAME}: the team behind the Australian Grand Prix ticketing redesign.
        </p>
      </header>

      {/* The first member is centred above the rest, as in the mockup. */}
      <ul className="bg-asphalt-950 border-asphalt-600 grid gap-10 rounded-3xl border p-6 sm:grid-cols-2 sm:p-10">
        {teamMembers.map((member) => (
          <li key={member.id} className="sm:first:col-span-2 sm:first:mx-auto sm:first:max-w-md">
            <TeamMemberCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  )
}