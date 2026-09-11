import type {
  NextRace,
  StandingsEntry,
  CircuitStats,
  Ticket,
  UpgradePackage,
  UpcomingEvent,
} from './types'

// TODO: replace with a Firestore read once a `races` collection exists.
export const nextRace: NextRace = {
  name: 'Australian Grand Prix',
  location: 'Melbourne',
  dateRange: '1 – 2 January',
  circuitName: 'Albert Park Circuit',
}

// TODO: replace with a Firestore read once a `standings` collection exists.
export const standings: StandingsEntry[] = [1, 2, 3, 4].map((position) => ({
  position,
  driverName: 'Driver Name',
  teamName: 'Team Name',
  points: null,
}))

// TODO: replace with real circuit stats once available.
export const circuitStats: CircuitStats = {
  length: '—',
  laps: '—',
  distance: '—',
}

// TODO: replace with a Firestore read of the signed-in user's tickets.
export const tickets: Ticket[] = [
  {
    id: 'ticket-1',
    eventName: 'Australian Grand Prix',
    dateRange: '1 – 2 January',
    venue: 'Albert Park',
    seat: 'Row 1 – Seat 1',
  },
  {
    id: 'ticket-2',
    eventName: 'Australian Grand Prix',
    dateRange: '1 – 2 January',
    venue: 'Albert Park',
    seat: 'Row 1 – Seat 1',
  },
]

// TODO: replace with a Firestore read once an `upgrades` collection exists.
export const upgradePackages: UpgradePackage[] = [1, 2, 3].map((n) => ({
  id: `upgrade-${n}`,
  name: 'Package Name',
  description: 'Small inclusion description…',
  price: '$XXX',
}))

// TODO: replace with a Firestore read once an `events` collection exists.
export const upcomingEvents: UpcomingEvent[] = [
  { id: 'event-1', dateRange: '1 – 2 Jan', name: 'Heat 1' },
  { id: 'event-2', dateRange: '1 – 2 Jan', name: 'Heat 2' },
  { id: 'event-3', dateRange: '1 – 2 Jan', name: 'Race 1' },
  { id: 'event-4', dateRange: '1 – 2 Jan', name: 'Race 2' },
]