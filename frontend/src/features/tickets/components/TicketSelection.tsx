'use client'

import { useId, useRef } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonSecondary, displayTitle, focusRing, panel } from '@/lib/styles'
import type { TicketType } from '@/types/firestore'
import { MAX_SELECTED_TICKETS, useTicketExplorer } from './TicketExplorerProvider'
import { TicketPrice, compareHref } from './TicketElements'
import { useRemovalFocus } from '../hooks/useRemovalFocus'

/** The red "COMPARE" checkbox from the Browse mockup; it adds or removes the ticket from the selection. */
export function TicketCompareToggle({ ticket }: { ticket: TicketType }) {
  const { selectedTickets, addTicket, removeTicket } = useTicketExplorer()
  const hintId = useId()
  const selected = selectedTickets.some((item) => item.id === ticket.id)
  const limitReached = !selected && selectedTickets.length >= MAX_SELECTED_TICKETS

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <label
        className={cn(
          'inline-flex min-h-11 items-center gap-3',
          limitReached ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <span className="relative grid size-6 shrink-0 place-items-center">
          <input
            type="checkbox"
            checked={selected}
            disabled={limitReached}
            aria-describedby={limitReached ? hintId : undefined}
            onChange={() => (selected ? removeTicket(ticket.id) : addTicket(ticket.id))}
            className={cn(
              'peer border-gp-red-500 checked:bg-gp-red-500 disabled:border-asphalt-600 size-6 appearance-none rounded-md border-2 bg-transparent transition-colors',
              focusRing
            )}
          />
          <Check
            aria-hidden="true"
            strokeWidth={3}
            className="pointer-events-none absolute size-4 text-white opacity-0 peer-checked:opacity-100"
          />
        </span>
        <span
          className={cn(
            'text-sm font-semibold tracking-wide uppercase',
            limitReached ? 'text-zinc-300' : 'text-white'
          )}
        >
          Compare<span className="sr-only"> {ticket.name}</span>
        </span>
      </label>
      {limitReached && (
        <span id={hintId} className="text-xs text-zinc-300">
          Selection limit reached
        </span>
      )}
    </div>
  )
}

export function TicketSelection({ onViewDetails }: { onViewDetails: (id: string) => void }) {
  const { selectedTickets, removeTicket, clearSelection } = useTicketExplorer()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { removeButtonRef, markRemoved } = useRemovalFocus(selectedTickets.length, headingRef)

  return (
    <aside aria-label="Your selection" className={cn(panel, 'space-y-4 self-start p-5 sm:p-6')}>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className={cn(displayTitle, 'rounded-sm text-lg text-white sm:text-xl', focusRing)}
      >
        Your selection
      </h2>

      <p role="status" className="text-sm font-semibold text-white">
        {selectedTickets.length} ticket {selectedTickets.length === 1 ? 'type' : 'types'} selected
      </p>
      <p className="text-sm text-zinc-300">
        Choose up to {MAX_SELECTED_TICKETS} ticket types to compare.
        {selectedTickets.length >= MAX_SELECTED_TICKETS && ' Remove one to select another.'}
      </p>

      {selectedTickets.length === 0 ? (
        <p className="text-sm text-zinc-300">
          No tickets selected. Tick Compare on a ticket or in its details.
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {selectedTickets.map((ticket, index) => (
              <li
                key={ticket.id}
                className="bg-asphalt-950 border-asphalt-600 space-y-3 rounded-xl border p-4"
              >
                <button
                  type="button"
                  aria-label={`View details: ${ticket.name}`}
                  onClick={() => onViewDetails(ticket.id)}
                  className={cn(
                    'font-display hover:text-gp-red-400 inline-flex min-h-11 items-center rounded-sm text-left text-base font-bold text-white hover:underline',
                    focusRing
                  )}
                >
                  {ticket.name}
                </button>

                <TicketPrice price={ticket.priceAud} className="text-xl" />

                <button
                  ref={removeButtonRef(index)}
                  type="button"
                  aria-label={`Remove ${ticket.name} from selection`}
                  onClick={() => {
                    markRemoved(index)
                    removeTicket(ticket.id)
                  }}
                  className={buttonSecondary}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {selectedTickets.length >= 2 && (
            <Link
              href={compareHref(selectedTickets)}
              className={cn(
                displayTitle,
                'border-gp-red-500 hover:bg-gp-red-500/15 active:bg-gp-red-500/25 flex min-h-20 w-full items-center justify-center rounded-2xl border-2 text-2xl text-white transition-colors',
                focusRing
              )}
            >
              Compare<span className="sr-only"> selected tickets</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              // No Remove buttons are left, so focus falls back to the heading.
              markRemoved(0)
              clearSelection()
            }}
            className={buttonSecondary}
          >
            Clear selection
          </button>
        </>
      )}
    </aside>
  )
}
