'use client'

import { useSyncExternalStore } from 'react'

const detailsChangedEvent = 'ticket-details-changed'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(detailsChangedEvent, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(detailsChangedEvent, onChange)
  }
}

function readTicketId() {
  return new URLSearchParams(window.location.search).get('ticket')
}

function openTicketDetails(id: string) {
  const url = new URL(window.location.href)
  if (url.searchParams.get('ticket') === id) return
  url.searchParams.set('ticket', id)
  // Next.js integrates native history entries without reloading the catalog.
  window.history.pushState({ ticketDetailsOpened: true }, '', url)
  window.dispatchEvent(new Event(detailsChangedEvent))
}

function closeTicketDetails() {
  if (window.history.state?.ticketDetailsOpened) {
    window.history.back()
    return
  }

  // A directly opened link has no browse entry to go back to.
  const url = new URL(window.location.href)
  url.searchParams.delete('ticket')
  window.history.replaceState(null, '', url)
  window.dispatchEvent(new Event(detailsChangedEvent))
}

export function useTicketDetails() {
  const activeTicketId = useSyncExternalStore(subscribe, readTicketId, () => null)
  return { activeTicketId, openTicketDetails, closeTicketDetails }
}
