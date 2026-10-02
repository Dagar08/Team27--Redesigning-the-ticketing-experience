import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TicketZoneIndicator({ zone }: { zone?: string }) {
  const label = zone?.trim()

  return (
    <span
      aria-label={`Ticket zone: ${label || 'Not specified'}`}
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-md border px-3 py-2 font-medium',
        label
          ? 'border-gp-green-400/40 bg-gp-green-500/10 text-gp-green-400'
          : 'border-white/15 text-zinc-400'
      )}
    >
      <MapPin aria-hidden="true" className="size-4 shrink-0" />
      <span className="break-words">{label || 'Not specified'}</span>
    </span>
  )
}
