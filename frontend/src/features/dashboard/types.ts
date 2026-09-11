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
  distance: string
}

export interface Ticket {
  id: string
  eventName: string
  dateRange: string
  venue: string
  seat: string
}

export interface UpgradePackage {
  id: string
  name: string
  description: string
  price: string
}

export interface UpcomingEvent {
  id: string
  dateRange: string
  name: string
}