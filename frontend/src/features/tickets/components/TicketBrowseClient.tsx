'use client'

import Link from 'next/link'
import { Ticket } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { useTicketExplorer } from './TicketExplorerProvider'
import {
  TicketFacts,
  TicketLoadError,
  TicketLoading,
  TicketPrice,
  ticketButtonClassName,
} from './TicketElements'
import { TicketSelection, TicketSelectionButton } from './TicketSelection'
import { TicketDetailsDialog } from './TicketDetailsDialog'
import { useTicketDetails } from '../hooks/useTicketDetails'

export function TicketBrowseClient() {
  const { tickets, loading, error, retry } = useTicketExplorer()
  const { activeTicketId, openTicketDetails, closeTicketDetails } = useTicketDetails()
  const activeTicket = tickets.find((ticket) => ticket.id === activeTicketId)

  return (
    <div className="space-y-6 text-white">
      <Link href="/dashboard" className={ticketButtonClassName}>
        Back to dashboard
      </Link>
      <PageHeader
        title="Browse tickets"
        description="Explore Australian Grand Prix ticket types and choose your favourites."
      />
      {loading ? (
        <TicketLoading />
      ) : error ? (
        <TicketLoadError
          message="We couldn't load tickets right now. Please try again."
          retry={retry}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            {tickets.length === 0 ? (
              <EmptyState
                icon={Ticket}
                title="No tickets available"
                description="Please check back soon for available ticket types."
              />
            ) : (
              <ul aria-label="Available ticket types" className="grid gap-6 md:grid-cols-2">
                {tickets.map((ticket) => (
                  <li key={ticket.id}>
                    <article className="bg-asphalt-900 focus-within:border-gp-green-400/60 flex h-full flex-col gap-4 rounded-xl border border-white/10 p-6 transition-colors hover:border-white/30">
                      <h2 className="text-lg font-semibold text-white">{ticket.name}</h2>
                      <TicketPrice price={ticket.priceAud} />
                      <TicketFacts ticket={ticket} />
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {ticket.viewDescription || 'View description coming soon.'}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => openTicketDetails(ticket.id)}
                          aria-label={`View details: ${ticket.name}`}
                          className={ticketButtonClassName}
                        >
                          View details
                        </button>
                        <TicketSelectionButton ticket={ticket} />
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <TicketSelection onViewDetails={openTicketDetails} />
        </div>
      )}
      {activeTicketId && !loading && !error && (
        <TicketDetailsDialog ticket={activeTicket ?? null} onClose={closeTicketDetails} />
      )}
    </div>
  )
}
