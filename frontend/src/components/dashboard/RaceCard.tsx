import type { UpcomingRace } from '@/features/dashboard/types'
import { cn } from '@/lib/utils'
import { displayItalic, displayTitle } from '@/lib/styles'

export function RaceCard({ race }: { race: UpcomingRace }) {
  const live = race.status === 'On-going'

  return (
    <article
      className={cn(
        'bg-asphalt-900 h-full rounded-xl border p-4',
        live ? 'border-gp-red-500' : 'border-asphalt-600'
      )}
    >
      <div className="flex items-start justify-between gap-3 text-xs">
        <p
          className={cn(
            displayTitle,
            'whitespace-nowrap',
            live ? 'text-gp-red-400' : 'text-zinc-300'
          )}
        >
          {race.status}
        </p>
        <p className="text-right text-zinc-300">{race.venue}</p>
      </div>
      <h3 className={cn(displayItalic, 'mt-3 text-lg text-white')}>{race.raceName}</h3>
      <p className="mt-1 text-sm text-zinc-300">{race.dateRange}</p>
    </article>
  )
}
