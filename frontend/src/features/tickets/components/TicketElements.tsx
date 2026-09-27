import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { TicketType } from '@/types/firestore'

export const ticketButtonClassName =
  'inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gp-green-400'

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

export function TicketFacts({ ticket }: { ticket: TicketType }) {
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt className="text-zinc-400">Days covered</dt>
        <dd className="mt-1 text-white">{ticket.daysCovered.join(', ') || 'Not specified'}</dd>
      </div>
      <div>
        <dt className="text-zinc-400">Zone</dt>
        <dd className="mt-1 text-white">{ticket.zone}</dd>
      </div>
    </dl>
  )
}

export function TicketLoading() {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-zinc-400">
      <LoadingSpinner />
      <p>Loading tickets...</p>
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
