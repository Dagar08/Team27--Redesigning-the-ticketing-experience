'use client'

import { useId, useRef, useState, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'
import { focusRing } from '@/lib/styles'
import { getCircuitZone } from '../data/circuitZones'

/** Touch has no hover, so a tap must not leave a "hover" behind that keeps the zone lit. */
function canHover(event: PointerEvent) {
  return event.pointerType !== 'touch'
}

export function CircuitMap({
  zone,
  label = 'Circuit map',
  overview = false,
}: {
  zone?: string
  label?: string
  /** Show the whole circuit without ticket-zone details, e.g. on the dashboard. */
  overview?: boolean
}) {
  const id = useId()
  const circuitZone = overview ? undefined : getCircuitZone(zone)
  const displayZone = circuitZone?.label || zone?.trim() || 'Not specified'
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  // True while a mouse press or tap is focusing the button. Only keyboard focus emphasises
  // the zone; otherwise unpinning with a click would leave it lit until the page is clicked.
  const pressing = useRef(false)
  // Associate interaction state with the zone so changing data cannot pin another zone.
  const [interactionZone, setInteractionZone] = useState(zone)
  if (interactionZone !== zone) {
    setInteractionZone(zone)
    setHovered(false)
    setFocused(false)
    setPinned(false)
  }
  const emphasized = !imageFailed && (hovered || focused || pinned)
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const zoneDescriptionId = `${id}-zone-description`
  const mapId = `${id}-map`
  const showHover = (event: PointerEvent) => canHover(event) && setHovered(true)
  const hideHover = (event: PointerEvent) => canHover(event) && setHovered(false)

  return (
    <figure aria-label={label} className="min-w-0 space-y-3 font-normal">
      {imageFailed ? (
        <div className="bg-asphalt-800 border-asphalt-600 flex aspect-[1200/729] items-center justify-center rounded-xl border p-4">
          {/* FS-04 wording; the dashboard overview has no zone to name. */}
          <p className="text-sm text-zinc-300">
            {overview ? 'Circuit map not available.' : 'Zone map not available.'}
          </p>
        </div>
      ) : (
        <svg
          id={mapId}
          viewBox="0 0 1200 729"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
          className="block h-auto w-full overflow-hidden rounded-xl bg-white"
        >
          <title id={titleId}>Albert Park circuit map</title>
          <desc id={descriptionId}>
            {overview
              ? 'Circuit overview showing the Albert Park track layout and numbered turns.'
              : circuitZone
                ? `Ticket zone: ${displayZone}. ${circuitZone.description}`
                : 'Circuit overview. A map location is not specified for this ticket zone.'}
          </desc>
          <image
            href="/maps/albert-park-circuit.png"
            width="1200"
            height="729"
            onError={() => setImageFailed(true)}
          />
          {circuitZone && (
            <g
              aria-hidden="true"
              data-zone={circuitZone.id}
              onPointerEnter={showHover}
              onPointerLeave={hideHover}
              className={cn(
                'cursor-pointer transition-colors motion-reduce:transition-none',
                // Red reads at 5.0:1 on the white map; emphasis also changes width, dash and fill.
                emphasized
                  ? 'fill-gp-red-500/25 stroke-gp-red-500'
                  : 'stroke-gp-red-500 fill-transparent'
              )}
              strokeWidth={emphasized ? 10 : 6}
              strokeDasharray={emphasized ? '14 8' : undefined}
            >
              {circuitZone.shape.type === 'turn' ? (
                <circle cx={circuitZone.shape.x} cy={circuitZone.shape.y} r="30" />
              ) : (
                <rect
                  x={circuitZone.shape.x}
                  y={circuitZone.shape.y}
                  width={circuitZone.shape.width}
                  height={circuitZone.shape.height}
                  rx="12"
                />
              )}
            </g>
          )}
        </svg>
      )}

      {!overview && (
        <figcaption className="space-y-2 text-sm">
          <p role="status" className="font-semibold text-white">
            {emphasized ? 'Highlighted zone' : 'Ticket zone'}: {displayZone}
          </p>
          <p id={zoneDescriptionId} className="text-zinc-300">
            {circuitZone?.description ||
              (zone?.trim() ? 'Zone map not available.' : 'Zone not specified.')}
          </p>
        </figcaption>
      )}

      {circuitZone && (
        <button
          type="button"
          aria-label={`Highlight ${circuitZone.label} on circuit map`}
          aria-describedby={zoneDescriptionId}
          aria-controls={imageFailed ? undefined : mapId}
          aria-pressed={pinned}
          disabled={imageFailed}
          onPointerEnter={showHover}
          onPointerLeave={hideHover}
          onPointerDown={() => {
            pressing.current = true
            // Using a pointer ends any keyboard-focus emphasis.
            setFocused(false)
          }}
          onPointerUp={() => {
            pressing.current = false
          }}
          onPointerCancel={() => {
            pressing.current = false
          }}
          onFocus={() => {
            if (!pressing.current) setFocused(true)
          }}
          onBlur={() => setFocused(false)}
          onClick={() => setPinned((current) => !current)}
          className={cn(
            'border-gp-red-500 hover:bg-gp-red-500/15 aria-pressed:bg-gp-red-500 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
            focusRing
          )}
        >
          {pinned ? 'Unpin highlight' : 'Highlight zone'}
        </button>
      )}
    </figure>
  )
}
