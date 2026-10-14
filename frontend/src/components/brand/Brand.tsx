import { cn } from '@/lib/utils'
import { displayTitle } from '@/lib/styles'

// The mockups' brand mark. NEXT_PUBLIC_APP_NAME still sets the page titles (app/layout.tsx).
const BRAND_NAME = 'Garage'

/** The "GARAGE" wordmark. */
export function Wordmark({ className }: { className?: string }) {
  return <span className={cn(displayTitle, 'font-black text-white', className)}>{BRAND_NAME}</span>
}

/** Australian Grand Prix, Melbourne lockup shown at the foot of the sidebar and landing page. */
export function GrandPrixBadge({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className="font-display border-gp-red-500 grid size-11 shrink-0 place-items-center rounded-full border-2 text-lg font-black text-white italic select-none"
      >
        N
      </span>
      <p className="text-xs leading-tight font-bold text-white uppercase">
        <span className="block">Australian</span>
        <span className="font-display text-gp-red-400 block text-sm font-black italic">
          Grand Prix
        </span>
        <span className="block font-semibold text-zinc-300">Melbourne</span>
      </p>
    </div>
  )
}

/** Decorative "GP.01 // MEL" race tag from the header of the mockups. */
export function RaceTag({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-center gap-2 select-none', className)}>
      <span className="bg-gp-red-500 h-1.5 w-8 rounded-full" />
      <span className="bg-gp-red-500 h-1.5 w-2 rounded-full" />
      <span className="font-display text-xs font-extrabold tracking-wide text-white italic">
        GP.01 // MEL
      </span>
    </div>
  )
}

/** Red rule with a timing-beam centre mark, used under large headings. */
export function TrackDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-center gap-3', className)}>
      <span className="bg-gp-red-500 h-px flex-1" />
      <span className="flex items-center gap-1">
        <span className="bg-gp-red-500 h-3 w-0.5" />
        <span className="bg-gp-red-500 h-2 w-0.5" />
        <span className="h-4 w-0.5 bg-white" />
        <span className="bg-gp-red-500 h-2 w-0.5" />
        <span className="bg-gp-red-500 h-3 w-0.5" />
      </span>
      <span className="bg-gp-red-500 h-px flex-1" />
    </div>
  )
}

/** Line drawing of the Melbourne skyline and observation wheel. */
export function Skyline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M0 88h320" />
      <path d="M8 88V38h22v50M40 88V58h24v30M72 88V50l14-12v50" />
      <path d="M96 88V26h18v62M105 26V10" />
      <circle cx="152" cy="54" r="26" />
      <path d="M152 54l-14 34M152 54l14 34M126 54h52M152 28v52M134 36l36 36M170 36l-36 36" />
      <path d="M196 88V42h26v46M230 88V62h18v26M256 88V30h16v58M264 30V18M280 88V56h30v32" />
    </svg>
  )
}

/** Side-on race car silhouette for the sign-in card. */
export function CarMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 28" fill="currentColor" className={className}>
      <path d="M2 5h11v3H5v9H2z" />
      <path d="M6 14h14l6-5h9l4 4h11l12 5v3H6z" />
      <path d="M52 21h11v2H52z" />
      <circle cx="14" cy="21" r="6" />
      <circle cx="50" cy="22" r="5" />
    </svg>
  )
}
