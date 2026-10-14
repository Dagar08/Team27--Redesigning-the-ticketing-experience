import Link from 'next/link'
import type { UpgradePackage } from '@/features/dashboard/types'
import { Panel } from '@/components/shared/Panel'
import { focusRing, textLink } from '@/lib/styles'
import { cn } from '@/lib/utils'

export function UpgradesPanel({ upgrades }: { upgrades: UpgradePackage[] }) {
  return (
    <Panel
      title="Available upgrades"
      action={
        <Link href="#" className={textLink}>
          View all upgrades
        </Link>
      }
    >
      <ul className="space-y-2">
        {upgrades.map((pkg) => (
          <li
            key={pkg.id}
            className="bg-asphalt-950 border-asphalt-600 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{pkg.name}</p>
              <p className="text-xs text-zinc-300">{pkg.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-gp-red-400 text-sm font-bold">{pkg.price}</span>
              {/* The pseudo-element extends the compact pill to a 44px touch target. */}
              <Link
                href="#"
                className={cn(
                  'bg-gp-red-500 hover:bg-gp-red-600 relative rounded-md px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase transition-colors after:absolute after:-inset-x-1 after:-inset-y-2.5',
                  focusRing
                )}
              >
                Upgrade<span className="sr-only"> to {pkg.name}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
