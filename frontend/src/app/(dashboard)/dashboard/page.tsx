import type { Metadata } from 'next'
import Link from 'next/link'
import { TicketCard } from '@/components/dashboard/TicketCard'
import { RaceCard } from '@/components/dashboard/RaceCard'
import { UpgradesPanel } from '@/components/dashboard/UpgradesPanel'
import { NextEventsPanel } from '@/components/dashboard/NextEventsPanel'
import { RaceHero } from '@/components/brand/RaceHero'
import { Panel } from '@/components/shared/Panel'
import { CircuitMap } from '@/features/tickets/components/CircuitMap'
import { cn } from '@/lib/utils'
import { buttonPrimary, displayTitle, textLink } from '@/lib/styles'
import {
  nextRace,
  standings,
  circuitStats,
  ticket,
  upgradePackages,
  upcomingRaces,
  upcomingEvents,
} from '@/features/dashboard/data'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const stats = [
  { label: 'Length', value: circuitStats.length },
  { label: 'Laps', value: circuitStats.laps },
  { label: 'Fastest lap', value: circuitStats.fastestLap, highlight: true },
  { label: 'Distance', value: circuitStats.distance },
]

export default function DashboardPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 xl:col-span-2">
        <RaceHero
          eyebrow="Next race"
          title={nextRace.name}
          venue={`${nextRace.venue}, ${nextRace.location}`}
          dateRange={nextRace.dateRange}
          action={
            <Link href="/tickets" className={buttonPrimary}>
              View event
            </Link>
          }
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Panel
            title="Driver standings"
            action={
              <Link href="#" className={textLink}>
                Full standings →
              </Link>
            }
          >
            <ol className="divide-y divide-white/10">
              {standings.map((entry) => (
                <li
                  key={entry.position}
                  className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-3 text-sm 2xl:grid-cols-[2.5rem_1fr_1fr_auto]"
                >
                  <span
                    className={cn(
                      displayTitle,
                      entry.position === 1 ? 'text-gp-red-400' : 'text-zinc-300'
                    )}
                  >
                    P{entry.position}
                  </span>
                  {/* The team sits under the name until there is room for its own column. */}
                  <span className="min-w-0">
                    <span className="block font-semibold text-white">{entry.driverName}</span>
                    <span className="block text-xs text-zinc-300 2xl:hidden">{entry.teamName}</span>
                  </span>
                  <span className="hidden text-zinc-300 2xl:block">{entry.teamName}</span>
                  <span className="text-right font-bold text-white">{entry.points ?? '—'}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel
            title="Circuit overview"
            action={
              <span className="text-gp-red-400 text-xs font-semibold">{nextRace.circuitName}</span>
            }
          >
            <div className="bg-asphalt-950 rounded-xl border border-white/10 p-3">
              <CircuitMap overview label={`${nextRace.circuitName} map`} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 2xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-asphalt-800 rounded-lg px-3 py-2">
                  <dt className="text-xs tracking-wide text-zinc-300 uppercase">{stat.label}</dt>
                  <dd
                    className={cn(
                      'text-sm font-bold whitespace-nowrap',
                      stat.highlight ? 'text-gp-red-400' : 'text-white'
                    )}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className={cn(displayTitle, 'text-xl text-white')}>Upcoming races</h2>
            <Link href="#" className={textLink}>
              View full calendar →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingRaces.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </section>
      </div>

      {/* Side column */}
      <div className="space-y-6">
        <Panel title="Your tickets">
          <TicketCard ticket={ticket} />
        </Panel>
        <UpgradesPanel upgrades={upgradePackages} />
        <NextEventsPanel events={upcomingEvents} />
      </div>
    </div>
  )
}