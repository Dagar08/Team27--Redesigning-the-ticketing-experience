import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { displayTitle } from '@/lib/styles'
import { Skyline } from './Brand'

interface RaceHeroProps {
  /** Small label above the title, e.g. "Next race". */
  eyebrow?: string
  /** Rendered as the page's h1. */
  title: ReactNode
  venue: string
  dateRange: string
  action?: ReactNode
  className?: string
}

/** Red event banner from the dashboard and Browse mockups. */
export function RaceHero({ eyebrow, title, venue, dateRange, action, className }: RaceHeroProps) {
  return (
    <section
      className={cn(
        'bg-race-hero border-gp-red-500/50 relative isolate overflow-hidden rounded-2xl border p-6 sm:p-8',
        className
      )}
    >
      {/* Decorative backdrop: hidden from assistive tech, the pointer and text selection. */}
      <Skyline className="pointer-events-none absolute right-4 bottom-0 -z-10 h-24 w-auto text-black/40 select-none sm:h-36" />
      <p
        aria-hidden="true"
        className={cn(
          displayTitle,
          'pointer-events-none absolute -bottom-3 left-4 -z-10 text-5xl font-black whitespace-nowrap text-white/5 select-none sm:text-6xl'
        )}
      >
        Albert Park Albert Park Albert Park
      </p>

      {eyebrow && <p className={cn(displayTitle, 'text-sm text-white')}>{eyebrow}</p>}
      <h1
        className={cn(
          displayTitle,
          'text-3xl leading-none font-black text-white sm:text-4xl 2xl:text-5xl'
        )}
      >
        {title}
      </h1>
      <p className="mt-3 text-base text-white">{venue}</p>
      <p className="text-base text-white">{dateRange}</p>
      {action && <div className="mt-6">{action}</div>}
    </section>
  )
}
