'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useTicketTypes } from '../hooks/useTicketTypes'
import type { TicketType } from '@/types/firestore'

interface TicketExplorerContextValue extends ReturnType<typeof useTicketTypes> {
  selectedTickets: TicketType[]
  /** Selected IDs that are no longer in the loaded catalog (ERR-09). */
  unavailableCount: number
  addTicket: (id: string) => void
  removeTicket: (id: string) => void
  /** Replace the selection, e.g. from a shared Compare link. Unknown IDs count as unavailable. */
  selectTickets: (ids: string[]) => void
  clearSelection: () => void
}

const TicketExplorerContext = createContext<TicketExplorerContextValue | null>(null)
export const MAX_SELECTED_TICKETS = 3

function TicketExplorerState({ children }: { children: ReactNode }) {
  const catalog = useTicketTypes()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const inCatalog = (id: string) => catalog.tickets.some((ticket) => ticket.id === id)
  const selectedTickets = catalog.tickets.filter((ticket) => selectedIds.includes(ticket.id))
  const unavailableCount =
    catalog.loading || catalog.error ? 0 : selectedIds.length - selectedTickets.length

  const addTicket = (id: string) => {
    if (!inCatalog(id)) return

    setSelectedIds((current) => {
      // Unavailable tickets give up their place to a new choice.
      const available = current.filter(inCatalog)
      if (available.includes(id)) return available
      if (available.length >= MAX_SELECTED_TICKETS) return available

      return [...available, id]
    })
  }

  const selectTickets = (ids: string[]) => {
    const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))]
    setSelectedIds(unique.slice(0, MAX_SELECTED_TICKETS))
  }

  const removeTicket = (id: string) => {
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
  }

  return (
    <TicketExplorerContext.Provider
      value={{
        ...catalog,
        selectedTickets,
        unavailableCount,
        addTicket,
        removeTicket,
        selectTickets,
        clearSelection: () => setSelectedIds([]),
      }}
    >
      {children}
    </TicketExplorerContext.Provider>
  )
}

export function TicketExplorerProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  // Firestore requires Firebase client auth, which restores after the server session.
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-3 text-white">
        <p>Please sign in to browse tickets.</p>
        <Link
          href="/auth/signin"
          className="text-gp-red-400 font-semibold underline underline-offset-2 hover:text-white"
        >
          Sign in
        </Link>
      </div>
    )
  }

  // A new user gets a fresh selection and catalog request.
  return <TicketExplorerState key={user.uid}>{children}</TicketExplorerState>
}

export function useTicketExplorer() {
  const context = useContext(TicketExplorerContext)
  if (!context) throw new Error('useTicketExplorer must be used within TicketExplorerProvider')
  return context
}
