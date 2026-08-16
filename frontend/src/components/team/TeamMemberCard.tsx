import Image from 'next/image'
import type { TeamMember } from '@/features/team/types'

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {member.photoUrl ? (
        <Image
          src={member.photoUrl}
          alt={member.name}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 text-xl font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          aria-hidden="true"
        >
          {getInitials(member.name)}
        </div>
      )}

      <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{member.role}</p>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{member.blurb}</p>
    </div>
  )
}
