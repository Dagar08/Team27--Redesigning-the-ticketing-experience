import Link from 'next/link'
import { LayoutDashboard, User, Settings, Users } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 flex-col border-r border-white/10 bg-asphalt-950">
      <div className="flex h-14 items-center px-4 border-b border-white/10">
        <span className="text-lg font-bold tracking-tight text-white">
          {process.env.NEXT_PUBLIC_APP_NAME ?? 'Garage'}
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}