import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { MobileNav } from './MobileNav'

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-asphalt-950 flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        {/*
          `relative` makes this scroll area the containing block for absolutely positioned
          content (e.g. sr-only labels). Otherwise that content is placed against the page,
          stretches the document and adds a second scrollbar. Bottom padding keeps content
          clear of the mobile tab bar.
        */}
        <main className="relative flex-1 overflow-y-auto px-4 pb-28 sm:px-8 lg:px-10 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
