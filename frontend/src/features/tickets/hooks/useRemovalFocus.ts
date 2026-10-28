'use client'

import { useEffect, useRef, type RefObject } from 'react'

/**
 * A removed item takes its Remove button with it, which would drop focus to the
 * top of the page (A11Y-08). After a removal, focus the Remove button now in the
 * same position (or the last one), or `fallbackRef` when fewer than `minCount`
 * items remain.
 */
export function useRemovalFocus(
  count: number,
  fallbackRef: RefObject<HTMLElement | null>,
  minCount = 1
) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const removedIndex = useRef<number | null>(null)

  useEffect(() => {
    const index = removedIndex.current
    if (index === null) return
    removedIndex.current = null
    const next = count >= minCount ? buttons.current[Math.min(index, count - 1)] : null
    ;(next ?? fallbackRef.current)?.focus()
  }, [count, minCount, fallbackRef])

  return {
    removeButtonRef: (index: number) => (element: HTMLButtonElement | null) => {
      buttons.current[index] = element
    },
    markRemoved: (index: number) => {
      removedIndex.current = index
    },
  }
}
