'use client'

import { Ticket } from 'lucide-react'
import { BackLink } from '@/components/layout/BackLink'
import { RaceHero } from '@/components/brand/RaceHero'
import { EmptyState } from '@/components/shared/EmptyState'
import { Panel } from '@/components/shared/Panel'
import { TicketCard } from '@/components/dashboard/TicketCard'
import { UpgradesPanel } from '@/components/dashboard/UpgradesPanel'
import { NextEventsPanel } from '@/components/dashboard/NextEventsPanel'
import {
  nextRace,
  ticket as userPass,
  upgradePackages,
  upcomingEvents,
} from '@/features/dashboard/data'
import { cn } from '@/lib/utils'
import { displayBlock, panel } from '@/lib/styles'
import type { TicketType } from '@/types/firestore'
import { useTicketExplorer } from './TicketExplorerProvider'
import {
  TicketFacts,
  TicketLoadError,
  TicketLoading,
  TicketPrice,
  ticketButtonClassName,
} from './TicketElements'
import { TicketCompareToggle, TicketSelection } from './TicketSelection'
import { TicketDetailsDialog } from './TicketDetailsDialog'
import { useTicketDetails } from '../hooks/useTicketDetails'
import { useRetryFocus } from '../hooks/useRetryFocus'
import { CircuitMap } from './CircuitMap'

function TicketBrowseCard({
  ticket,
  onViewDetails,
}: {
  ticket: TicketType
  onViewDetails: (id: string) => void
}) {
  return (
    <article
      className={cn(
        panel,
        'focus-within:border-gp-red-500 flex h-full flex-col overflow-hidden transition-colors hover:border-zinc-400'
      )}
    >
      {/* The heading comes first for screen readers; CSS order shows it under the map as in the mockup. */}
      <h2
        className={cn(displayBlock, 'order-2 px-4 pt-4 text-right text-xl text-white sm:text-2xl')}
      >
        {ticket.name}
      </h2>
      <div className="order-1 p-4 pb-0">
        <CircuitMap zone={ticket.zone} label={`Circuit map for ${ticket.name}`} />
      </div>
      <div className="order-3 mt-4 flex flex-1 flex-col gap-4 border-t border-white/10 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <TicketPrice price={ticket.priceAud} />
          <TicketFacts ticket={ticket} align="end" />
        </div>
        <p className="font-display text-sm leading-relaxed font-semibold text-zinc-200">
          {ticket.viewDescription || 'View description coming soon.'}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <TicketCompareToggle ticket={ticket} />
          <button
            type="button"
            onClick={() => onViewDetails(ticket.id)}
            aria-label={`View details: ${ticket.name}`}
            className={ticketButtonClassName}
          >
            View details
          </button>
        </div>
      </div>
    </article>
  )
}

export function TicketBrowseClient() {
  const { tickets, loading, error, retry } = useTicketExplorer()
  const { activeTicketId, openTicketDetails, closeTicketDetails } = useTicketDetails()
  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId)
  const { handleRetry, retryRef, resultsRef } = useRetryFocus(loading, error, retry)

  return (
    <div className="space-y-6 text-white">
      <BackLink href="/dashboard" className="lg:hidden">
        Return to dashboard
      </BackLink>
      <RaceHero
        title={
          <>
            {nextRace.name}
            <span className="sr-only"> tickets</span>
          </>
        }
        venue={`${nextRace.venue}, ${nextRace.location}`}
        dateRange={nextRace.dateRange}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {loading ? (
            <TicketLoading />
          ) : error ? (
            <TicketLoadError retry={handleRetry} retryRef={retryRef} />
          ) : (
            <div
              ref={resultsRef}
              tabIndex={-1}
              aria-label="Ticket results"
              className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {tickets.length === 0 ? (
                <div className={panel}>
                  <EmptyState
                    icon={Ticket}
                    title="No tickets available"
                    description="Please check back soon for available ticket types."
                    action={
                      <button type="button" onClick={retry} className={ticketButtonClassName}>
                        Check again
                      </button>
                    }
                  />
                </div>
              ) : (
                <ul aria-label="Available ticket types" className="grid gap-6 md:grid-cols-2">
                  {tickets.map((ticket) => (
                    <li key={ticket.id}>
                      <TicketBrowseCard ticket={ticket} onViewDetails={openTicketDetails} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!loading && !error && <TicketSelection onViewDetails={openTicketDetails} />}
          <Panel title="Your tickets">
            <TicketCard ticket={userPass} />
          </Panel>
          <UpgradesPanel upgrades={upgradePackages} />
          <NextEventsPanel events={upcomingEvents} />
        </div>
      </div>

      {activeTicketId && !loading && !error && (
        <TicketDetailsDialog ticket={activeTicket ?? null} onClose={closeTicketDetails} />
      )}
    </div>
  )
}
