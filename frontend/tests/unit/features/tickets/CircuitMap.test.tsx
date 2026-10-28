import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { TicketType } from '@/types/firestore'
import { CircuitMap } from '@/features/tickets/components/CircuitMap'
import { TicketBrowseClient } from '@/features/tickets/components/TicketBrowseClient'
import { TicketCompareClient } from '@/features/tickets/components/TicketCompareClient'
import ticketSeed from '../../../../../firebase/seed/ticket-types.json'

const mocks = vi.hoisted(() => ({ explorer: vi.fn() }))

vi.mock('@/features/tickets/components/TicketExplorerProvider', () => ({
  MAX_SELECTED_TICKETS: 3,
  useTicketExplorer: mocks.explorer,
}))

const tickets: TicketType[] = ticketSeed.map((ticket) => ({ ...ticket, _schemaVersion: 1 }))
const zoneIds: Record<string, string> = {
  General: 'general',
  'Main Straight': 'main-straight',
  'Pit Straight': 'pit-straight',
  'Turn 3': 'turn-3',
  'Turn 11': 'turn-11',
}

function catalog(selectedTickets: TicketType[] = []) {
  return {
    tickets,
    loading: false,
    error: null,
    retry: vi.fn(),
    selectedTickets,
    addTicket: vi.fn(),
    removeTicket: vi.fn(),
    clearSelection: vi.fn(),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  window.history.replaceState(null, '', '/tickets')
  mocks.explorer.mockReturnValue(catalog())
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('CircuitMap', () => {
  it.each(tickets)('renders the supplied map for the stored zone of $name', (ticket) => {
    render(<CircuitMap zone={ticket.zone} />)

    const figure = screen.getByRole('figure', { name: 'Circuit map' })
    const map = within(figure).getByRole('img', { name: /^Albert Park circuit map/ })
    expect(map).toHaveAttribute('viewBox', '0 0 1200 729')
    expect(map.querySelector('image')).toHaveAttribute('href', '/maps/albert-park-circuit.png')
    expect(map.querySelectorAll('[data-zone]')).toHaveLength(1)
    expect(map.querySelector('[data-zone]')).toHaveAttribute('data-zone', zoneIds[ticket.zone])
    expect(within(figure).getByRole('status')).toHaveTextContent(`Ticket zone: ${ticket.zone}`)
    expect(
      within(figure).getByRole('button', {
        name: `Highlight ${ticket.zone} on circuit map`,
      })
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('normalizes case and extra whitespace to the recognised zone', () => {
    render(<CircuitMap zone="  tUrN    11  " />)

    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Turn 11')
    expect(
      screen.getByRole('button', { name: 'Highlight Turn 11 on circuit map' })
    ).toBeInTheDocument()
    expect(screen.getByRole('img').querySelector('[data-zone]')).toHaveAttribute(
      'data-zone',
      'turn-11'
    )
  })

  it.each([undefined, '', '   '])('keeps the base map when the zone is missing (%s)', (zone) => {
    render(<CircuitMap zone={zone} />)

    const map = screen.getByRole('img', { name: /^Albert Park circuit map/ })
    expect(map.querySelector('image')).toHaveAttribute('href', '/maps/albert-park-circuit.png')
    expect(map.querySelector('[data-zone]')).not.toBeInTheDocument()
    expect(screen.getByText('Zone not specified.')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows an unknown zone honestly without guessing a map location', () => {
    render(<CircuitMap zone="New viewing area" />)

    const map = screen.getByRole('img', { name: /^Albert Park circuit map/ })
    expect(map.querySelector('image')).toHaveAttribute('href', '/maps/albert-park-circuit.png')
    expect(map.querySelector('[data-zone]')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: New viewing area')
    expect(screen.getByText('Zone map not available.')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('emphasizes on button hover and restores the ticket zone after leaving', async () => {
    const user = userEvent.setup()
    render(<CircuitMap zone="Turn 3" />)
    const button = screen.getByRole('button', { name: 'Highlight Turn 3 on circuit map' })

    await user.hover(button)
    expect(screen.getByRole('status')).toHaveTextContent('Highlighted zone: Turn 3')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await user.unhover(button)
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Turn 3')
  })

  it('emphasizes on keyboard focus and restores the ticket zone after blur', async () => {
    const user = userEvent.setup()
    render(
      <>
        <CircuitMap zone="Main Straight" />
        <button>Next control</button>
      </>
    )
    const button = screen.getByRole('button', { name: 'Highlight Main Straight on circuit map' })

    await user.tab()
    expect(button).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Highlighted zone: Main Straight')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Next control' })).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Main Straight')
  })

  it('uses the same status feedback for hover on the decorative SVG zone', () => {
    render(<CircuitMap zone="Pit Straight" />)
    const region = screen.getByRole('img').querySelector('[data-zone="pit-straight"]')!

    fireEvent.pointerEnter(region)
    expect(screen.getByRole('status')).toHaveTextContent('Highlighted zone: Pit Straight')
    fireEvent.pointerLeave(region)
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Pit Straight')
  })

  it('pins and unpins the highlight with Enter without requiring a pointer', async () => {
    const user = userEvent.setup()
    render(
      <>
        <CircuitMap zone="Turn 11" />
        <button>Next control</button>
      </>
    )
    const button = screen.getByRole('button', { name: 'Highlight Turn 11 on circuit map' })

    await user.tab()
    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.tab()
    expect(screen.getByRole('status')).toHaveTextContent('Highlighted zone: Turn 11')

    await user.tab({ shift: true })
    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await user.tab()
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Turn 11')
  })

  it('clears the highlight when the pointer leaves after unpinning with a click', async () => {
    const user = userEvent.setup()
    render(<CircuitMap zone="Turn 3" />)
    const button = screen.getByRole('button', { name: 'Highlight Turn 3 on circuit map' })

    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.unhover(button)
    expect(screen.getByRole('status')).toHaveTextContent('Highlighted zone: Turn 3')

    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    // The click focused the button, but only keyboard focus emphasises the zone…
    expect(button).toHaveFocus()
    await user.unhover(button)
    // …so moving off the map clears it without clicking elsewhere on the page.
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Turn 3')
  })

  it('does not leave a hover highlight behind after a tap', async () => {
    const user = userEvent.setup()
    render(<CircuitMap zone="Turn 3" />)
    const button = screen.getByRole('button', { name: 'Highlight Turn 3 on circuit map' })

    await user.pointer({ keys: '[TouchA]', target: button })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Highlighted zone: Turn 3')

    await user.pointer({ keys: '[TouchA]', target: button })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Turn 3')
  })

  it('keeps map instances and their accessible label IDs independent', async () => {
    const user = userEvent.setup()
    render(
      <>
        <CircuitMap zone="Turn 3" label="Circuit map for ticket A" />
        <CircuitMap zone="Main Straight" label="Circuit map for ticket B" />
        <button>Next control</button>
      </>
    )
    const first = screen.getByRole('figure', { name: 'Circuit map for ticket A' })
    const second = screen.getByRole('figure', { name: 'Circuit map for ticket B' })
    const firstButton = within(first).getByRole('button')
    const secondButton = within(second).getByRole('button')

    const referencedIds = [first, second].flatMap((figure) => {
      const map = within(figure).getByRole('img')
      const labelledBy = map.getAttribute('aria-labelledby')
      const describedBy = within(figure).getByRole('button').getAttribute('aria-describedby')
      expect(labelledBy).toBeTruthy()
      expect(describedBy).toBeTruthy()
      const ids = `${labelledBy} ${describedBy}`.split(/\s+/)
      for (const id of ids) {
        expect(figure).toContainElement(document.getElementById(id))
      }
      return ids
    })
    expect(new Set(referencedIds).size).toBe(referencedIds.length)

    await user.click(firstButton)
    await user.unhover(firstButton)
    await user.tab()
    expect(firstButton).toHaveAttribute('aria-pressed', 'true')
    expect(secondButton).toHaveAttribute('aria-pressed', 'false')
    expect(within(first).getByRole('status')).toHaveTextContent('Highlighted zone: Turn 3')

    await user.click(secondButton)
    await user.unhover(secondButton)
    await user.tab()
    expect(within(first).getByRole('status')).toHaveTextContent('Highlighted zone: Turn 3')
    expect(within(second).getByRole('status')).toHaveTextContent('Highlighted zone: Main Straight')

    await user.click(firstButton)
    await user.unhover(firstButton)
    await user.tab()
    expect(firstButton).toHaveAttribute('aria-pressed', 'false')
    expect(secondButton).toHaveAttribute('aria-pressed', 'true')
    expect(within(first).getByRole('status')).toHaveTextContent('Ticket zone: Turn 3')
    expect(within(second).getByRole('status')).toHaveTextContent('Highlighted zone: Main Straight')
  })

  it('clears a pinned highlight when the ticket zone changes', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<CircuitMap zone="Turn 3" />)
    await user.click(screen.getByRole('button', { name: 'Highlight Turn 3 on circuit map' }))
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')

    rerender(<CircuitMap zone="Turn 11" />)
    expect(
      screen.getByRole('button', { name: 'Highlight Turn 11 on circuit map' })
    ).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Turn 11')
    expect(screen.getByRole('img').querySelector('[data-zone]')).toHaveAttribute(
      'data-zone',
      'turn-11'
    )
  })

  it('reports a failed base image and disables misleading highlight interactions', async () => {
    const user = userEvent.setup()
    render(<CircuitMap zone="Turn 3" />)
    const button = screen.getByRole('button', { name: 'Highlight Turn 3 on circuit map' })
    await user.hover(button)
    expect(screen.getByRole('status')).toHaveTextContent('Highlighted zone: Turn 3')

    fireEvent.error(screen.getByRole('img').querySelector('image')!)
    expect(screen.getByText('Zone map not available.')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(button).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('Ticket zone: Turn 3')
  })
})

describe('circuit maps in ticket exploration', () => {
  it('renders a labelled map in every browse card from that ticket’s stored zone', () => {
    render(<TicketBrowseClient />)

    const list = screen.getByRole('list', { name: 'Available ticket types' })
    expect(within(list).getAllByRole('figure')).toHaveLength(tickets.length)
    for (const ticket of tickets) {
      const card = within(list).getByRole('heading', { name: ticket.name }).closest('article')!
      const map = within(card).getByRole('figure', { name: `Circuit map for ${ticket.name}` })
      expect(within(map).getByRole('status')).toHaveTextContent(`Ticket zone: ${ticket.zone}`)
      expect(within(map).getByRole('img').querySelector('[data-zone]')).toHaveAttribute(
        'data-zone',
        zoneIds[ticket.zone]
      )
    }
  })

  it('aligns each comparison map with its selected ticket column', () => {
    const selected = [tickets[4]!, tickets[0]!, tickets[2]!]
    mocks.explorer.mockReturnValue(catalog(selected))
    render(<TicketCompareClient />)

    const table = screen.getByRole('table')
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((header) => within(header).getByRole('heading').textContent)
    ).toEqual(selected.map((ticket) => ticket.name))
    const row = within(table).getAllByRole('figure')[0]!.closest('tr')!
    const columns = within(row).getAllByRole('cell')
    expect(columns).toHaveLength(selected.length)
    expect(within(row).getAllByRole('figure')).toHaveLength(selected.length)
    selected.forEach((ticket, index) => {
      const map = within(columns[index]!).getByRole('figure', {
        name: `Circuit map for ${ticket.name}`,
      })
      expect(within(map).getByRole('status')).toHaveTextContent(`Ticket zone: ${ticket.zone}`)
      expect(within(map).getByRole('img').querySelector('[data-zone]')).toHaveAttribute(
        'data-zone',
        zoneIds[ticket.zone]
      )
    })
  })
})
