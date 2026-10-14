'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { TicketType } from '@/types/firestore'
import { cn } from '@/lib/utils'
import { buttonOutline, displayBlock, focusRing } from '@/lib/styles'
import { CircuitMap } from './CircuitMap'
import { TicketFacts, TicketPrice } from './TicketElements'
import { TicketCompareToggle } from './TicketSelection'

/** Heavy, wide title case ("Zone and Location", "What's Included"). */
const sectionHeading =
  'font-display text-xl font-extrabold tracking-tight text-white font-stretch-expanded sm:text-2xl'

function TicketBenefits({ title, items }: { title: string; items?: string[] }) {
  return (
    <section className="space-y-3">
      <h3 className={sectionHeading}>{title}</h3>

      {items?.length ? (
        <ul className="font-display marker:text-gp-red-500 list-disc space-y-2 pl-5 text-sm font-semibold text-zinc-200">
          {items.map((item, index) => (
            <li key={`${index}-${item}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-300">Not specified for this ticket.</p>
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
      if (dialog.open) {
        dialog.close()
      }

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

        if (clickedOutside) {
          onClose()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="bg-asphalt-950 border-asphalt-600 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto overscroll-contain rounded-3xl border p-0 text-white shadow-2xl backdrop:bg-black/80"
    >
      <article className="break-words">
        <header className="bg-asphalt-950 sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-8">
          <h2
            id="ticket-details-title"
            className={cn(displayBlock, 'min-w-0 flex-1 text-2xl sm:text-4xl lg:text-5xl')}
          >
            {ticket?.name || 'Ticket not found'}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close ticket details"
            className={cn(
              'grid size-12 shrink-0 place-items-center rounded-xl text-white transition-colors hover:bg-white/10',
              focusRing
            )}
          >
            <X aria-hidden="true" strokeWidth={2.5} className="size-8" />
          </button>
        </header>

        <div className="p-5 sm:p-8">
          {ticket ? (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TicketFacts ticket={ticket} showZoneIndicator />
              </div>
              <div className="lg:text-right">
                <TicketPrice price={ticket.priceAud} className="text-3xl sm:text-4xl" />
              </div>

              <div className="lg:col-span-2">
                <CircuitMap zone={ticket.zone} label={`Circuit map for ${ticket.name}`} />
              </div>
              <div className="space-y-8">
                <section className="space-y-3">
                  <h3 className={sectionHeading}>Zone and location</h3>
                  <p className="text-sm text-zinc-300">
                    Seat allocation not specified for this ticket.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className={sectionHeading}>View description</h3>
                  <p className="font-display text-sm leading-relaxed font-semibold text-zinc-200">
                    {ticket.viewDescription || 'View description coming soon.'}
                  </p>
                </section>
              </div>

              <div className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3 md:divide-x md:divide-white/20 lg:col-span-3">
                <div className="md:pr-8">
                  <TicketBenefits title="What's included" items={ticket.includes} />
                </div>
                <div className="md:px-8">
                  <TicketBenefits title="What's not included" items={ticket.excludes} />
                </div>
                <section className="space-y-3 md:pl-8">
                  <h3 className={sectionHeading}>Compare</h3>
                  <p className="text-sm text-zinc-300">
                    Compare this ticket side by side with up to two others.
                  </p>
                  <TicketCompareToggle ticket={ticket} />
                </section>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 py-10 text-center">
              <p role="alert" className="font-display text-base font-bold text-white sm:text-lg">
                This ticket link is invalid or the ticket is no longer in the catalog. Choose
                another ticket from the browse list.
              </p>

              <button
                type="button"
                onClick={onClose}
                className={cn(buttonOutline, 'min-h-14 w-full max-w-sm text-base')}
              >
                Back to browse
              </button>
            </div>
          )}
        </div>
      </article>
    </dialog>
  )
}
