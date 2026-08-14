import type { Metadata } from 'next'
import { TeamMemberCard } from '@/components/team/TeamMemberCard'
import { teamMembers, TEAM_NAME } from '@/features/team/data'

export const metadata: Metadata = {
  title: 'Team',
  description: `Meet ${TEAM_NAME}`,
}

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{TEAM_NAME}</h1>
        <p className="mt-1 text-sm text-zinc-500">Meet the team behind this project.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}
