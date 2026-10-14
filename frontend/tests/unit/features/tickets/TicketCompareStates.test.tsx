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
    addTicket: vi.fn(),
    removeTicket: vi.fn(),
    clearSelection: vi.fn(),
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
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

  it('EMP-05: names the selected ticket and asks for one more', () => {
    mocks.explorer.mockReturnValue(catalog({ selectedTickets: [tickets[0]!] }))
    render(<TicketCompareClient />)

    expect(screen.getByText('Add at least one more ticket to compare')).toBeInTheDocument()
    expect(screen.getByText(`Selected: ${tickets[0]!.name}.`, { exact: false })).toBeInTheDocument()
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

    const daysRow = within(screen.getByRole('table')).getByText('Days').closest('tr')!
    expect(within(daysRow).getByText('Not specified')).toBeInTheDocument()
    const zoneRow = within(screen.getByRole('table'))
      .getByText('Zone', { selector: 'th' })
      .closest('tr')!
    expect(within(zoneRow).getByText('Not specified')).toBeInTheDocument()
    const includesRow = within(screen.getByRole('table')).getByText('Includes').closest('tr')!
    expect(within(includesRow).getAllByText('Entry')).toHaveLength(2)
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
