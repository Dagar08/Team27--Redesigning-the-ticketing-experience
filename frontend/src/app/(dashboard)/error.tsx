'use client'

import { RouteError } from '@/components/shared/RouteError'

// Unexpected-crash fallback for the signed-in area, including the ticket explorer provider.
export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return <RouteError error={error} retry={retry} />
}
