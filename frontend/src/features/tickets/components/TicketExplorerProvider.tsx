'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useTicketTypes } from '../hooks/useTicketTypes'
import type { TicketType } from '@/types/firestore'

interface TicketExplorerContextValue extends ReturnType<typeof useTicketTypes> {
  selectedTickets: TicketType[]
  addTicket: (id: string) => void
  removeTicket: (id: string) => void
  clearSelection: () => void
}

const TicketExplorerContext = createContext<TicketExplorerContextValue | null>(null)

function TicketExplorerState({ children }: { children: ReactNode }) {
  const catalog = useTicketTypes()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const selectedTickets = catalog.tickets.filter((ticket) => selectedIds.includes(ticket.id))

  const addTicket = (id: string) => {
    if (!catalog.tickets.some((ticket) => ticket.id === id)) return
    setSelectedIds((current) => (current.includes(id) ? current : [...current, id]))
  }

  const removeTicket = (id: string) => {
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
  }

  return (
    <TicketExplorerContext.Provider
      value={{
        ...catalog,
        selectedTickets,
        addTicket,
        removeTicket,
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
        <Link href="/auth/signin" className="text-gp-green-400 hover:underline">
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
