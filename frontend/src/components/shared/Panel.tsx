import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { displayTitle, panel } from '@/lib/styles'

interface PanelProps {
  title: string
  /** Optional link or control shown opposite the title, e.g. "view all upgrades". */
  action?: ReactNode
  children: ReactNode
  className?: string
}

/** Titled box used across the dashboard and Browse ("YOUR TICKETS", "AVAILABLE UPGRADES"). */
export function Panel({ title, action, children, className }: PanelProps) {
  return (
    <section className={cn(panel, 'p-5 sm:p-6', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className={cn(displayTitle, 'min-w-0 text-base text-white 2xl:text-lg')}>{title}</h2>
        {action && <div className="shrink-0 whitespace-nowrap">{action}</div>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}
