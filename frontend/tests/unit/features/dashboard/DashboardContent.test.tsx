
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TicketCard } from '@/components/dashboard/TicketCard'
import { RaceHero } from '@/components/brand/RaceHero'
import {
  nextRace,
  ticket,
  upcomingRaces,
  upcomingEvents,
} from '@/features/dashboard/data'

describe('S3W2 dashboard integration', () => {
  it('uses the correct Australian Grand Prix dates', () => {
    expect(nextRace.dateRange).toBe('Thu 1 – Sun 4 Apr 2027')
    expect(ticket.dateRange).toBe(nextRace.dateRange)
  })

  it('orders upcoming races chronologically', () => {
    expect(upcomingRaces.map((race) => race.raceName)).toEqual([
      'Australian Grand Prix',
      'Japanese Grand Prix',
      'Chinese Grand Prix',
    ])

    expect(upcomingRaces.map((race) => race.dateRange)).toEqual([
      '1 – 4 Apr 2027',
      '9 – 11 Apr 2027',
      '16 – 18 Apr 2027',
    ])
  })

  it('shows the Australian GP Sprint weekend sessions', () => {
    expect(upcomingEvents.map((event) => event.name)).toEqual([
      'Practice 1 (FP1)',
      'Sprint Qualifying',
      'Sprint Race',
      'Qualifying',
      'Australian Grand Prix',
    ])

    expect(upcomingEvents.map((event) => event.dateRange)).toEqual([
      'Fri 2 Apr',
      'Fri 2 Apr',
      'Sat 3 Apr',
      'Sat 3 Apr',
      'Sun 4 Apr',
    ])
  })

  it('renders the Albert Park banner photograph', () => {
    render(
      <RaceHero
        title={nextRace.name}
        venue={nextRace.venue}
        dateRange={nextRace.dateRange}
      />
    )

    const image = screen.getByRole('img', {
      name: /view of albert park/i,
    })

    expect(image.getAttribute('src')).toContain(
      'albert-park-banner.jpg'
    )
  })

  it('renders a real demo QR graphic and destination link', () => {
    render(<TicketCard ticket={ticket} />)

    const link = screen.getByRole('link', {
      name: 'Open demo ticket browser',
    })

    expect(link).toHaveAttribute(
      'href',
      'https://team27-redesigning-the-ticketing-ex.vercel.app/tickets'
    )

    expect(link.querySelector('svg')).not.toBeNull()

    expect(
      screen.getByText('Demo link — not valid for entry')
    ).toBeInTheDocument()
  })
})
