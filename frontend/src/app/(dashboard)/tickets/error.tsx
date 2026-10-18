'use client'

import { RouteError } from '@/components/shared/RouteError'

// An unexpected crash in browse, detail or compare. The tickets layout
// (and the in-memory selection) stays mounted outside this boundary.
export default function TicketsError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <RouteError
      error={error}
      retry={retry}
      title="We couldn't show this ticket page"
      description="Something unexpected went wrong while displaying tickets. Your selection has been kept. Try again, or return to the ticket list."
      backHref="/tickets"
      backLabel="Back to tickets"
    />
  )
}
