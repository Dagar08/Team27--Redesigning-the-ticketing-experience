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
  ticket: TicketType
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    dialog.showModal()
    closeButtonRef.current?.focus()

    return () => {
      if (dialog.open) dialog.close()
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
      className="bg-asphalt-950 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-xl border border-white/10 p-4 text-white shadow-2xl backdrop:bg-black/80 sm:p-6"
    >
      <article className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 id="ticket-details-title" className="text-2xl font-bold tracking-tight">
              {ticket.name}
            </h2>
            <TicketPrice price={ticket.priceAud} />
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close ticket details"
            className={`${ticketButtonClassName} p-2`}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <TicketFacts ticket={ticket} />

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white">View description</h3>
          <p className="text-sm leading-relaxed text-zinc-300">
            {ticket.viewDescription || 'View description not provided.'}
          </p>
        </section>

        <div className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
          <TicketBenefits title="What's included" items={ticket.includes} />
          <TicketBenefits title="What's not included" items={ticket.excludes} />
        </div>

        <div className="border-t border-white/10 pt-6">
          <TicketSelectionButton ticket={ticket} />
        </div>
      </article>
    </dialog>
  )
}
