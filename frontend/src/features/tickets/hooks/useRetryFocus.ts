'use client'

import { useEffect, useRef } from 'react'

/**
 * The Retry button unmounts while the catalog reloads, which would drop focus to
 * the top of the page. After a retry, focus the reloaded results, or Retry again
 * if the request failed again (ERR-02, ERR-03).
 */
export function useRetryFocus(loading: boolean, error: Error | null, retry: () => void) {
  const pending = useRef(false)
  const retryRef = useRef<HTMLButtonElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading || !pending.current) return
    pending.current = false
    ;(error ? retryRef.current : resultsRef.current)?.focus()
  }, [loading, error])

  const handleRetry = () => {
    pending.current = true
    retry()
  }

  return { handleRetry, retryRef, resultsRef }
}
