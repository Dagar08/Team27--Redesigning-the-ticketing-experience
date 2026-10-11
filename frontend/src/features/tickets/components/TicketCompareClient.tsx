'use client'

import Link from 'next/link'
import { useTicketExplorer } from './TicketExplorerProvider'
import { ticketButtonClassName } from './TicketElements'
import { PageHeader } from '@/components/layout/PageHeader'

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
  const { selectedTickets, removeTicket } = useTicketExplorer()

  const priceDiffers = valuesDiffer(
    selectedTickets.map((ticket) => String(ticket.priceAud))
  )

  const daysDiffers = valuesDiffer(
    selectedTickets.map((ticket) => ticket.daysCovered.join(', '))
  )

  const zoneDiffers = valuesDiffer(
    selectedTickets.map((ticket) => ticket.zone)
  )

  const viewDiffers = valuesDiffer(
    selectedTickets.map((ticket) => ticket.viewDescription || 'Not specified')
  )

  const includesDiffers = valuesDiffer(
    selectedTickets.map((ticket) => (ticket.includes ?? []).join('|'))
  )

  const excludesDiffers = valuesDiffer(
    selectedTickets.map((ticket) => (ticket.excludes ?? []).join('|'))
  )

  if (selectedTickets.length < 2) {
    return (
      <div className="space-y-6 text-white">
        <Link href="/tickets" className={ticketButtonClassName}>
          Back to tickets
        </Link>

        <PageHeader
          title="Compare tickets"
          description="Select at least two tickets to compare them side by side."
        />

        <div className="bg-asphalt-900 rounded-xl border border-white/10 p-6">
          <p className="text-sm text-zinc-400">
            You need to select at least two ticket types before comparing.
          </p>

          <Link
            href="/tickets"
            className="bg-gp-green-500 text-asphalt-950 hover:bg-gp-green-400 mt-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors"
          >
            Browse tickets
          </Link>
        </div>
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

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[800px] w-full border-collapse bg-asphalt-900">
          <thead>
            <tr className="border-b border-white/10">
              <th className="w-40 p-4 text-left text-sm font-semibold text-zinc-400">
                Feature
              </th>

              {selectedTickets.map((ticket) => (
                <th
                  key={ticket.id}
                  className="min-w-56 border-l border-white/10 p-4 text-left align-top"
                >
                  <div className="space-y-3">
                    <h2 className="text-base font-semibold text-white">
                      {ticket.name}
                    </h2>

                    <p className="text-sm text-zinc-400">
                      Zone:{' '}
                      <span className="font-medium text-white">
                        {ticket.zone}
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
            <tr
              className={`border-b border-white/10 ${
                priceDiffers ? 'bg-gp-gold-500/10' : ''
              }`}
            >
              <th className="p-4 text-left text-sm font-medium text-zinc-400">
                Price
              </th>

              {selectedTickets.map((ticket) => (
                <td
                  key={ticket.id}
                  className="border-l border-white/10 p-4 font-semibold text-gp-green-400"
                >
                  {formatPrice(ticket.priceAud)}
                </td>
              ))}
            </tr>

            <tr
              className={`border-b border-white/10 ${
                daysDiffers ? 'bg-gp-gold-500/10' : ''
              }`}
            >
              <th className="p-4 text-left text-sm font-medium text-zinc-400">
                Days
              </th>

              {selectedTickets.map((ticket) => (
                <td
                  key={ticket.id}
                  className="border-l border-white/10 p-4 text-sm text-white"
                >
                  {ticket.daysCovered.join(', ')}
                </td>
              ))}
            </tr>

            <tr
              className={`border-b border-white/10 ${
                zoneDiffers ? 'bg-gp-gold-500/10' : ''
              }`}
            >
              <th className="p-4 text-left text-sm font-medium text-zinc-400">
                Zone
              </th>

              {selectedTickets.map((ticket) => (
                <td
                  key={ticket.id}
                  className="border-l border-white/10 p-4 text-sm text-white"
                >
                  {ticket.zone}
                </td>
              ))}
            </tr>

            <tr
              className={`border-b border-white/10 ${
                viewDiffers ? 'bg-gp-gold-500/10' : ''
              }`}
            >
              <th className="p-4 text-left text-sm font-medium text-zinc-400">
                View
              </th>

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
              className={`border-b border-white/10 ${
                includesDiffers ? 'bg-gp-gold-500/10' : ''
              }`}
            >
              <th className="p-4 text-left align-top text-sm font-medium text-zinc-400">
                Includes
              </th>

              {selectedTickets.map((ticket) => (
                <td
                  key={ticket.id}
                  className="border-l border-white/10 p-4 align-top"
                >
                  {ticket.includes?.length ? (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
                      {ticket.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-zinc-500">
                      Not specified
                    </span>
                  )}
                </td>
              ))}
            </tr>

            <tr className={excludesDiffers ? 'bg-gp-gold-500/10' : ''}>
              <th className="p-4 text-left align-top text-sm font-medium text-zinc-400">
                Excludes
              </th>

              {selectedTickets.map((ticket) => (
                <td
                  key={ticket.id}
                  className="border-l border-white/10 p-4 align-top"
                >
                  {ticket.excludes?.length ? (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
                      {ticket.excludes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-zinc-500">
                      Not specified
                    </span>
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