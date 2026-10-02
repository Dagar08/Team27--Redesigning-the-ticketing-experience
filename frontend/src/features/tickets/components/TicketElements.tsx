import type { TicketType } from '@/types/firestore'
import { TicketZoneIndicator } from './TicketZoneIndicator'

export const ticketButtonClassName =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5 active:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gp-green-400 disabled:cursor-not-allowed disabled:opacity-50'

const audFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

export function TicketPrice({ price }: { price: number }) {
  return (
    <p className="text-gp-green-400 text-xl font-semibold">
      {audFormatter.format(price)} <span className="text-xs text-zinc-400">AUD</span>
    </p>
  )
}

export function TicketFacts({
  ticket,
  showZoneIndicator = false,
}: {
  ticket: TicketType
  showZoneIndicator?: boolean
}) {
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt className="text-zinc-400">Days covered</dt>
        <dd className="mt-1 text-white">{ticket.daysCovered.join(', ') || 'Not specified'}</dd>
      </div>
      <div>
        <dt className="text-zinc-400">Zone</dt>
        <dd className="mt-1 text-white">
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

export function TicketLoading() {
  return (
    <div role="status" aria-label="Loading" aria-busy="true">
      <p className="sr-only">Loading tickets...</p>
      <div aria-hidden="true" className="grid gap-6 md:grid-cols-2 xl:w-2/3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="bg-asphalt-900 space-y-4 rounded-xl border border-white/10 p-6 motion-safe:animate-pulse"
          >
            <div className="h-6 w-3/4 rounded bg-white/10" />
            <div className="h-7 w-1/3 rounded bg-white/10" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 rounded bg-white/10" />
              <div className="h-10 rounded bg-white/10" />
            </div>
            <div className="h-14 rounded bg-white/10" />
            <div className="h-11 w-2/3 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TicketLoadError({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="bg-asphalt-900 space-y-4 rounded-xl border border-white/10 p-6">
      <p role="alert" className="text-sm text-red-400">
        {message}
      </p>
      <button type="button" onClick={retry} className={ticketButtonClassName}>
        Retry
      </button>
    </div>
  )
}
