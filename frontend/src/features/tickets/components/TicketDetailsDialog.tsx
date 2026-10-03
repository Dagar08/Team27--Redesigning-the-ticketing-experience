'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { TicketType } from '@/types/firestore'
import { TicketFacts, TicketPrice, ticketButtonClassName } from './TicketElements'
import { TicketSelectionButton } from './TicketSelection'

function TicketBenefits({ title, items }: { title: string; items?: string[] }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {items?.length ? (
        <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
          {items.map((item, index) => (
            <li key={`${index}-${item}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-400">Not specified for this ticket.</p>
      )}
    </section>
  )
}

export function TicketDetailsDialog({
  ticket,
  onClose,
}: {
  ticket: TicketType | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    closeButtonRef.current?.focus()

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="ticket-details-title"
      onClick={(event) => {
        if (event.target !== event.currentTarget) return

        const bounds = event.currentTarget.getBoundingClientRect()
        const clickedOutside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom

        if (clickedOutside) onClose()
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="bg-asphalt-950 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto overscroll-contain rounded-xl border border-white/10 p-0 text-white shadow-2xl backdrop:bg-black/80"
    >
      <article className="break-words">
        <header className="bg-asphalt-950 sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-6">
          <div className="min-w-0 flex-1 space-y-2">
            <h2 id="ticket-details-title" className="text-2xl font-bold tracking-tight">
              {ticket?.name || 'Ticket not found'}
            </h2>
            {ticket && <TicketPrice price={ticket.priceAud} />}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close ticket details"
            className={`${ticketButtonClassName} shrink-0 p-2`}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div className="space-y-6 p-4 sm:p-6">
          {ticket ? (
            <>
              <TicketFacts ticket={ticket} showZoneIndicator />

              <section className="space-y-3 border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white">Zone and location</h3>
                <p className="text-sm text-zinc-400">Zone map not available.</p>
                <p className="text-sm text-zinc-400">
                  Seat allocation not specified for this ticket.
                </p>
              </section>

              <section className="space-y-3 border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white">View description</h3>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {ticket.viewDescription || 'View description coming soon.'}
                </p>
              </section>

              <div className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2">
                <TicketBenefits title="What's included" items={ticket.includes} />
                <TicketBenefits title="What's not included" items={ticket.excludes} />
              </div>

              <div className="border-t border-white/10 pt-6">
                <TicketSelectionButton ticket={ticket} />
              </div>
            </>
          ) : (
            <>
              <p role="alert" className="text-sm text-zinc-300">
                This ticket is no longer in the catalog. Choose another ticket from the browse list.
              </p>
              <button type="button" onClick={onClose} className={ticketButtonClassName}>
                Back to browse
              </button>
            </>
          )}
        </div>
      </article>
    </dialog>
  )
}
