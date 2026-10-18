import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroVideo } from '@/components/landing/HeroVideo'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Book and manage your Australian Grand Prix tickets.',
}

const START_LIGHTS = [0, 1, 2, 3, 4]
const KERB_SEGMENTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

export default function LandingPage() {
  return (
    <main className="bg-asphalt-950 relative flex min-h-screen flex-col overflow-hidden">
      <HeroVideo />

      <div
        aria-hidden="true"
        className="from-asphalt-950 via-asphalt-950/85 to-asphalt-950/40 absolute inset-0 bg-gradient-to-r"
      />
      <div aria-hidden="true" className="bg-asphalt-950/30 absolute inset-0" />

      <div className="relative flex flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-6 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="bg-gp-green-500 size-2.5 rounded-full" />
            <span className="font-mono text-xs tracking-[0.2em] text-zinc-300 uppercase">
              Albert Park · Melbourne
            </span>
          </div>
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Sign in
          </Link>
        </header>

        <section className="flex flex-1 items-center px-6 py-16 sm:px-10">
          <div className="max-w-2xl space-y-8">
            <div className="flex gap-2.5" aria-hidden="true">
              {START_LIGHTS.map((i) => (
                <span
                  key={i}
                  className="size-3.5 rounded-full bg-red-600 shadow-lg shadow-red-600/50"
                />
              ))}
            </div>

            <div className="space-y-5">
              <p className="text-gp-green-400 font-mono text-xs tracking-[0.25em] uppercase">
                Official ticketing
              </p>
              <h1 className="text-5xl leading-[1.05] font-bold tracking-tight text-white sm:text-6xl">
                Welcome to the <span className="text-gp-gold-500">F1 ticketing experience</span>
              </h1>
              <p className="max-w-lg text-lg text-zinc-300">
                Book grandstand seats, general admission and hospitality passes for all four days of
                race week — then manage, transfer and access every ticket in one place.
              </p>
            </div>

            <div>
              <Link
                href="/auth/signup"
                className="bg-gp-green-500 text-asphalt-950 hover:bg-gp-green-400 focus-visible:outline-gp-green-500 inline-flex items-center justify-center rounded-md px-8 py-3.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Get your tickets
              </Link>
            </div>
          </div>
        </section>

        <footer className="px-6 pb-12 sm:px-10">
          <dl className="flex flex-wrap gap-x-12 gap-y-6 border-t border-white/10 pt-8">
            <div>
              <dt className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Circuit</dt>
              <dd className="mt-1.5 text-sm font-medium text-white">5.278 km</dd>
            </div>
            <div>
              <dt className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Turns</dt>
              <dd className="mt-1.5 text-sm font-medium text-white">14</dd>
            </div>
            <div>
              <dt className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Laps</dt>
              <dd className="mt-1.5 text-sm font-medium text-white">58</dd>
            </div>
            <div>
              <dt className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                Race week
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-white">4 days</dd>
            </div>
          </dl>
        </footer>

        <div className="flex" aria-hidden="true">
          {KERB_SEGMENTS.map((i) => (
            <span key={i} className={`h-2 flex-1 ${i % 2 === 0 ? 'bg-red-600' : 'bg-white'}`} />
          ))}
        </div>
      </div>
    </main>
  )
}