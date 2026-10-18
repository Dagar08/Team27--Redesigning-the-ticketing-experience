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

/** ERR-01 / FS-02: show the load error after 10 seconds. */
export const TICKET_REQUEST_TIMEOUT_MS = 10_000

export class TicketTimeoutError extends Error {
  constructor() {
    super('Ticket request timed out')
    this.name = 'TicketTimeoutError'
  }
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/**
 * FS-06: Firestore data is not validated on write, so a malformed record must
 * not crash the explorer. Records without a usable name or price are skipped;
 * other fields fall back to neutral values.
 */
export function normalizeTicketType(id: string, data: unknown): TicketType | null {
  if (typeof data !== 'object' || data === null) return null
  const record = data as Record<string, unknown>
  const name = typeof record.name === 'string' ? record.name.trim() : ''
  const priceAud = record.priceAud

  if (!name || typeof priceAud !== 'number' || !Number.isFinite(priceAud) || priceAud <= 0) {
    return null
  }

  return {
    id,
    name,
    priceAud,
    daysCovered: isStringList(record.daysCovered) ? record.daysCovered : [],
    zone: typeof record.zone === 'string' ? record.zone : '',
    viewDescription:
      typeof record.viewDescription === 'string' ? record.viewDescription : undefined,
    includes: isStringList(record.includes) ? record.includes : undefined,
    excludes: isStringList(record.excludes) ? record.excludes : undefined,
    _schemaVersion: 1,
  }
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
      setState({ tickets: [], loading: false, error: new TicketTimeoutError() })
    }, TICKET_REQUEST_TIMEOUT_MS)

    async function loadTickets() {
      try {
        const snapshot = await getDocs(getTicketTypesCollection())
        if (!active) return
        const tickets = snapshot.docs
          .map((document) => normalizeTicketType(document.id, document.data()))
          .filter((ticket): ticket is TicketType => ticket !== null)
          .sort((a, b) => a.priceAud - b.priceAud || a.name.localeCompare(b.name))
        const skipped = snapshot.docs.length - tickets.length
        if (skipped > 0) {
          console.warn(`Skipped ${skipped} ticket type(s) with a missing name or price (FS-06).`)
        }
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
