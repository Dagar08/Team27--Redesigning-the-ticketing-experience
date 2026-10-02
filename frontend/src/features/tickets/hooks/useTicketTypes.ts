'use client'

import { useCallback, useEffect, useState } from 'react'
import { getDocs } from 'firebase/firestore/lite'
import { getTicketTypesCollection } from '@/lib/firebase/firestore'
import type { TicketType } from '@/types/firestore'

interface TicketTypesState {
  tickets: TicketType[]
  loading: boolean
  error: Error | null
}

export function useTicketTypes() {
  const [state, setState] = useState<TicketTypesState>({
    tickets: [],
    loading: true,
    error: null,
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    const timeout = setTimeout(() => {
      if (!active) return
      active = false
      setState({ tickets: [], loading: false, error: new Error('Ticket request timed out') })
    }, 15000)

    async function loadTickets() {
      try {
        const snapshot = await getDocs(getTicketTypesCollection())
        if (!active) return
        const tickets = snapshot.docs
          .map((document) => ({ ...document.data(), id: document.id }))
          .sort((a, b) => a.priceAud - b.priceAud || a.name.localeCompare(b.name))
        setState({ tickets, loading: false, error: null })
      } catch (error) {
        if (!active) return
        console.error('Ticket catalog read failed:', error)
        setState({
          tickets: [],
          loading: false,
          error: error instanceof Error ? error : new Error('Unable to load tickets'),
        })
      } finally {
        clearTimeout(timeout)
      }
    }

    void loadTickets()

    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ tickets: [], loading: true, error: null })
    setAttempt((current) => current + 1)
  }, [])

  return { ...state, retry }
}
