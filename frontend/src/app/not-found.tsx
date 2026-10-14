import Link from 'next/link'
import { TrackDivider } from '@/components/brand/Brand'
import { cn } from '@/lib/utils'
import { buttonPrimary, displayTitle } from '@/lib/styles'

export default function NotFound() {
  return (
    <main className="bg-asphalt-950 relative isolate flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center text-white">
      <div aria-hidden="true" className="bg-race-stripes absolute inset-0 -z-10" />
      <p className={cn(displayTitle, 'text-gp-red-500 text-7xl font-black sm:text-8xl')}>404</p>
      <h1 className={cn(displayTitle, 'text-2xl')}>Page not found</h1>
      <TrackDivider className="w-full max-w-xs" />
      <p className="text-zinc-300">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className={cn(buttonPrimary, 'mt-4')}>
        Go home
      </Link>
    </main>
  )
}
