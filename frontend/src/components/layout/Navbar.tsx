'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const router = useRouter()
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

  const displayName = profile?.displayName ?? user?.email ?? 'User'

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-asphalt-950 px-6">
      <div className="text-sm font-semibold text-white lg:hidden">
        {process.env.NEXT_PUBLIC_APP_NAME ?? 'Garage'}
      </div>
      <p className="hidden text-lg font-medium text-white lg:block">Welcome back, {displayName}</p>
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          aria-label="Profile"
        >
          <User className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}