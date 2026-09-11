/**
 * Dashboard placeholder data model.
 *
 * All of this is static for now — no Firestore collections exist yet for
 * races, standings, tickets, or upgrades. The shapes below are what the
 * dashboard page renders against, so swapping in real data later just
 * means replacing the functions in `data.ts` with typed collection reads
 * (see `lib/firebase/firestore.ts` for the pattern) without touching the
 * page or components.
 */

export interface NextRace {
  name: string
  venue: string
  location: string
  dateRange: string
  circuitName: string
}

export interface StandingsEntry {
  position: number
  driverName: string
  teamName: string
  points: number | null
}

export interface CircuitStats {
  length: string
  laps: string
  fastestLap: string
  distance: string
}

/** The signed-in user's own ticket for the next race. */
export interface Ticket {
  id: string
  eventName: string
  circuitName: string
  dateRange: string
  tier: string
  holderName: string
  seatDetails: string
}

export interface UpgradePackage {
  id: string
  name: string
  description: string
  price: string
}

/** A race on the calendar. */
export interface UpcomingRace {
  id: string
  status: 'On-going' | 'Up-coming'
  raceName: string
  venue: string
  dateRange: string
}

/** A single session within the next race weekend (FP1, Qualifying, etc). */
export interface UpcomingEvent {
  id: string
  dateRange: string
  name: string
}