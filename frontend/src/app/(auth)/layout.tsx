import type { Metadata } from 'next'
import Link from 'next/link'
import { GrandPrixBadge, RaceTag, Skyline, Wordmark } from '@/components/brand/Brand'
import { cn } from '@/lib/utils'
import { focusRing } from '@/lib/styles'

export const metadata: Metadata = {
  title: 'Authentication',
}

/** Sign-in screens share the landing page's card-on-streaks look from the login mockup. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-asphalt-950 relative isolate flex min-h-dvh flex-col overflow-hidden text-white">
      <div aria-hidden="true" className="bg-race-stripes absolute inset-0 -z-10" />

      <header className="flex items-center justify-between gap-4 p-6 sm:p-10">
        <Link href="/" className={cn('rounded-sm', focusRing)}>
          <Wordmark className="text-2xl sm:text-3xl" />
        </Link>
        <RaceTag className="hidden sm:flex" />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="from-gp-red-950/90 to-asphalt-950/95 w-full max-w-md rounded-3xl border border-white/25 bg-gradient-to-b p-6 shadow-2xl backdrop-blur-md sm:p-10">
          {children}
        </div>
      </main>

      <footer className="flex items-end justify-between gap-6 p-6 sm:p-10">
        <GrandPrixBadge />
        <Skyline className="text-gp-red-500 hidden h-14 w-auto sm:block" />
      </footer>
    </div>
  )
}
