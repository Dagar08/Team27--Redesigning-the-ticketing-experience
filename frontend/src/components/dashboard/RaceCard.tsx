import type { UpcomingRace } from '@/features/dashboard/types'

const statusColor: Record<UpcomingRace['status'], string> = {
  'On-going': 'text-gp-green-400',
  'Up-coming': 'text-zinc-400',
}

const borderColor: Record<UpcomingRace['status'], string> = {
  'On-going': 'border-gp-green-500/40',
  'Up-coming': 'border-white/10',
}

export function RaceCard({ race }: { race: UpcomingRace }) {
  return (
    <div className={`rounded-xl border ${borderColor[race.status]} bg-asphalt-900 p-4`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold uppercase tracking-wide ${statusColor[race.status]}`}>
          {race.status}
        </p>
        <p className="text-xs text-zinc-500">{race.venue}</p>
      </div>
      <p className="mt-2 font-semibold text-white">{race.raceName}</p>
      <p className="mt-1 text-sm text-zinc-400">{race.dateRange}</p>
    </div>
  )
}