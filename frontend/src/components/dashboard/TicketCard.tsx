import type { Ticket } from '@/features/dashboard/types'

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-white/10 bg-asphalt-900">
      <div className="flex-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gp-green-400">
          Upcoming
        </p>
        <p className="mt-1 font-semibold text-white">{ticket.eventName}</p>
        <p className="mt-1 text-sm text-zinc-400">{ticket.dateRange}</p>
      </div>
      <div className="flex w-28 shrink-0 flex-col items-center justify-center gap-1 border-l border-white/10 bg-asphalt-800 p-3 text-center">
        <p className="text-xs text-zinc-400">{ticket.venue}</p>
        <p className="text-xs text-zinc-400">{ticket.seat}</p>
        <div
          className="mt-1 flex h-12 w-12 items-center justify-center rounded border border-dashed border-white/20 text-[10px] text-zinc-500"
          aria-label="QR code placeholder"
        >
          QR
        </div>
      </div>
    </div>
  )
}