import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroVideo } from '@/components/landing/HeroVideo'
import {
  CarMark,
  GrandPrixBadge,
  RaceTag,
  Skyline,
  TrackDivider,
  Wordmark,
} from '@/components/brand/Brand'
import { cn } from '@/lib/utils'
import { buttonOutline, buttonPrimary } from '@/lib/styles'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Book and manage your Australian Grand Prix tickets.',
}

export default function LandingPage() {
  return (
    <main className="bg-asphalt-950 relative isolate flex min-h-dvh flex-col overflow-hidden text-white">
      <HeroVideo />

      <div
        aria-hidden="true"
        className="from-asphalt-950/30 via-asphalt-950/60 to-asphalt-950/95 absolute inset-0 bg-gradient-to-r"
      />
      <div aria-hidden="true" className="bg-race-stripes absolute inset-0" />

      <header className="relative flex justify-end p-6 sm:p-10">
        <RaceTag />
      </header>

      <section className="relative flex flex-1 items-center justify-center px-4 py-8 lg:justify-end lg:pr-[8vw]">
        <div className="from-gp-red-950/90 to-asphalt-950/90 w-full max-w-md rounded-3xl border border-white/25 bg-gradient-to-b p-8 text-center shadow-2xl backdrop-blur-md sm:p-10">
          <div className="border-gp-red-500 bg-gp-red-500/10 mx-auto grid size-20 place-items-center rounded-2xl border-2">
            <CarMark className="text-gp-red-500 w-14" />
          </div>

          <h1 className="mt-8">
            <Wordmark className="text-5xl sm:text-6xl" />
          </h1>

          <TrackDivider className="my-6" />

          <p className="text-sm text-zinc-200">
            Book and manage your Australian Grand Prix tickets — grandstands, general admission and
            hospitality for all four days of race week.
          </p>

          <div className="mt-8 space-y-4">
            <Link href="/auth/signin" className={cn(buttonPrimary, 'min-h-14 w-full text-base')}>
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className={cn(buttonOutline, 'bg-asphalt-950/60 min-h-14 w-full text-base')}
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative flex items-end justify-between gap-6 p-6 sm:p-10">
        <GrandPrixBadge />
        <div className="hidden text-right sm:block">
          <Skyline className="text-gp-red-500 ml-auto h-16 w-auto" />
          <p className="text-gp-red-400 mt-2 text-xs font-semibold tracking-widest uppercase">
            Melbourne skyline // Albert Park
          </p>
        </div>
      </footer>
    </main>
  )
}
