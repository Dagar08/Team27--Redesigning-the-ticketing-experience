import { cn } from '@/lib/utils'
import { displayTitle } from '@/lib/styles'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className={cn(displayTitle, 'text-3xl font-black text-white sm:text-5xl')}>{title}</h1>
        {description && <p className="mt-2 text-sm text-zinc-400">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
