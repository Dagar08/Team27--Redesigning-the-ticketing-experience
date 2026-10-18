
import type {
  NextRace,
  StandingsEntry,
  CircuitStats,
  Ticket,
  UpgradePackage,
  UpcomingRace,
  UpcomingEvent,
} from './types'

// Australian Grand Prix 2027 event dates: 1–4 April.
export const nextRace: NextRace = {
  name: 'Australian Grand Prix',
  venue: 'Albert Park',
  location: 'Melbourne',
  dateRange: 'Thu 1 – Sun 4 Apr 2027',
  circuitName: 'Albert Park Circuit',
}

// Existing demonstration standings.
export const standings: StandingsEntry[] = [
  { position: 1, driverName: 'Max Verstappen', teamName: 'Red Bull Racing', points: 382 },
  { position: 2, driverName: 'Lando Norris', teamName: 'McLaren', points: 312 },
  { position: 3, driverName: 'Charles Leclerc', teamName: 'Ferrari', points: 291 },
  { position: 4, driverName: 'Oscar Piastri', teamName: 'McLaren', points: 262 },
  { position: 5, driverName: 'Carlos Sainz', teamName: 'Ferrari', points: 244 },
]

export const circuitStats: CircuitStats = {
  length: '5.278 km',
  laps: '58',
  fastestLap: '1:19.813',
  distance: '306.1 km',
}

// Demonstration ticket, not a confirmed booking.
export const ticket: Ticket = {
  id: 'ticket-1',
  eventName: 'Australian Grand Prix',
  circuitName: 'Albert Park Circuit',
  dateRange: 'Thu 1 – Sun 4 Apr 2027',
  tier: 'Grandstand',
  holderName: 'Your Name',
  seatDetails: 'Row 1 · Seat 1',
}

export const upgradePackages: UpgradePackage[] = [
  { id: 'paddock', name: 'Paddock Club Lounge', description: 'Premium culinary & pit lane walk', price: '$950' },
  { id: 'champions', name: 'Champions Club Access', description: 'Best view of final straight & grid', price: '$650' },
  { id: 'grandstand', name: 'Grandstand Premium', description: 'Reserved elevated gold seating', price: '$300' },
]

// Upcoming 2027 events, ordered chronologically.
export const upcomingRaces: UpcomingRace[] = [
  {
    id: 'race-1',
    status: 'Up-coming',
    raceName: 'Australian Grand Prix',
    venue: 'Albert Park Circuit',
    dateRange: '1 – 4 Apr 2027',
  },
  {
    id: 'race-2',
    status: 'Up-coming',
    raceName: 'Japanese Grand Prix',
    venue: 'Suzuka Circuit',
    dateRange: '9 – 11 Apr 2027',
  },
  {
    id: 'race-3',
    status: 'Up-coming',
    raceName: 'Chinese Grand Prix',
    venue: 'Shanghai International Circuit',
    dateRange: '16 – 18 Apr 2027',
  },
]

// Confirmed session dates; start times are still TBC.
export const upcomingEvents: UpcomingEvent[] = [
  { id: 'session-1', dateRange: 'Fri 2 Apr', name: 'Practice 1 (FP1)' },
  { id: 'session-2', dateRange: 'Fri 2 Apr', name: 'Sprint Qualifying' },
  { id: 'session-3', dateRange: 'Sat 3 Apr', name: 'Sprint Race' },
  { id: 'session-4', dateRange: 'Sat 3 Apr', name: 'Qualifying' },
  { id: 'session-5', dateRange: 'Sun 4 Apr', name: 'Australian Grand Prix' },
]
