import type { Ticket } from '@/features/dashboard/types'

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="rounded-xl border border-gp-green-500/40 bg-asphalt-900 p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gp-green-400">
          Upcoming pass
        </p>
        <div
          className="flex h-8 w-8 items-center justify-center rounded border border-dashed border-white/20 text-[9px] text-zinc-500"
          aria-label="QR code placeholder"
        >
          QR
        </div>
      </div>

      <p className="mt-2 font-semibold text-white">{ticket.eventName}</p>
      <p className="mt-1 text-sm text-zinc-400">
        {ticket.circuitName} · {ticket.dateRange}
      </p>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-xs text-zinc-500">{ticket.tier}</p>
        <p className="text-sm font-medium text-white">{ticket.holderName}</p>
        <p className="mt-2 text-xs text-zinc-500">Seat details</p>
        <p className="text-sm font-medium text-gp-green-400">{ticket.seatDetails}</p>
      </div>
    </div>
  )
}