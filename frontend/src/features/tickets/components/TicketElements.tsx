import type { Ref } from 'react'
import type { TicketType } from '@/types/firestore'
import { cn } from '@/lib/utils'
import { buttonOutline, panel } from '@/lib/styles'
import { TicketZoneIndicator } from './TicketZoneIndicator'

/** Red outline action used across the ticket screens ("VIEW DETAILS", "RETRY"). */
export const ticketButtonClassName = buttonOutline

const audFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

/** Mockup red is only used at this large, black weight, where it passes 3:1 (WCAG large text). */
export function TicketPrice({ price, className }: { price: number; className?: string }) {
  return (
    <p
      className={cn(
        'font-display text-gp-red-500 text-2xl font-black font-stretch-semi-expanded',
        className
      )}
    >
      {audFormatter.format(price)}{' '}
      <span className="font-sans text-xs font-semibold text-zinc-300">AUD</span>
    </p>
  )
}

export function TicketFacts({
  ticket,
  showZoneIndicator = false,
  align = 'start',
}: {
  ticket: TicketType
  showZoneIndicator?: boolean
  /** Cards right-align the facts opposite the price, as in the Browse mockup. */
  align?: 'start' | 'end'
}) {
  return (
    <dl
      className={cn(
        'text-sm',
        align === 'end'
          ? 'flex flex-wrap gap-x-6 gap-y-2 sm:ml-auto sm:justify-end sm:text-right'
          : 'grid grid-cols-2 gap-4'
      )}
    >
      <div>
        <dt className="text-xs tracking-wide text-zinc-300 uppercase">Days covered</dt>
        <dd className="font-display mt-1 font-bold text-white">
          {ticket.daysCovered.join(', ') || 'Not specified'}
        </dd>
      </div>
      <div>
        <dt className="text-xs tracking-wide text-zinc-300 uppercase">Zone</dt>
        <dd className="font-display mt-1 font-bold text-white">
          {showZoneIndicator ? (
            <TicketZoneIndicator zone={ticket.zone} />
          ) : (
            ticket.zone?.trim() || 'Not specified'
          )}
        </dd>
      </div>
    </dl>
  )
}

const glint = 'skeleton motion-safe:animate-shimmer'

/** Glinting placeholders in the same positions as a ticket card, so the grid keeps its shape. */
export function TicketLoading() {
  return (
    <div role="status" aria-label="Loading" aria-busy="true">
      <p className="sr-only">Loading tickets...</p>
      <div aria-hidden="true" className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={cn(panel, 'overflow-hidden')}>
            <div className="p-4 pb-0">
              <div className={cn(glint, 'aspect-[1200/729] rounded-xl border border-white/10')} />
            </div>
            <div className="mt-4 space-y-4 border-t border-white/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className={cn(glint, 'h-8 w-28 rounded')} />
                <div className="space-y-2">
                  <div className={cn(glint, 'ml-auto h-4 w-20 rounded')} />
                  <div className={cn(glint, 'h-4 w-32 rounded')} />
                </div>
              </div>
              <div className={cn(glint, 'h-12 rounded')} />
              <div className="border-gp-red-500/60 h-11 w-40 rounded-xl border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const TICKET_LOAD_ERROR_MESSAGE = "We couldn't load tickets right now. Please try again."
export const TICKET_OFFLINE_MESSAGE = "You're offline. Check your connection and try again."

/**
 * ERR-01, FS-01 to FS-03: one plain-language message for every failed read
 * (network, server, permissions, timeout). Technical detail stays in the console.
 */
export function describeTicketLoadError() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return TICKET_OFFLINE_MESSAGE
  }
  return TICKET_LOAD_ERROR_MESSAGE
}

export function TicketLoadError({
  retry,
  retryRef,
}: {
  retry: () => void
  retryRef?: Ref<HTMLButtonElement>
}) {
  return (
    <div className={cn(panel, 'flex flex-col items-center gap-6 px-6 py-16 text-center')}>
      <p role="alert" className="font-display text-base font-bold text-white sm:text-lg">
        {describeTicketLoadError()}
      </p>
      <button
        ref={retryRef}
        type="button"
        onClick={retry}
        className={cn(buttonOutline, 'min-h-14 w-full max-w-sm text-base')}
      >
        Retry
      </button>
    </div>
  )
}
