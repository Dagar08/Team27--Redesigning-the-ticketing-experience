
import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { displayTitle } from '@/lib/styles'

interface RaceHeroProps {
  eyebrow?: string
  title: ReactNode
  venue: string
  dateRange: string
  action?: ReactNode
  className?: string
}

export function RaceHero({
  eyebrow,
  title,
  venue,
  dateRange,
  action,
  className,
}: RaceHeroProps) {
  return (
    <section
      className={cn(
        'border-gp-red-500/50 bg-asphalt-950 relative isolate overflow-hidden rounded-2xl border p-6 sm:p-8',
        className
      )}
    >
      <Image
        src="/media/albert-park-banner.jpg"
        alt="View of Albert Park in Melbourne, home of the Australian Grand Prix"
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 66vw"
        className="object-cover object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/35"
      />

      <div className="relative z-10">
        {eyebrow && (
          <p className={cn(displayTitle, 'text-sm text-white')}>
            {eyebrow}
          </p>
        )}

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
      </div>
    </section>
  )
}
