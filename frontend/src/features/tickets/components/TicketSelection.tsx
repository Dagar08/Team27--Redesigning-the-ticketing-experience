'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { TicketType } from '@/types/firestore'
import { MAX_SELECTED_TICKETS, useTicketExplorer } from './TicketExplorerProvider'
import { TicketPrice, ticketButtonClassName } from './TicketElements'

export function TicketSelectionButton({ ticket }: { ticket: TicketType }) {
  const { selectedTickets, addTicket, removeTicket } = useTicketExplorer()
  const selected = selectedTickets.some((item) => item.id === ticket.id)
  const limitReached = !selected && selectedTickets.length >= MAX_SELECTED_TICKETS

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={limitReached}
      aria-label={`${selected ? 'Remove from' : 'Add to'} selection: ${ticket.name}`}
      onClick={() => (selected ? removeTicket(ticket.id) : addTicket(ticket.id))}
      className={cn(
        ticketButtonClassName,
        selected
          ? 'border-gp-green-500 text-gp-green-400'
          : 'bg-gp-green-500 text-asphalt-950 hover:bg-gp-green-400 border-transparent'
      )}
    >
      {selected
        ? 'Remove from selection'
        : limitReached
          ? 'Selection limit reached'
          : 'Add to selection'}
    </button>
  )
}

export function TicketSelection({ onViewDetails }: { onViewDetails: (id: string) => void }) {
  const { selectedTickets, removeTicket, clearSelection } = useTicketExplorer()

  return (
    <aside
      aria-label="Your selection"
      className="bg-asphalt-900 space-y-4 self-start rounded-xl border border-white/10 p-6"
    >
      <h2 className="text-lg font-semibold text-white">Your selection</h2>

      <p role="status" className="text-sm text-zinc-400">
        {selectedTickets.length} ticket {selectedTickets.length === 1 ? 'type' : 'types'} selected
      </p>
      <p className="text-sm text-zinc-400">
        Choose up to {MAX_SELECTED_TICKETS} ticket types to compare.
        {selectedTickets.length >= MAX_SELECTED_TICKETS && ' Remove one to select another.'}
      </p>

      {selectedTickets.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No tickets selected. Add a ticket from the list or its details.
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {selectedTickets.map((ticket) => (
              <li key={ticket.id} className="space-y-3 rounded-lg border border-white/10 p-4">
                <button
                  type="button"
                  aria-label={`View details: ${ticket.name}`}
                  onClick={() => onViewDetails(ticket.id)}
                  className="hover:text-gp-green-400 focus-visible:outline-gp-green-400 active:text-gp-green-400 inline-flex min-h-11 min-w-11 items-center text-left text-sm font-medium text-white hover:underline focus-visible:outline-2"
                >
                  {ticket.name}
                </button>

                <TicketPrice price={ticket.priceAud} />

                <button
                  type="button"
                  aria-label={`Remove ${ticket.name} from selection`}
                  onClick={() => removeTicket(ticket.id)}
                  className={ticketButtonClassName}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {selectedTickets.length >= 2 && (
            <Link
              href="/tickets/compare"
              className="bg-gp-green-500 text-asphalt-950 hover:bg-gp-green-400 active:bg-gp-green-600 inline-flex min-h-11 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors"
            >
              Compare selected tickets
            </Link>
          )}

          <button type="button" onClick={clearSelection} className={ticketButtonClassName}>
            Clear selection
          </button>
        </>
      )}
    </aside>
  )
}
