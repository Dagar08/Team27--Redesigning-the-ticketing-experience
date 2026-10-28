'use client'

import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import Link from 'next/link'
import { Scale } from 'lucide-react'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'
import { buttonPrimary, buttonSecondary, displayItalic, panel } from '@/lib/styles'
import type { TicketType } from '@/types/firestore'
import { useTicketExplorer } from './TicketExplorerProvider'
import {
  COMPARE_TICKETS_PARAM,
  TicketLoadError,
  TicketLoading,
  TicketPrice,
} from './TicketElements'
import { useRetryFocus } from '../hooks/useRetryFocus'
import { useRemovalFocus } from '../hooks/useRemovalFocus'
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

function compareRows(tickets: TicketType[]): CompareRow[] {
  return [
    {
      label: 'Circuit map',
      differs: false,
      render: (ticket) => (
        <CircuitMap zone={ticket.zone} label={`Circuit map for ${ticket.name}`} />
      ),
    },
    {
      label: 'Price',
      differs: valuesDiffer(tickets.map((ticket) => String(ticket.priceAud))),
      render: (ticket) => <TicketPrice price={ticket.priceAud} />,
    },
    {
      label: 'Days',
      differs: valuesDiffer(tickets.map((ticket) => ticket.daysCovered.join(', '))),
      render: (ticket) => (
        <p className="font-display font-bold text-white">
          {ticket.daysCovered.join(', ') || 'Not specified'}
        </p>
      ),
    },
    {
      label: 'Zone',
      differs: valuesDiffer(tickets.map((ticket) => ticket.zone)),
      render: (ticket) => (
        <p className="font-display font-bold text-white">{ticket.zone.trim() || 'Not specified'}</p>
      ),
    },
    {
      label: 'View',
      differs: valuesDiffer(tickets.map((ticket) => ticket.viewDescription || 'Not specified')),
      render: (ticket) => (
        <p className="font-display text-sm leading-relaxed font-semibold text-zinc-200">
          {ticket.viewDescription || 'Not specified'}
        </p>
      ),
    },
    {
      label: 'Includes',
      differs: valuesDiffer(tickets.map((ticket) => (ticket.includes ?? []).join('|'))),
      render: (ticket) => <FeatureList items={ticket.includes} />,
    },
    {
      label: 'Excludes',
      differs: valuesDiffer(tickets.map((ticket) => (ticket.excludes ?? []).join('|'))),
      render: (ticket) => <FeatureList items={ticket.excludes} />,
    },
  ]
}

/** Each column is styled as a card; the table keeps header semantics for screen readers. */
function CompareTable({
  tickets,
  containerRef,
  removeButtonRef,
  onRemove,
}: {
  tickets: TicketType[]
  containerRef?: Ref<HTMLDivElement>
  removeButtonRef: (index: number) => Ref<HTMLButtonElement>
  onRemove: (ticket: TicketType, index: number) => void
}) {
  const rows = compareRows(tickets)

  return (
    <div
      ref={containerRef}
      tabIndex={containerRef ? -1 : undefined}
      className="-mx-4 overflow-x-auto rounded-2xl pb-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
    >
      <table
        className={cn(
          'w-full table-fixed border-separate border-spacing-x-4 border-spacing-y-0',
          tickets.length === 3
            ? 'min-w-[54rem]'
            : tickets.length === 2
              ? 'min-w-[36rem]'
              : 'max-w-xl'
        )}
      >
        <caption className="sr-only">
          {tickets.length > 1
            ? 'Selected tickets side by side. Rows marked Differs have different values.'
            : 'Selected ticket details.'}
        </caption>
        <thead>
          <tr>
            {tickets.map((ticket, index) => (
              <th
                key={ticket.id}
                scope="col"
                className="bg-asphalt-900 border-asphalt-600 rounded-t-2xl border-x border-t p-5 text-left align-top"
              >
                <h2 className={cn(displayItalic, 'text-2xl text-white')}>{ticket.name}</h2>
                <button
                  ref={removeButtonRef(index)}
                  type="button"
                  onClick={() => onRemove(ticket, index)}
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
              {tickets.map((ticket) => (
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
  )
}

/** ERR-09 wording for selected tickets that are no longer in the catalog. */
function unavailableMessage(count: number) {
  return count === 1
    ? 'One ticket is no longer available. It has been removed from this comparison.'
    : `${count} tickets are no longer available. They have been removed from this comparison.`
}

export function TicketCompareClient() {
  const { selectedTickets, unavailableCount, selectTickets, removeTicket, loading, error, retry } =
    useTicketExplorer()
  const { handleRetry, retryRef, resultsRef } = useRetryFocus(loading, error, retry)
  // A11Y-08: after a removal, focus the next Remove button, or the prompt once fewer than two remain.
  const { removeButtonRef, markRemoved } = useRemovalFocus(selectedTickets.length, resultsRef, 2)
  const [announcement, setAnnouncement] = useState('')
  const sharedLinkRead = useRef(false)
  const comparing = selectedTickets.length >= 2
  const loaded = !loading && !error
  const selectedIds = selectedTickets.map((ticket) => ticket.id).join(',')

  // ERR-09: a shared link (?tickets=a,b) replaces the in-memory selection, once.
  useEffect(() => {
    if (sharedLinkRead.current) return
    sharedLinkRead.current = true
    const shared = new URLSearchParams(window.location.search).get(COMPARE_TICKETS_PARAM)
    if (shared) selectTickets(shared.split(','))
  }, [selectTickets])

  // Keep the address bar shareable as columns are removed.
  useEffect(() => {
    if (!loaded) return
    const url = new URL(window.location.href)
    if (selectedIds) url.searchParams.set(COMPARE_TICKETS_PARAM, selectedIds)
    else url.searchParams.delete(COMPARE_TICKETS_PARAM)
    window.history.replaceState(null, '', url)
  }, [loaded, selectedIds])

  const handleRemove = (ticket: TicketType, index: number) => {
    markRemoved(index)
    // A11Y-12: removals are announced as well as shown.
    setAnnouncement(`${ticket.name} removed from comparison.`)
    removeTicket(ticket.id)
  }

  return (
    <div className="space-y-6 text-white">
      <BackLink href="/tickets" className="lg:hidden">
        Return to tickets
      </BackLink>

      <PageHeader
        title="Compare tickets"
        description={
          comparing && loaded
            ? 'Compare your selected Australian Grand Prix ticket options side by side.'
            : 'Select at least two tickets to compare them side by side.'
        }
      />

      <p role="status" className="sr-only">
        {announcement}
      </p>

      {loading ? (
        <TicketLoading />
      ) : error ? (
        <TicketLoadError retry={handleRetry} retryRef={retryRef} />
      ) : (
        <>
          {unavailableCount > 0 && (
            <p role="status" className={cn(panel, 'border-gp-red-500 p-4 text-sm font-semibold')}>
              {unavailableMessage(unavailableCount)}
            </p>
          )}

          {comparing ? (
            <>
              <CompareTable
                tickets={selectedTickets}
                containerRef={resultsRef}
                removeButtonRef={removeButtonRef}
                onRemove={handleRemove}
              />
              <p className="text-sm text-zinc-300">
                Rows marked Differs have different values across the selected tickets.
              </p>
            </>
          ) : (
            <>
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
                  // EMP-04 and EMP-05 wording, announced when the prompt changes.
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
                  announce
                  action={
                    <Link href="/tickets" className={buttonPrimary}>
                      Browse tickets
                    </Link>
                  }
                />
              </div>

              {/* EMP-05: the one selected ticket's details, ready for a second column. */}
              {selectedTickets.length === 1 && (
                <CompareTable
                  tickets={selectedTickets}
                  removeButtonRef={removeButtonRef}
                  onRemove={handleRemove}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
