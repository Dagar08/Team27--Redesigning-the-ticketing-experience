import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { displayTitle, focusRing } from '@/lib/styles'

/** "← RETURN TO DASHBOARD" link that opens the Browse and Compare mockups. */
export function BackLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        displayTitle,
        'hover:text-gp-red-400 inline-flex min-h-11 items-center gap-2 rounded-sm text-lg text-white transition-colors sm:text-2xl',
        focusRing,
        className
      )}
    >
      <ArrowLeft aria-hidden="true" className="size-5 shrink-0 sm:size-6" />
      {children}
    </Link>
  )
}
