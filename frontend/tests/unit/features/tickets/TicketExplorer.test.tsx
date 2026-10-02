import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { TicketType } from '@/types/firestore'
import {
  TicketExplorerProvider,
  useTicketExplorer,
} from '@/features/tickets/components/TicketExplorerProvider'
import { TicketBrowseClient } from '@/features/tickets/components/TicketBrowseClient'
import ticketSeed from '../../../../../firebase/seed/ticket-types.json'

const mocks = vi.hoisted(() => ({
  read: vi.fn(),
  getCollection: vi.fn(() => ({ path: 'ticketType' })),
  auth: { user: { uid: 'user-1' } as { uid: string } | null, loading: false },
}))

vi.mock('firebase/firestore/lite', () => ({ getDocs: mocks.read }))
vi.mock('@/lib/firebase/firestore', () => ({ getTicketTypesCollection: mocks.getCollection }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => mocks.auth }))

const tickets: TicketType[] = ticketSeed.map((ticket) => ({ ...ticket, _schemaVersion: 1 }))
const firstTicket = tickets[0]!
const secondTicket = tickets[1]!

interface Snapshot {
  docs: { id: string; data: () => TicketType }[]
}

interface CatalogRequest {
  resolve: (snapshot: Snapshot) => void
  reject: (error: Error) => void
}

let requests: CatalogRequest[]

async function publish(data = tickets, request = requests.at(-1)!) {
  await act(async () => {
    request.resolve({ docs: data.map((ticket) => ({ id: ticket.id, data: () => ticket })) })
  })
}

function Explorer() {
  return (
    <TicketExplorerProvider>
      <TicketBrowseClient />
    </TicketExplorerProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  window.history.replaceState(null, '', '/tickets')
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true
    },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = false
    },
  })
  requests = []
  vi.spyOn(console, 'error').mockImplementation(() => {})
  mocks.auth.user = { uid: 'user-1' }
  mocks.auth.loading = false
  mocks.getCollection.mockReturnValue({ path: 'ticketType' })
  mocks.read.mockImplementation(
    () => new Promise<Snapshot>((resolve, reject) => requests.push({ resolve, reject }))
  )
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

describe('ticket explorer', () => {
  it('orders ticket types by price with stable alphabetical ties', async () => {
    render(<Explorer />)
    const catalog = [
      { ...firstTicket, name: 'Zulu', priceAud: 200 },
      { ...secondTicket, name: 'Alpha', priceAud: 200 },
      { ...tickets[2]!, name: 'Cheapest', priceAud: 100 },
    ]
    await publish(catalog)
    const list = screen.getByRole('list', { name: 'Available ticket types' })
    expect(
      within(list)
        .getAllByRole('heading')
        .map((heading) => heading.textContent)
    ).toEqual(['Cheapest', 'Alpha', 'Zulu'])
  })

  it('shows the existing zone value and an honest missing-map fallback', async () => {
    render(<Explorer />)
    window.history.replaceState(null, '', `/tickets?ticket=${firstTicket.id}`)
    await publish([{ ...firstTicket, zone: 'New viewing area' }])
    const dialog = screen.getByRole('dialog', { name: firstTicket.name })
    expect(within(dialog).getByLabelText('Ticket zone: New viewing area')).toHaveTextContent(
      'New viewing area'
    )
    expect(within(dialog).getByText('Zone map not available.')).toBeInTheDocument()
  })

  it('keeps a missing zone readable without inventing a location', async () => {
    window.history.replaceState(null, '', `/tickets?ticket=${firstTicket.id}`)
    render(<Explorer />)
    await publish([{ ...firstTicket, zone: '' }])
    expect(
      within(screen.getByRole('dialog')).getByLabelText('Ticket zone: Not specified')
    ).toHaveTextContent('Not specified')
  })

  it('opens a direct detail URL and closes it back to the browse URL', async () => {
    const user = userEvent.setup()
    window.history.replaceState(null, '', `/tickets?ticket=${firstTicket.id}`)
    render(<Explorer />)
    await publish()
    const dialog = screen.getByRole('dialog', { name: firstTicket.name })
    expect(document.body.style.overflow).toBe('hidden')
    await user.click(within(dialog).getByRole('button', { name: 'Close ticket details' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.location.pathname + window.location.search).toBe('/tickets')
    expect(document.body.style.overflow).toBe('')
  })

  it('uses browser back and forward for modal details while preserving selection', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    await publish()
    await user.click(screen.getByRole('button', { name: `Add to selection: ${firstTicket.name}` }))
    const list = screen.getByRole('list', { name: 'Available ticket types' })
    await user.click(
      within(list).getByRole('button', { name: `View details: ${firstTicket.name}` })
    )
    expect(new URLSearchParams(window.location.search).get('ticket')).toBe(firstTicket.id)
    await act(async () => window.history.back())
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('1 ticket type selected')).toBeInTheDocument()
    await act(async () => window.history.forward())
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: firstTicket.name })).toBeInTheDocument()
    )
    expect(mocks.read).toHaveBeenCalledTimes(1)
  })

  it('shows a clear not-found modal for an invalid detail URL', async () => {
    const user = userEvent.setup()
    window.history.replaceState(null, '', '/tickets?ticket=missing-ticket')
    render(<Explorer />)
    await publish()
    const dialog = screen.getByRole('dialog', { name: 'Ticket not found' })
    expect(within(dialog).getByRole('alert')).toHaveTextContent('no longer in the catalog')
    await user.click(within(dialog).getByRole('button', { name: 'Back to browse' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on a backdrop click or Escape, but keeps inside padding clicks open', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    await publish()
    const detailsButton = screen.getByRole('button', { name: `View details: ${firstTicket.name}` })
    await user.click(detailsButton)
    const dialog = screen.getByRole('dialog')
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 100,
      left: 100,
      top: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200,
      toJSON: () => ({}),
    })
    fireEvent.click(dialog, { clientX: 120, clientY: 120 })
    expect(dialog).toBeInTheDocument()
    fireEvent.click(dialog, { clientX: 20, clientY: 20 })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(detailsButton).toHaveFocus()
    await user.click(detailsButton)
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('makes the three-ticket selection limit visible and re-enables adding after removal', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    await publish()
    for (const ticket of tickets.slice(0, 3)) {
      await user.click(screen.getByRole('button', { name: `Add to selection: ${ticket.name}` }))
    }
    const fourthButton = screen.getByRole('button', {
      name: `Add to selection: ${tickets[3]!.name}`,
    })
    expect(fourthButton).toBeDisabled()
    expect(fourthButton).toHaveTextContent('Selection limit reached')
    await user.click(fourthButton)
    expect(screen.getByText('3 ticket types selected')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: `Remove ${firstTicket.name} from selection` })
    )
    expect(fourthButton).toBeEnabled()
    await user.click(fourthButton)
    expect(screen.getByText('3 ticket types selected')).toBeInTheDocument()
  })

  it('renders the seeded catalog and opens ticket details in a modal', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(mocks.read).toHaveBeenCalledWith({ path: 'ticketType' })

    await publish()

    const list = screen.getByRole('list', { name: 'Available ticket types' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(ticketSeed.length)
    for (const ticket of tickets) {
      expect(within(list).getByRole('heading', { name: ticket.name })).toBeInTheDocument()
      expect(
        within(list).getByRole('button', { name: `View details: ${ticket.name}` })
      ).toBeInTheDocument()
    }
    await user.click(screen.getByRole('button', { name: `View details: ${firstTicket.name}` }))
    const dialog = screen.getByRole('dialog', { name: firstTicket.name })
    expect(within(dialog).getByText(firstTicket.viewDescription!)).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Close ticket details' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('0 ticket types selected')).toBeInTheDocument()
    expect(screen.getByText(/No tickets selected/)).toBeInTheDocument()
  })

  it('shows every requested ticket detail in the modal', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    await publish()

    for (const ticket of tickets) {
      await user.click(screen.getByRole('button', { name: `View details: ${ticket.name}` }))
      const dialog = screen.getByRole('dialog', { name: ticket.name })
      expect(within(dialog).getByText(ticket.daysCovered.join(', '))).toBeInTheDocument()
      expect(within(dialog).getByText(ticket.zone)).toBeInTheDocument()
      expect(within(dialog).getByText(ticket.viewDescription!)).toBeInTheDocument()
      for (const item of [...ticket.includes!, ...ticket.excludes!]) {
        expect(within(dialog).getByText(item)).toBeInTheDocument()
      }
      await user.click(within(dialog).getByRole('button', { name: 'Close ticket details' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    }
    expect(mocks.read).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps add/remove state in sync across browse, detail and the selection panel', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    await publish()

    await user.click(screen.getByRole('button', { name: `Add to selection: ${firstTicket.name}` }))
    await user.click(screen.getByRole('button', { name: `Add to selection: ${secondTicket.name}` }))
    expect(screen.getByText('2 ticket types selected')).toBeInTheDocument()

    const availableTickets = screen.getByRole('list', { name: 'Available ticket types' })
    await user.click(
      within(availableTickets).getByRole('button', { name: `View details: ${firstTicket.name}` })
    )
    const dialog = screen.getByRole('dialog', { name: firstTicket.name })
    const selectedButton = within(dialog).getByRole('button', {
      name: `Remove from selection: ${firstTicket.name}`,
    })
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true')
    await user.click(selectedButton)
    expect(screen.getByText('1 ticket type selected')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close ticket details' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    expect(
      screen.getByRole('button', { name: `Add to selection: ${firstTicket.name}` })
    ).toHaveAttribute('aria-pressed', 'false')
    expect(
      screen.getByRole('button', { name: `Remove from selection: ${secondTicket.name}` })
    ).toHaveAttribute('aria-pressed', 'true')
    await user.click(
      screen.getByRole('button', { name: `Remove ${secondTicket.name} from selection` })
    )
    expect(screen.getByText('0 ticket types selected')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `Add to selection: ${secondTicket.name}` })
    ).toHaveAttribute('aria-pressed', 'false')

    await user.click(screen.getByRole('button', { name: `Add to selection: ${firstTicket.name}` }))
    expect(
      screen.getByRole('button', { name: `Remove from selection: ${firstTicket.name}` })
    ).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Clear selection' }))
    expect(screen.getByText(/No tickets selected/)).toBeInTheDocument()
    expect(mocks.read).toHaveBeenCalledTimes(1)
  })

  it('ignores duplicate additions, unknown tickets, and repeated removals', async () => {
    function SelectionActions() {
      const { addTicket, removeTicket } = useTicketExplorer()
      return (
        <>
          <button
            onClick={() => {
              addTicket(firstTicket.id)
              addTicket(firstTicket.id)
              addTicket('unknown')
              addTicket(secondTicket.id)
            }}
          >
            Add several
          </button>
          <button
            onClick={() => {
              removeTicket(firstTicket.id)
              removeTicket(firstTicket.id)
            }}
          >
            Remove twice
          </button>
          <TicketBrowseClient />
        </>
      )
    }
    const user = userEvent.setup()
    render(
      <TicketExplorerProvider>
        <SelectionActions />
      </TicketExplorerProvider>
    )
    await publish()
    await user.click(screen.getByRole('button', { name: 'Add several' }))
    expect(screen.getByText('2 ticket types selected')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remove twice' }))
    expect(screen.getByText('1 ticket type selected')).toBeInTheDocument()
    const selection = screen.getByRole('complementary', { name: 'Your selection' })
    expect(
      within(selection).getByRole('button', { name: `View details: ${secondTicket.name}` })
    ).toBeInTheDocument()
  })

  it('retries a failed ticket catalog request', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    await act(async () => requests[0]!.reject(new Error('permission-denied')))
    expect(screen.getByRole('alert')).toHaveTextContent(/couldn't load/)
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(mocks.read).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    await publish()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: firstTicket.name })).toBeInTheDocument()
  })

  it('shows a retryable error if Firestore initialization fails', async () => {
    mocks.getCollection.mockImplementationOnce(() => {
      throw new Error('Missing config')
    })
    const user = userEvent.setup()
    render(<Explorer />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    await publish()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows an empty state when the ticket catalog is empty', async () => {
    render(<Explorer />)
    await publish([])
    expect(screen.getByText('No tickets available')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /View details/ })).not.toBeInTheDocument()
  })

  it('provides neutral fallbacks for optional fields, including empty lists', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    await publish([
      { ...firstTicket, viewDescription: undefined, includes: undefined, excludes: [] },
    ])
    await user.click(screen.getByRole('button', { name: `View details: ${firstTicket.name}` }))
    const dialog = screen.getByRole('dialog', { name: firstTicket.name })
    expect(within(dialog).getByText('View description coming soon.')).toBeInTheDocument()
    expect(within(dialog).getAllByText('Not specified for this ticket.')).toHaveLength(2)
  })

  it('uses Firestore document IDs even if the mirrored ID is outdated', async () => {
    const user = userEvent.setup()
    render(<Explorer />)
    await act(async () =>
      requests[0]!.resolve({
        docs: [{ id: firstTicket.id, data: () => ({ ...firstTicket, id: 'outdated-id' }) }],
      })
    )
    await user.click(screen.getByRole('button', { name: `Add to selection: ${firstTicket.name}` }))
    const selection = screen.getByRole('complementary', { name: 'Your selection' })
    expect(
      within(selection).getByRole('button', { name: `View details: ${firstTicket.name}` })
    ).toBeInTheDocument()
    await user.click(
      within(selection).getByRole('button', { name: `View details: ${firstTicket.name}` })
    )
    expect(screen.getByRole('dialog', { name: firstTicket.name })).toBeInTheDocument()
  })

  it('waits for auth and clears selection when the user changes or signs out', async () => {
    const user = userEvent.setup()
    mocks.auth.loading = true
    const { rerender, unmount } = render(<Explorer />)
    expect(mocks.read).not.toHaveBeenCalled()
    mocks.auth.loading = false
    rerender(<Explorer />)
    await publish()
    await user.click(screen.getByRole('button', { name: `Add to selection: ${firstTicket.name}` }))
    mocks.auth.user = { uid: 'user-2' }
    rerender(<Explorer />)
    expect(mocks.read).toHaveBeenCalledTimes(2)
    await publish()
    expect(screen.getByText('0 ticket types selected')).toBeInTheDocument()
    mocks.auth.user = null
    rerender(<Explorer />)
    expect(screen.getByText('Please sign in to browse tickets.')).toBeInTheDocument()
    unmount()
  })

  it('times out a stalled request and ignores its late result after a successful retry', async () => {
    vi.useFakeTimers()
    render(<Explorer />)
    const stalled = requests[0]!
    await act(async () => vi.advanceTimersByTime(15000))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(mocks.read).toHaveBeenCalledTimes(2)
    await publish()
    await publish([], stalled)
    expect(screen.getByRole('heading', { name: firstTicket.name })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('ignores requests from a previous mount under React Strict Mode', async () => {
    render(
      <StrictMode>
        <Explorer />
      </StrictMode>
    )
    expect(mocks.read).toHaveBeenCalledTimes(2)
    await publish()
    await act(async () => requests[0]!.reject(new Error('late failure')))
    expect(screen.getByRole('heading', { name: firstTicket.name })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('ignores pending requests and timeouts after signing out', async () => {
    vi.useFakeTimers()
    const { rerender } = render(<Explorer />)
    mocks.auth.user = null
    rerender(<Explorer />)
    await act(async () => vi.advanceTimersByTime(15000))
    await publish()
    expect(screen.getByText('Please sign in to browse tickets.')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: firstTicket.name })).not.toBeInTheDocument()
  })
})
