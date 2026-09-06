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
    <div className="flex h-full flex-col items-center rounded-xl border border-white/10 bg-asphalt-900 p-6 text-center shadow-sm">
      {member.photoUrl ? (
        <Image
          src={member.photoUrl}
          alt={member.name}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/10 bg-asphalt-800 text-xl font-semibold text-gp-green-400"
          aria-hidden="true"
        >
          {getInitials(member.name)}
        </div>
      )}

      <h3 className="mt-4 break-words text-lg font-semibold text-white">
        {member.name}
      </h3>

      <p className="mt-1 text-sm font-medium text-gp-green-400">
        {member.role}
      </p>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
        {member.blurb}
      </p>
    </div>
  )
}