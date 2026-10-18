import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { UpcomingEvent } from '@/features/dashboard/types'
import { Panel } from '@/components/shared/Panel'
import { cn } from '@/lib/utils'
import { displayTitle, focusRing } from '@/lib/styles'

export function NextEventsPanel({ events }: { events: UpcomingEvent[] }) {
  return (
    <Panel title="Your next events">
      <ul className="divide-y divide-white/10">
        {events.map((event) => (
          <li key={event.id}>
            <Link
              href="#"
              className={cn(
                'group flex min-h-12 items-center gap-4 rounded-sm py-2 text-sm text-white',
                focusRing
              )}
            >
              <span
                className={cn(
                  displayTitle,
                  'text-gp-red-400 w-20 shrink-0 text-xs whitespace-nowrap'
                )}
              >
                {event.dateRange}
              </span>
              <span className="flex-1 group-hover:underline">{event.name}</span>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-zinc-300" />
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
