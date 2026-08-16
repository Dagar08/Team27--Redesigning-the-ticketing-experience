import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication',
}

const START_LIGHTS = [0, 1, 2, 3, 4]
const KERB_SEGMENTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-asphalt-950 lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-asphalt-900 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="size-2.5 rounded-full bg-gp-green-500" />
          <span className="font-mono text-xs tracking-[0.2em] text-zinc-400 uppercase">
            Albert Park · Melbourne
          </span>
        </div>

        <div className="space-y-8">
          <div className="flex gap-3" aria-hidden="true">
            {START_LIGHTS.map((i) => (
              <span
                key={i}
                className="size-4 rounded-full bg-red-600 shadow-lg shadow-red-600/40"
              />
            ))}
          </div>

          <h2 className="max-w-md text-4xl leading-tight font-bold tracking-tight text-white">
            Your seat at the{' '}
            <span className="text-gp-gold-500">Australian Grand Prix</span> starts here.
          </h2>

          <p className="max-w-sm text-sm text-zinc-400">
            Book, manage and transfer tickets across all four days of race week — grandstands,
            general admission and hospitality.
          </p>
        </div>

        <dl className="flex gap-10">
          <div>
            <dt className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Circuit</dt>
            <dd className="mt-1 text-sm font-medium text-white">5.278 km</dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Turns</dt>
            <dd className="mt-1 text-sm font-medium text-white">14</dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Laps</dt>
            <dd className="mt-1 text-sm font-medium text-white">58</dd>
          </div>
        </dl>

        <div className="absolute inset-x-0 bottom-0 flex" aria-hidden="true">
          {KERB_SEGMENTS.map((i) => (
            <span
              key={i}
              className={`h-2 flex-1 ${i % 2 === 0 ? 'bg-red-600' : 'bg-white'}`}
            />
          ))}
        </div>
      </aside>

      <main className="flex flex-col justify-center px-4 py-12 sm:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="size-2.5 rounded-full bg-gp-green-500" />
            <span className="font-mono text-xs tracking-[0.2em] text-zinc-400 uppercase">
              Australian Grand Prix
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}