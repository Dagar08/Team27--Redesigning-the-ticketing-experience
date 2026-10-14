'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { isActivePath, navItems } from './navItems'

/** Bottom tab bar from the mobile dashboard mockup; the Sidebar takes over from lg. */
export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main"
      className="bg-asphalt-950/95 fixed inset-x-0 bottom-0 z-40 border-t border-white/10 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {navItems.map(({ href, label, shortLabel, icon: Icon }) => {
          const active = isActivePath(pathname, href)

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white',
                  active ? 'text-gp-red-400' : 'text-zinc-300 hover:text-white'
                )}
              >
                <span
                  className={cn(
                    'grid size-8 place-items-center rounded-full',
                    active && 'bg-gp-red-500 text-white'
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                {shortLabel ?? label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
