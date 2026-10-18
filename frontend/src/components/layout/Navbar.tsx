'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { displayItalic, focusRing } from '@/lib/styles'
import { RaceTag, Wordmark } from '@/components/brand/Brand'
import { BackLink } from './BackLink'

const iconButton = `flex size-11 items-center justify-center rounded-full border border-asphalt-600 text-white transition-colors hover:border-white hover:bg-white/5 ${focusRing}`

/** Pages whose mockups put a "← RETURN TO …" link in the header row (from lg; pages show it below). */
const backLinks: Record<string, { href: string; label: string }> = {
  '/tickets': { href: '/dashboard', label: 'Return to dashboard' },
  '/tickets/compare': { href: '/tickets', label: 'Return to tickets' },
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/auth/signin')
      router.refresh()
    } catch {
      toast.error('Sign out failed. Please try again.')
    }
  }

  const displayName = profile?.displayName ?? user?.email?.split('@')[0] ?? 'User'
  const onDashboard = pathname === '/dashboard'
  const back = backLinks[pathname]

  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
      <div className="min-w-0">
        {onDashboard ? (
          // Title case on phones (as in the mobile mockup) keeps the name visible.
          <p className={cn(displayItalic, 'truncate text-lg text-white sm:text-2xl sm:uppercase')}>
            Welcome back, {displayName}
          </p>
        ) : (
          <>
            {back && (
              <BackLink href={back.href} className="hidden lg:inline-flex">
                {back.label}
              </BackLink>
            )}
            <Link href="/dashboard" className={cn('rounded-sm lg:hidden', focusRing)}>
              <Wordmark className="text-2xl" />
            </Link>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <RaceTag className="hidden sm:flex" />
        <Link href="/profile" className={iconButton} aria-label="Profile">
          <User aria-hidden="true" className="size-5" />
        </Link>
        <button type="button" onClick={handleSignOut} className={iconButton} aria-label="Sign out">
          <LogOut aria-hidden="true" className="size-5" />
        </button>
      </div>
    </header>
  )
}
