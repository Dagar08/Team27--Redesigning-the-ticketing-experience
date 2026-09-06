import type { Metadata } from 'next'
import { TeamMemberCard } from '@/components/team/TeamMemberCard'
import { teamMembers, TEAM_NAME } from '@/features/team/data'

export const metadata: Metadata = {
  title: 'Team',
  description: `Meet ${TEAM_NAME}`,
}

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gp-green-400">
          Meet the team
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          {TEAM_NAME}
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Meet the team behind the Grand Prix ticketing redesign.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}