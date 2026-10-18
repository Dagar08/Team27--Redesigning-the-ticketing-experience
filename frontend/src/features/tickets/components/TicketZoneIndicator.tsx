import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TicketZoneIndicator({ zone }: { zone?: string }) {
  const label = zone?.trim()

  return (
    <span
      aria-label={`Ticket zone: ${label || 'Not specified'}`}
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-lg border px-3 py-2 font-sans font-semibold',
        label ? 'border-gp-red-500 bg-gp-red-500/10 text-white' : 'border-asphalt-600 text-zinc-300'
      )}
    >
      <MapPin aria-hidden="true" className={cn('size-4 shrink-0', label && 'text-gp-red-500')} />
      <span className="break-words">{label || 'Not specified'}</span>
    </span>
  )
}
