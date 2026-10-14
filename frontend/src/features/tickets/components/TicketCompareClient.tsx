'use client'

import Link from 'next/link'
import { Scale } from 'lucide-react'
import { useTicketExplorer } from './TicketExplorerProvider'
import { TicketLoadError, TicketLoading, ticketButtonClassName } from './TicketElements'
import { PageHeader } from '@/components/layout/PageHeader'
import { useRetryFocus } from '../hooks/useRetryFocus'
import { EmptyState } from '@/components/shared/EmptyState'
import { CircuitMap } from './CircuitMap'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(price)
}

function valuesDiffer(values: string[]) {
  return new Set(values).size > 1
}

export function TicketCompareClient() {
  const { selectedTickets, removeTicket, loading, error, retry } = useTicketExplorer()
  const { handleRetry, retryRef, resultsRef } = useRetryFocus(loading, error, retry)

  const priceDiffers = valuesDiffer(selectedTickets.map((ticket) => String(ticket.priceAud)))

  const daysDiffers = valuesDiffer(selectedTickets.map((ticket) => ticket.daysCovered.join(', ')))

  const zoneDiffers = valuesDiffer(selectedTickets.map((ticket) => ticket.zone))

  const viewDiffers = valuesDiffer(
    selectedTickets.map((ticket) => ticket.viewDescription || 'Not specified')
  )

  const includesDiffers = valuesDiffer(
    selectedTickets.map((ticket) => (ticket.includes ?? []).join('|'))
  )

  const excludesDiffers = valuesDiffer(
    selectedTickets.map((ticket) => (ticket.excludes ?? []).join('|'))
  )

  if (loading || error || selectedTickets.length < 2) {
    return (
      <div className="space-y-6 text-white">
        <Link href="/tickets" className={ticketButtonClassName}>
          Back to tickets
        </Link>

        <PageHeader
          title="Compare tickets"
          description="Select at least two tickets to compare them side by side."
        />

        {loading ? (
          <TicketLoading />
        ) : error ? (
          <TicketLoadError retry={handleRetry} retryRef={retryRef} />
        ) : (
          <div
            ref={resultsRef}
            tabIndex={-1}
            className="bg-asphalt-900 focus-visible:outline-gp-green-400 rounded-xl border border-white/10 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <EmptyState
              icon={Scale}
              // EMP-04 and EMP-05 wording.
              title={
                selectedTickets.length === 0
                  ? 'Select 2 or 3 tickets to compare'
                  : 'Add at least one more ticket to compare'
              }
              description={
                selectedTickets.length === 1
                  ? `Selected: ${selectedTickets[0]?.name}. Selections reset when the page reloads.`
                  : 'Selections reset when the page reloads.'
              }
              action={
                <Link
                  href="/tickets"
                  className="bg-gp-green-500 text-asphalt-950 hover:bg-gp-green-400 focus-visible:outline-gp-green-400 inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Browse tickets
                </Link>
              }
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 text-white">
      <Link href="/tickets" className={ticketButtonClassName}>
        Back to tickets
      </Link>

      <PageHeader
        title="Compare tickets"
        description="Compare your selected Australian Grand Prix ticket options side by side."
      />

      <div
        ref={resultsRef}
        tabIndex={-1}
        className="focus-visible:outline-gp-green-400 overflow-x-auto rounded-xl border border-white/10 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <table className="bg-asphalt-900 w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="w-40 p-4 text-left text-sm font-semibold text-zinc-400">Feature</th>

              {selectedTickets.map((ticket) => (
                <th
                  key={ticket.id}
                  className="min-w-56 border-l border-white/10 p-4 text-left align-top"
                >
                  <div className="space-y-3">
                    <h2 className="text-base font-semibold text-white">{ticket.name}</h2>

                    <p className="text-sm text-zinc-400">
                      Zone:{' '}
                      <span className="font-medium text-white">
                        {ticket.zone.trim() || 'Not specified'}
                      </span>
                    </p>

                    <button
                      type="button"
                      onClick={() => removeTicket(ticket.id)}
                      className={ticketButtonClassName}
                      aria-label={`Remove ${ticket.name} from comparison`}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-white/10">
              <th scope="row" className="p-4 text-left align-top text-sm font-medium text-zinc-400">
                Circuit map
              </th>
              {selectedTickets.map((ticket) => (
                <td key={ticket.id} className="border-l border-white/10 p-4 align-top">
                  <CircuitMap zone={ticket.zone} label={`Circuit map for ${ticket.name}`} />
                </td>
              ))}
            </tr>
            <tr className={`border-b border-white/10 ${priceDiffers ? 'bg-gp-gold-500/10' : ''}`}>
              <th className="p-4 text-left text-sm font-medium text-zinc-400">Price</th>

              {selectedTickets.map((ticket) => (
                <td
                  key={ticket.id}
                  className="text-gp-green-400 border-l border-white/10 p-4 font-semibold"
                >
                  {formatPrice(ticket.priceAud)}
                </td>
              ))}
            </tr>

            <tr className={`border-b border-white/10 ${daysDiffers ? 'bg-gp-gold-500/10' : ''}`}>
              <th className="p-4 text-left text-sm font-medium text-zinc-400">Days</th>

              {selectedTickets.map((ticket) => (
                <td key={ticket.id} className="border-l border-white/10 p-4 text-sm text-white">
                  {ticket.daysCovered.join(', ') || 'Not specified'}
                </td>
              ))}
            </tr>

            <tr className={`border-b border-white/10 ${zoneDiffers ? 'bg-gp-gold-500/10' : ''}`}>
              <th className="p-4 text-left text-sm font-medium text-zinc-400">Zone</th>

              {selectedTickets.map((ticket) => (
                <td key={ticket.id} className="border-l border-white/10 p-4 text-sm text-white">
                  {ticket.zone.trim() || 'Not specified'}
                </td>
              ))}
            </tr>

            <tr className={`border-b border-white/10 ${viewDiffers ? 'bg-gp-gold-500/10' : ''}`}>
              <th className="p-4 text-left text-sm font-medium text-zinc-400">View</th>

              {selectedTickets.map((ticket) => (
                <td
                  key={ticket.id}
                  className="border-l border-white/10 p-4 text-sm leading-relaxed text-zinc-300"
                >
                  {ticket.viewDescription || 'Not specified'}
                </td>
              ))}
            </tr>

            <tr
              className={`border-b border-white/10 ${includesDiffers ? 'bg-gp-gold-500/10' : ''}`}
            >
              <th className="p-4 text-left align-top text-sm font-medium text-zinc-400">
                Includes
              </th>

              {selectedTickets.map((ticket) => (
                <td key={ticket.id} className="border-l border-white/10 p-4 align-top">
                  {ticket.includes?.length ? (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
                      {ticket.includes.map((item, index) => (
                        <li key={`${index}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-zinc-500">Not specified</span>
                  )}
                </td>
              ))}
            </tr>

            <tr className={excludesDiffers ? 'bg-gp-gold-500/10' : ''}>
              <th className="p-4 text-left align-top text-sm font-medium text-zinc-400">
                Excludes
              </th>

              {selectedTickets.map((ticket) => (
                <td key={ticket.id} className="border-l border-white/10 p-4 align-top">
                  {ticket.excludes?.length ? (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
                      {ticket.excludes.map((item, index) => (
                        <li key={`${index}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-zinc-500">Not specified</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-zinc-500">
        Highlighted rows contain differences between the selected tickets.
      </p>
    </div>
  )
}
