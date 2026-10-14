'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonOutline, buttonSecondary, displayTitle, panel } from '@/lib/styles'

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
    <div className={cn(panel, 'mx-auto max-w-xl space-y-6 p-8 text-center text-white')}>
      <div role="alert" className="space-y-2">
        <h1 className={cn(displayTitle, 'text-2xl')}>{title}</h1>
        <p className="text-sm text-zinc-300">{description}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className={buttonOutline}>
          Try again
        </button>
        <Link href={backHref} className={buttonSecondary}>
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
