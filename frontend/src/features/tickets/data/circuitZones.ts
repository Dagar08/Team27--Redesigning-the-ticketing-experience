/** Approximate viewing areas on the supplied 1200 x 729 circuit schematic. */
type CircuitZoneShape =
  | { type: 'turn'; x: number; y: number }
  | { type: 'area'; x: number; y: number; width: number; height: number }

export interface CircuitZone {
  id: string
  label: string
  description: string
  shape: CircuitZoneShape
}

const turnPositions = [
  [498, 619],
  [466, 574],
  [142, 524],
  [173, 458],
  [90, 379],
  [151, 150],
  [202, 147],
  [291, 88],
  [780, 389],
  [814, 349],
  [1161, 431],
  [1111, 559],
  [968, 543],
  [960, 623],
] as const

const circuitZones: CircuitZone[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Roaming access to public viewing areas around the circuit, with no fixed seat.',
    // The frame indicates circuit-wide context, not a lawn boundary or reserved area.
    shape: { type: 'area', x: 10, y: 10, width: 1180, height: 709 },
  },
  {
    id: 'main-straight',
    label: 'Main Straight',
    description:
      'Approximate racing straight at the start/finish line. Check your ticket for seating.',
    shape: { type: 'area', x: 493, y: 610, width: 472, height: 30 },
  },
  {
    id: 'pit-straight',
    label: 'Pit Straight',
    description:
      'Approximate start/finish area. This schematic does not identify pit garages or suites.',
    shape: { type: 'area', x: 625, y: 582, width: 339, height: 24 },
  },
  ...turnPositions.map(([x, y], index) => ({
    id: `turn-${index + 1}`,
    label: `Turn ${index + 1}`,
    description: `Approximate viewing area near Turn ${index + 1}. Check your ticket for seating.`,
    shape: { type: 'turn' as const, x, y },
  })),
]

/** Match zone data only; ticket names and prices never determine a location. */
export function getCircuitZone(zone?: string): CircuitZone | undefined {
  const normalized = zone?.trim().replace(/\s+/g, ' ').toLowerCase()
  return circuitZones.find((entry) => entry.label.toLowerCase() === normalized)
}
