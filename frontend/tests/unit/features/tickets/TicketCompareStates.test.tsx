import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { TicketType } from '@/types/firestore'
import { TicketCompareClient } from '@/features/tickets/components/TicketCompareClient'
import { CircuitMap } from '@/features/tickets/components/CircuitMap'
import ticketSeed from '../../../../../firebase/seed/ticket-types.json'

const mocks = vi.hoisted(() => ({ explorer: vi.fn() }))

vi.mock('@/features/tickets/components/TicketExplorerProvider', () => ({
  MAX_SELECTED_TICKETS: 3,
  useTicketExplorer: mocks.explorer,
}))

const tickets: TicketType[] = ticketSeed.map((ticket) => ({ ...ticket, _schemaVersion: 1 }))

function catalog(overrides: Record<string, unknown> = {}) {
  return {
    tickets,
    loading: false,
    error: null,
    retry: vi.fn(),
    selectedTickets: [] as TicketType[],
    unavailableCount: 0,
    addTicket: vi.fn(),
    removeTicket: vi.fn(),
    selectTickets: vi.fn(),
    clearSelection: vi.fn(),
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  window.history.replaceState(null, '', '/tickets/compare')
})

afterEach(() => {
  cleanup()
})

describe('compare error and empty states', () => {
  it('shows loading instead of the selection prompt while the catalog loads', () => {
    mocks.explorer.mockReturnValue(catalog({ loading: true }))
    render(<TicketCompareClient />)

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(screen.queryByText(/Select 2 or 3/)).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('FS-01: shows the ERR-01 message with Retry when the catalog fails', async () => {
    const value = catalog({ error: Object.assign(new Error('x'), { code: 'unavailable' }) })
    mocks.explorer.mockReturnValue(value)
    const user = userEvent.setup()
    render(<TicketCompareClient />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      "We couldn't load tickets right now. Please try again."
    )
    expect(screen.queryByText(/Select 2 or 3/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(value.retry).toHaveBeenCalledTimes(1)
  })

  it('EMP-04: asks for 2 or 3 tickets and links back to browse', () => {
    mocks.explorer.mockReturnValue(catalog())
    render(<TicketCompareClient />)

    expect(screen.getByText('Select 2 or 3 tickets to compare')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse tickets' })).toHaveAttribute('href', '/tickets')
  })

  it('EMP-05: names the selected ticket, shows its details and asks for one more', () => {
    mocks.explorer.mockReturnValue(catalog({ selectedTickets: [tickets[0]!] }))
    render(<TicketCompareClient />)

    // A11Y-12: the prompt is announced.
    expect(
      screen.getByText('Add at least one more ticket to compare').closest('[role="status"]')
    ).toBeInTheDocument()
    expect(screen.getByText(`Selected: ${tickets[0]!.name}.`, { exact: false })).toBeInTheDocument()

    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('columnheader')).toHaveLength(1)
    expect(within(table).getByRole('heading', { name: tickets[0]!.name })).toBeInTheDocument()
    expect(within(table).getByText(tickets[0]!.daysCovered.join(', '))).toBeInTheDocument()
    expect(within(table).queryByText('Differs')).not.toBeInTheDocument()
  })

  it('ERR-09: a shared link sets the selection, and the URL follows the compared tickets', () => {
    window.history.replaceState(null, '', '/tickets/compare?tickets=a,b')
    const value = catalog({ selectedTickets: [tickets[0]!, tickets[1]!] })
    mocks.explorer.mockReturnValue(value)
    render(<TicketCompareClient />)

    expect(value.selectTickets).toHaveBeenCalledWith(['a', 'b'])
    expect(new URLSearchParams(window.location.search).get('tickets')).toBe(
      `${tickets[0]!.id},${tickets[1]!.id}`
    )
  })

  it('ERR-09: says when a selected ticket is no longer available', () => {
    mocks.explorer.mockReturnValue(
      catalog({ selectedTickets: [tickets[0]!, tickets[1]!], unavailableCount: 1 })
    )
    render(<TicketCompareClient />)

    expect(screen.getByText(/^One ticket is no longer available\./)).toHaveAttribute(
      'role',
      'status'
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('A11Y-08/A11Y-12: removing a column announces it and keeps focus on the page', async () => {
    const value = catalog({ selectedTickets: tickets.slice(0, 3) })
    mocks.explorer.mockReturnValue(value)
    const user = userEvent.setup()
    const { rerender } = render(<TicketCompareClient />)

    await user.click(
      screen.getByRole('button', { name: `Remove ${tickets[0]!.name} from comparison` })
    )
    expect(value.removeTicket).toHaveBeenCalledWith(tickets[0]!.id)
    mocks.explorer.mockReturnValue({ ...value, selectedTickets: tickets.slice(1, 3) })
    rerender(<TicketCompareClient />)

    expect(
      screen.getByRole('button', { name: `Remove ${tickets[1]!.name} from comparison` })
    ).toHaveFocus()
    expect(screen.getByText(`${tickets[0]!.name} removed from comparison.`)).toHaveAttribute(
      'role',
      'status'
    )

    // Below two tickets, focus moves to the prompt asking for another.
    await user.click(
      screen.getByRole('button', { name: `Remove ${tickets[2]!.name} from comparison` })
    )
    mocks.explorer.mockReturnValue({ ...value, selectedTickets: [tickets[1]!] })
    rerender(<TicketCompareClient />)

    expect(
      screen.getByText('Add at least one more ticket to compare').closest('[tabindex="-1"]')
    ).toHaveFocus()
  })

  it('shows neutral fallbacks for missing compare fields and duplicate list items', () => {
    const sparse = {
      ...tickets[0]!,
      id: 'sparse',
      name: 'Sparse ticket',
      zone: '',
      daysCovered: [],
      includes: ['Entry', 'Entry'],
    }
    mocks.explorer.mockReturnValue(catalog({ selectedTickets: [sparse, tickets[1]!] }))
    render(<TicketCompareClient />)

    const table = screen.getByRole('table')
    const cellFor = (label: string) => within(table).getAllByText(label)[0]!.closest('td')!

    expect(within(cellFor('Days')).getByText('Not specified')).toBeInTheDocument()
    expect(within(cellFor('Zone')).getByText('Not specified')).toBeInTheDocument()
    expect(within(cellFor('Includes')).getAllByText('Entry')).toHaveLength(2)

    // A11Y-03: differences are marked with text, not only a tint.
    expect(within(cellFor('Days')).getByText('Differs')).toBeInTheDocument()
  })
})

describe('circuit map overview mode', () => {
  it('shows the whole circuit without ticket-zone details or controls', () => {
    render(<CircuitMap overview label="Albert Park Circuit map" />)

    const figure = screen.getByRole('figure', { name: 'Albert Park Circuit map' })
    const map = within(figure).getByRole('img')
    expect(map).toHaveAccessibleName(/Circuit overview showing the Albert Park track layout/)
    expect(map.querySelector('[data-zone]')).toBeNull()
    expect(within(figure).queryByRole('status')).not.toBeInTheDocument()
    expect(within(figure).queryByRole('button')).not.toBeInTheDocument()
  })

  it('ignores a zone when rendering the overview', () => {
    render(<CircuitMap overview zone="Turn 3" />)
    expect(screen.getByRole('img').querySelector('[data-zone]')).toBeNull()
    expect(screen.queryByText(/Turn 3/)).not.toBeInTheDocument()
  })
})
