import type { Metadata } from 'next'
import Link from 'next/link'
import { TicketCard } from '@/components/dashboard/TicketCard'
import { RaceCard } from '@/components/dashboard/RaceCard'
import { CircuitMap } from '@/features/tickets/components/CircuitMap'
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

export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Next race hero */}
        <div className="bg-asphalt-900 flex flex-col justify-between gap-6 rounded-xl border border-white/10 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-gp-green-400 text-xs font-semibold tracking-[0.2em] uppercase">
              Next race
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">{nextRace.name}</h1>
            <p className="mt-2 text-sm text-zinc-400">
              {nextRace.venue}, {nextRace.location}
            </p>
            <p className="text-sm text-zinc-400">{nextRace.dateRange}</p>
            <Link
              href="/tickets"
              className="bg-gp-green-500 text-asphalt-950 hover:bg-gp-green-400 mt-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors"
            >
              Browse tickets
            </Link>
          </div>

          <div className="flex aspect-[3/1] flex-1 items-center justify-center rounded-lg border border-dashed border-white/15 text-center text-xs text-zinc-600 sm:aspect-auto sm:h-full sm:min-h-32">
            Event banner
          </div>
        </div>

        {/* Standings + circuit overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-asphalt-900 rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Driver standings</h2>
              <Link href="#" className="text-gp-gold-500 text-xs font-medium hover:underline">
                Full standings →
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {standings.map((entry) => (
                <div
                  key={entry.position}
                  className="bg-asphalt-800 flex items-center gap-4 rounded-md border border-white/5 px-3 py-2 text-sm"
                >
                  <span className="text-gp-green-400 w-8 font-mono">P{entry.position}</span>
                  <span className="flex-1 text-white">{entry.driverName}</span>
                  <span className="hidden text-zinc-400 sm:block">{entry.teamName}</span>
                  <span className="w-10 text-right font-medium text-white">
                    {entry.points ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-asphalt-900 rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Circuit overview</h2>
              <span className="text-xs text-zinc-500">{nextRace.circuitName}</span>
            </div>
            <div className="mt-4">
              <CircuitMap overview label={`${nextRace.circuitName} map`} />
            </div>
            <dl className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <dt className="text-xs text-zinc-500">Length</dt>
                <dd className="text-white">{circuitStats.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Laps</dt>
                <dd className="text-white">{circuitStats.laps}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Fastest lap</dt>
                <dd className="text-gp-green-400">{circuitStats.fastestLap}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Distance</dt>
                <dd className="text-white">{circuitStats.distance}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Upcoming races */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Upcoming races</h2>
            <Link href="#" className="text-gp-gold-500 text-xs font-medium hover:underline">
              View full calendar →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingRaces.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-white">Your tickets</h2>
          <TicketCard ticket={ticket} />
        </div>

        <div className="bg-asphalt-900 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Available upgrades</h2>
            <Link href="#" className="text-gp-gold-500 text-xs font-medium hover:underline">
              View all upgrades →
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {upgradePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-asphalt-800 flex items-center justify-between gap-3 rounded-md border border-white/5 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{pkg.name}</p>
                  <p className="truncate text-xs text-zinc-500">{pkg.description}</p>
                </div>
                <Link
                  href="#"
                  className="bg-gp-green-500 text-asphalt-950 hover:bg-gp-green-400 shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                >
                  {pkg.price} · Upgrade
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-asphalt-900 rounded-xl border border-white/10 p-6">
          <h2 className="text-sm font-semibold text-white">Your next events</h2>
          <div className="mt-3 space-y-2">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href="#"
                className="bg-asphalt-800 flex items-center justify-between rounded-md border border-white/5 px-3 py-2 text-sm transition-colors hover:border-white/10"
              >
                <span className="text-gp-green-400 w-16 shrink-0 text-xs">{event.dateRange}</span>
                <span className="flex-1 text-white">{event.name}</span>
                <span className="text-zinc-500">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}