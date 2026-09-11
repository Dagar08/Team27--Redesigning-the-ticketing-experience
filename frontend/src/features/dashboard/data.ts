import type {
  NextRace,
  StandingsEntry,
  CircuitStats,
  Ticket,
  UpgradePackage,
  UpcomingRace,
  UpcomingEvent,
} from './types'

// TODO: replace with a Firestore read once a `races` collection exists.
export const nextRace: NextRace = {
  name: 'Australian Grand Prix',
  venue: 'Albert Park',
  location: 'Melbourne',
  dateRange: '1 – 2 January',
  circuitName: 'Albert Park Circuit',
}

// TODO: replace with a Firestore read once a `standings` collection exists.
export const standings: StandingsEntry[] = [
  { position: 1, driverName: 'Max Verstappen', teamName: 'Red Bull Racing', points: 382 },
  { position: 2, driverName: 'Lando Norris', teamName: 'McLaren', points: 312 },
  { position: 3, driverName: 'Charles Leclerc', teamName: 'Ferrari', points: 291 },
  { position: 4, driverName: 'Oscar Piastri', teamName: 'McLaren', points: 262 },
  { position: 5, driverName: 'Carlos Sainz', teamName: 'Ferrari', points: 244 },
]

// TODO: replace with real circuit stats once available.
export const circuitStats: CircuitStats = {
  length: '5.278 km',
  laps: '58',
  fastestLap: '1:19.813',
  distance: '306.1 km',
}

// TODO: replace with a Firestore read of the signed-in user's ticket.
export const ticket: Ticket = {
  id: 'ticket-1',
  eventName: 'Australian Grand Prix',
  circuitName: 'Albert Park Circuit',
  dateRange: '1 – 2 January',
  tier: 'Grandstand',
  holderName: 'Your Name',
  seatDetails: 'Row 1 · Seat 1',
}

// TODO: replace with a Firestore read once an `upgrades` collection exists.
export const upgradePackages: UpgradePackage[] = [
  { id: 'paddock', name: 'Paddock Club Lounge', description: 'Premium culinary & pit lane walk', price: '$950' },
  { id: 'champions', name: 'Champions Club Access', description: 'Best view of final straight & grid', price: '$650' },
  { id: 'grandstand', name: 'Grandstand Premium', description: 'Reserved elevated gold seating', price: '$300' },
]

// TODO: replace with a Firestore read of the season race calendar.
export const upcomingRaces: UpcomingRace[] = [
  {
    id: 'race-1',
    status: 'On-going',
    raceName: 'Australian Grand Prix',
    venue: 'Albert Park Circuit',
    dateRange: '1 – 2 January',
  },
  {
    id: 'race-2',
    status: 'Up-coming',
    raceName: 'Chinese Grand Prix',
    venue: 'Shanghai International Circuit',
    dateRange: '16 – 18 April',
  },
  {
    id: 'race-3',
    status: 'Up-coming',
    raceName: 'Japanese Grand Prix',
    venue: 'Suzuka Circuit',
    dateRange: '22 – 24 April',
  },
]

// TODO: replace with a Firestore read of the next race weekend's session schedule.
export const upcomingEvents: UpcomingEvent[] = [
  { id: 'session-1', dateRange: '1 – 2 Jan', name: 'Free Practice 1 (FP1)' },
  { id: 'session-2', dateRange: '1 – 2 Jan', name: 'Free Practice 2 (FP2)' },
  { id: 'session-3', dateRange: '2 Jan', name: 'Free Practice 3 (FP3)' },
  { id: 'session-4', dateRange: '2 Jan', name: 'Qualifying Session' },
]