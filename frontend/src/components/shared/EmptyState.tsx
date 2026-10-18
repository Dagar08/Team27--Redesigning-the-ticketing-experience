import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { displayTitle } from '@/lib/styles'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="border-gp-red-500 bg-gp-red-500/10 text-gp-red-500 grid size-14 place-items-center rounded-full border-2">
        <Icon aria-hidden="true" className="size-6" />
      </div>
      <div>
        <p className={cn(displayTitle, 'text-xl text-white')}>{title}</p>
        {description && <p className="mt-2 text-sm text-zinc-300">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
