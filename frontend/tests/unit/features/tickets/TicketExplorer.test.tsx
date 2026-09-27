import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
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
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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
    }
    expect(mocks.read).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps add/remove state in sync across browse, detail and the selection panel', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Explorer />)
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
    expect(within(dialog).getByText('View description not provided.')).toBeInTheDocument()
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
