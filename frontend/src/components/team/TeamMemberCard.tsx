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

/** Photo beside name and role, with the bio underneath, as in the "Meet the team" mockup. */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col gap-4">
      <div className="flex items-start gap-4">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            width={112}
            height={112}
            className="size-28 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div
            className="bg-asphalt-800 font-display border-asphalt-600 text-gp-red-500 grid size-28 shrink-0 place-items-center rounded-xl border text-3xl font-black italic"
            aria-hidden="true"
          >
            {getInitials(member.name)}
          </div>
        )}

        <div className="min-w-0 pt-1">
          <h3 className="text-2xl font-semibold break-words text-white">{member.name}</h3>
          <p className="text-gp-red-400 mt-1 text-sm font-semibold">{member.role}</p>
        </div>
      </div>

      <p className="text-sm leading-6 text-zinc-300">{member.blurb}</p>
    </article>
  )
}
