'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { focusRing } from '@/lib/styles'
import { GrandPrixBadge, Wordmark } from '@/components/brand/Brand'
import { isActivePath, navItems } from './navItems'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-asphalt-900 hidden w-72 shrink-0 flex-col border-r border-white/10 lg:flex">
      <div className="px-6 pt-8 pb-10">
        <Link href="/dashboard" className={cn('rounded-sm', focusRing)}>
          <Wordmark className="text-4xl" />
        </Link>
      </div>

      <nav aria-label="Main" className="flex-1">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href)

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center gap-3 border-l-4 px-6 text-base transition-colors focus-visible:-outline-offset-2',
                    focusRing,
                    active
                      ? 'bg-gp-red-950 border-gp-red-500 font-semibold text-white'
                      : 'border-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn('size-5 shrink-0', active && 'text-gp-red-500')}
                  />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <GrandPrixBadge className="p-6" />
    </aside>
  )
}
