'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Scale } from 'lucide-react'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'
import { buttonPrimary, buttonSecondary, displayItalic, panel } from '@/lib/styles'
import type { TicketType } from '@/types/firestore'
import { useTicketExplorer } from './TicketExplorerProvider'
import { TicketLoadError, TicketLoading, TicketPrice } from './TicketElements'
import { useRetryFocus } from '../hooks/useRetryFocus'
import { CircuitMap } from './CircuitMap'

function valuesDiffer(values: string[]) {
  return new Set(values).size > 1
}

/** Red-square feature list from the Compare mockup. */
function FeatureList({ items }: { items?: string[] }) {
  if (!items?.length) return <span className="text-sm text-zinc-300">Not specified</span>

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${item}`}
          className="font-display flex gap-3 text-sm font-semibold text-zinc-200"
        >
          <span aria-hidden="true" className="bg-gp-red-500 mt-0.5 size-4 shrink-0 rounded-sm" />
          {item}
        </li>
      ))}
    </ul>
  )
}

interface CompareRow {
  label: string
  differs: boolean
  render: (ticket: TicketType) => ReactNode
}

export function TicketCompareClient() {
  const { selectedTickets, removeTicket, loading, error, retry } = useTicketExplorer()
  const { handleRetry, retryRef, resultsRef } = useRetryFocus(loading, error, retry)

  if (loading || error || selectedTickets.length < 2) {
    return (
      <div className="space-y-6 text-white">
        <BackLink href="/tickets" className="lg:hidden">
          Return to tickets
        </BackLink>

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
            className={cn(
              panel,
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
            )}
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
                <Link href="/tickets" className={buttonPrimary}>
                  Browse tickets
                </Link>
              }
            />
          </div>
        )}
      </div>
    )
  }

  const rows: CompareRow[] = [
    {
      label: 'Circuit map',
      differs: false,
      render: (ticket) => (
        <CircuitMap zone={ticket.zone} label={`Circuit map for ${ticket.name}`} />
      ),
    },
    {
      label: 'Price',
      differs: valuesDiffer(selectedTickets.map((ticket) => String(ticket.priceAud))),
      render: (ticket) => <TicketPrice price={ticket.priceAud} />,
    },
    {
      label: 'Days',
      differs: valuesDiffer(selectedTickets.map((ticket) => ticket.daysCovered.join(', '))),
      render: (ticket) => (
        <p className="font-display font-bold text-white">
          {ticket.daysCovered.join(', ') || 'Not specified'}
        </p>
      ),
    },
    {
      label: 'Zone',
      differs: valuesDiffer(selectedTickets.map((ticket) => ticket.zone)),
      render: (ticket) => (
        <p className="font-display font-bold text-white">{ticket.zone.trim() || 'Not specified'}</p>
      ),
    },
    {
      label: 'View',
      differs: valuesDiffer(
        selectedTickets.map((ticket) => ticket.viewDescription || 'Not specified')
      ),
      render: (ticket) => (
        <p className="font-display text-sm leading-relaxed font-semibold text-zinc-200">
          {ticket.viewDescription || 'Not specified'}
        </p>
      ),
    },
    {
      label: 'Includes',
      differs: valuesDiffer(selectedTickets.map((ticket) => (ticket.includes ?? []).join('|'))),
      render: (ticket) => <FeatureList items={ticket.includes} />,
    },
    {
      label: 'Excludes',
      differs: valuesDiffer(selectedTickets.map((ticket) => (ticket.excludes ?? []).join('|'))),
      render: (ticket) => <FeatureList items={ticket.excludes} />,
    },
  ]

  return (
    <div className="space-y-6 text-white">
      <BackLink href="/tickets" className="lg:hidden">
        Return to tickets
      </BackLink>

      <PageHeader
        title="Compare tickets"
        description="Compare your selected Australian Grand Prix ticket options side by side."
      />

      {/* Each column is styled as a card; the table keeps header semantics for screen readers. */}
      <div
        ref={resultsRef}
        tabIndex={-1}
        className="-mx-4 overflow-x-auto rounded-2xl pb-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
      >
        <table
          className={cn(
            'w-full table-fixed border-separate border-spacing-x-4 border-spacing-y-0',
            selectedTickets.length === 3 ? 'min-w-[54rem]' : 'min-w-[36rem]'
          )}
        >
          <caption className="sr-only">
            Selected tickets side by side. Rows marked Differs have different values.
          </caption>
          <thead>
            <tr>
              {selectedTickets.map((ticket) => (
                <th
                  key={ticket.id}
                  scope="col"
                  className="bg-asphalt-900 border-asphalt-600 rounded-t-2xl border-x border-t p-5 text-left align-top"
                >
                  <h2 className={cn(displayItalic, 'text-2xl text-white')}>{ticket.name}</h2>
                  <button
                    type="button"
                    onClick={() => removeTicket(ticket.id)}
                    className={cn(buttonSecondary, 'mt-4')}
                    aria-label={`Remove ${ticket.name} from comparison`}
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.label}>
                {selectedTickets.map((ticket) => (
                  <td
                    key={ticket.id}
                    className={cn(
                      'border-asphalt-600 border-x px-5 py-4 align-top',
                      row.differs ? 'bg-gp-red-950' : 'bg-asphalt-900',
                      rowIndex === rows.length - 1 && 'rounded-b-2xl border-b'
                    )}
                  >
                    <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-zinc-300 uppercase">
                      <span>{row.label}</span>
                      {row.differs && (
                        <span className="border-gp-red-500 rounded-full border px-2 py-0.5 text-white">
                          Differs
                        </span>
                      )}
                    </p>
                    {row.render(ticket)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-zinc-300">
        Rows marked Differs have different values across the selected tickets.
      </p>
    </div>
  )
}
