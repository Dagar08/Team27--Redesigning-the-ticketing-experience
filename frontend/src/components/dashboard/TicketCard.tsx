
'use client'

import QRCode from 'react-qr-code'
import { QrCode } from 'lucide-react'
import type { Ticket } from '@/features/dashboard/types'
import { cn } from '@/lib/utils'
import { displayItalic, displayTitle } from '@/lib/styles'

const DEMO_TICKET_URL =
  'https://team27-redesigning-the-ticketing-ex.vercel.app/tickets'

/**
 * Demonstration ticket card.
 * The QR code opens the live ticket browser.
 * It is not a valid admission credential.
 */
export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <article
      aria-label={`Upcoming pass: ${ticket.eventName}`}
      className="bg-asphalt-950 border-gp-red-500 rounded-xl border-2 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn(displayTitle, 'text-gp-red-400 text-xs')}>
          Upcoming pass
        </p>

        <QrCode
          aria-hidden="true"
          className="text-gp-red-500 size-4 shrink-0"
        />
      </div>

      <p className={cn(displayItalic, 'mt-2 text-xl text-white')}>
        {ticket.eventName}
      </p>

      <p className="mt-1 text-xs text-zinc-300">
        {ticket.circuitName} • {ticket.dateRange}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
        <dl className="min-w-0 space-y-2">
          <div>
            <dt className="text-xs tracking-wide text-zinc-300 uppercase">
              {ticket.tier}
            </dt>

            <dd className="text-sm font-semibold text-white">
              {ticket.holderName}
            </dd>
          </div>

          <div>
            <dt className="text-xs tracking-wide text-zinc-300 uppercase">
              Seat details
            </dt>

            <dd className="text-gp-red-400 text-sm font-bold">
              {ticket.seatDetails}
            </dd>
          </div>
        </dl>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <a
            href={DEMO_TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open demo ticket browser"
            className="rounded-lg bg-white p-2"
          >
            <QRCode
              value={DEMO_TICKET_URL}
              size={96}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </a>

          <p className="max-w-28 text-center text-xs text-zinc-400">
            Demo link — not valid for entry
          </p>
        </div>
      </div>
    </article>
  )
}
