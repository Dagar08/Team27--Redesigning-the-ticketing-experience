'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface RouteErrorProps {
  error: Error & { digest?: string }
  retry: () => void
  title?: string
  description?: string
  backHref?: string
  backLabel?: string
}

/** Fallback UI for `error.tsx` route boundaries. Error details and digests go to the console only. */
export function RouteError({
  error,
  retry,
  title = 'Something went wrong',
  description = 'This page hit an unexpected problem. Try again, or head back and continue from there.',
  backHref = '/dashboard',
  backLabel = 'Back to dashboard',
}: RouteErrorProps) {
  useEffect(() => {
    console.error('Route error boundary caught an error:', error)
  }, [error])

  return (
    <div className="bg-asphalt-900 mx-auto max-w-xl space-y-4 rounded-xl border border-red-400/30 p-6 text-white">
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-400" />
        <div role="alert" className="space-y-1">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-zinc-300">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="bg-gp-green-500 text-asphalt-950 hover:bg-gp-green-400 focus-visible:outline-gp-green-400 inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Try again
        </button>
        <Link
          href={backHref}
          className="focus-visible:outline-gp-green-400 inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
