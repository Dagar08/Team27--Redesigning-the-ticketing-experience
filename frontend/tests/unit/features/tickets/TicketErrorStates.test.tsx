import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { TicketType } from '@/types/firestore'
import { TicketExplorerProvider } from '@/features/tickets/components/TicketExplorerProvider'
import { TicketBrowseClient } from '@/features/tickets/components/TicketBrowseClient'
import { describeTicketLoadError } from '@/features/tickets/components/TicketElements'
import { normalizeTicketType } from '@/features/tickets/hooks/useTicketTypes'
import ticketSeed from '../../../../../firebase/seed/ticket-types.json'

const mocks = vi.hoisted(() => ({
  read: vi.fn(),
  auth: { user: { uid: 'user-1' } as { uid: string } | null, loading: false },
}))

vi.mock('firebase/firestore/lite', () => ({ getDocs: mocks.read }))
vi.mock('@/lib/firebase/firestore', () => ({
  getTicketTypesCollection: () => ({ path: 'ticketType' }),
}))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => mocks.auth }))

const tickets: TicketType[] = ticketSeed.map((ticket) => ({ ...ticket, _schemaVersion: 1 }))
const firstTicket = tickets[0]!

interface Snapshot {
  docs: { id: string; data: () => unknown }[]
}

let requests: { resolve: (snapshot: Snapshot) => void; reject: (error: Error) => void }[]

function snapshot<T extends { id: string }>(data: readonly T[]): Snapshot {
  return { docs: data.map((record) => ({ id: record.id, data: () => record })) }
}

function firebaseError(code: string) {
  return Object.assign(new Error(code), { code })
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
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  mocks.read.mockImplementation(
    () => new Promise<Snapshot>((resolve, reject) => requests.push({ resolve, reject }))
  )
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

const ERR_01 = "We couldn't load tickets right now. Please try again."

describe('ERR-01 to ERR-03, FS-01 to FS-03: failed catalog reads on Browse', () => {
  it.each(['permission-denied', 'unavailable', 'internal', 'deadline-exceeded'])(
    'ERR-01/FS-01: shows the plain message for a %s failure, with no cards or raw text',
    async (code) => {
      render(<Explorer />)

      await act(async () => requests[0]!.reject(firebaseError(code)))

      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent(ERR_01)
      expect(alert).not.toHaveTextContent(code)
      expect(screen.queryByText(/Firestore|Missing or insufficient/i)).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
      expect(screen.queryByRole('list', { name: 'Available ticket types' })).not.toBeInTheDocument()
      expect(console.error).toHaveBeenCalled()
    }
  )

  it('ERR-01/FS-02: replaces loading with the error after 10 seconds', async () => {
    vi.useFakeTimers()
    try {
      render(<Explorer />)

      await act(async () => vi.advanceTimersByTime(9_999))
      expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()

      await act(async () => vi.advanceTimersByTime(1))
      expect(screen.getByRole('alert')).toHaveTextContent(ERR_01)
    } finally {
      vi.useRealTimers()
    }
  })

  it('FS-03: tells an offline user to check their connection', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    expect(describeTicketLoadError()).toBe("You're offline. Check your connection and try again.")
  })

  it('ERR-02: Retry shows loading, then the tickets, and focus moves to the list', async () => {
    const user = userEvent.setup()
    render(<Explorer />)

    await act(async () => requests[0]!.reject(firebaseError('unavailable')))
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await act(async () => requests[1]!.resolve(snapshot(tickets)))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: firstTicket.name })).toBeInTheDocument()
    expect(screen.getByLabelText('Ticket results')).toHaveFocus()
  })

  it('ERR-03: a second failure keeps the same message, Retry still works and nothing loops', async () => {
    const user = userEvent.setup()
    render(<Explorer />)

    await act(async () => requests[0]!.reject(firebaseError('unavailable')))
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    await act(async () => requests[1]!.reject(firebaseError('unavailable')))

    expect(screen.getByRole('alert')).toHaveTextContent(ERR_01)
    const retryButton = screen.getByRole('button', { name: 'Retry' })
    expect(retryButton).toHaveFocus()
    expect(mocks.read).toHaveBeenCalledTimes(2)

    await act(async () => {})
    expect(mocks.read).toHaveBeenCalledTimes(2)

    await user.click(retryButton)
    expect(mocks.read).toHaveBeenCalledTimes(3)
  })
})

describe('ERR-04, ERR-05: detail links', () => {
  it('ERR-04: a failed read on a detail link explains it in the modal, focused, with Retry', async () => {
    window.history.replaceState(null, '', `/tickets?ticket=${firstTicket.id}`)
    const user = userEvent.setup()
    render(<Explorer />)

    await act(async () => requests[0]!.reject(firebaseError('unavailable')))

    const dialog = screen.getByRole('dialog', { name: 'Ticket details' })
    const message = within(dialog).getByRole('alert')
    expect(message).toHaveTextContent("We couldn't load this ticket.")
    expect(message).not.toHaveTextContent('unavailable')
    expect(message).toHaveFocus()

    await user.click(within(dialog).getByRole('button', { name: 'Retry' }))
    await act(async () => requests[1]!.reject(firebaseError('unavailable')))
    expect(screen.getByRole('dialog', { name: 'Ticket details' })).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByRole('alert')).toHaveFocus()

    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Retry' }))
    await act(async () => requests[2]!.resolve(snapshot(tickets)))
    expect(screen.getByRole('dialog', { name: firstTicket.name })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close ticket details' })).toHaveFocus()
  })

  it('ERR-04: Close dismisses the failed detail modal and leaves the Browse error', async () => {
    window.history.replaceState(null, '', `/tickets?ticket=${firstTicket.id}`)
    const user = userEvent.setup()
    render(<Explorer />)

    await act(async () => requests[0]!.reject(firebaseError('unavailable')))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.location.search).toBe('')
    expect(screen.getByRole('alert')).toHaveTextContent(ERR_01)
  })

  it('ERR-05: an unknown ticket shows "Ticket not found" with a Back to tickets link', async () => {
    window.history.replaceState(null, '', '/tickets?ticket=missing-ticket')
    const user = userEvent.setup()
    render(<Explorer />)

    await act(async () => requests[0]!.resolve(snapshot(tickets)))

    const dialog = screen.getByRole('dialog', { name: 'Ticket not found' })
    expect(within(dialog).getByRole('alert')).toHaveTextContent('link is invalid')
    const back = within(dialog).getByRole('link', { name: 'Back to tickets' })
    expect(back).toHaveAttribute('href', '/tickets')

    await user.click(back)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: firstTicket.name })).toBeInTheDocument()
  })
})

describe('FS-06 and empty states: missing and malformed data', () => {
  it('normalizes partial records and rejects records without a name or valid price', () => {
    expect(normalizeTicketType('a', { name: 'Ticket', priceAud: 10 })).toEqual({
      id: 'a',
      name: 'Ticket',
      priceAud: 10,
      daysCovered: [],
      zone: '',
      viewDescription: undefined,
      includes: undefined,
      excludes: undefined,
      _schemaVersion: 1,
    })
    expect(normalizeTicketType('b', { name: '  ', priceAud: 10 })).toBeNull()
    expect(normalizeTicketType('c', { name: 'Ticket', priceAud: '10' })).toBeNull()
    expect(normalizeTicketType('d', { name: 'Ticket', priceAud: Number.NaN })).toBeNull()
    expect(normalizeTicketType('e', null)).toBeNull()
    expect(normalizeTicketType('z', { name: 'Free', priceAud: 0 })).toBeNull()
    expect(
      normalizeTicketType('f', { name: 'Ticket', priceAud: 5, daysCovered: 'Fri', includes: [1] })
    ).toMatchObject({ daysCovered: [], includes: undefined })
  })

  it('renders malformed catalog records safely instead of crashing', async () => {
    const user = userEvent.setup()
    render(<Explorer />)

    await act(async () =>
      requests[0]!.resolve(
        snapshot([
          { id: 'partial', name: 'Partial ticket', priceAud: 50 },
          { id: 'no-price', name: 'No price' },
          { id: 'no-name', priceAud: 20 },
        ])
      )
    )

    const list = screen.getByRole('list', { name: 'Available ticket types' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(within(list).getAllByText('Not specified').length).toBeGreaterThan(0)
    expect(screen.queryByText('No price')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'View details: Partial ticket' }))
    expect(screen.getByRole('dialog', { name: 'Partial ticket' })).toBeInTheDocument()
  })

  it('EMP-02/A11Y-12: announces the empty state when every record is unusable and can check again', async () => {
    const user = userEvent.setup()
    render(<Explorer />)

    await act(async () => requests[0]!.resolve(snapshot([{ id: 'broken' }])))
    expect(
      screen.getByText('No tickets are on sale yet.').closest('[role="status"]')
    ).toHaveTextContent('No tickets are on sale yet.Check back soon.')

    await user.click(screen.getByRole('button', { name: 'Check again' }))
    expect(mocks.read).toHaveBeenCalledTimes(2)
    await act(async () => requests[1]!.resolve(snapshot(tickets)))
    expect(screen.getByRole('heading', { name: firstTicket.name })).toBeInTheDocument()
  })

  it('FS-04: replaces a failed detail map image with "Zone map not available"', async () => {
    window.history.replaceState(null, '', `/tickets?ticket=${firstTicket.id}`)
    render(<Explorer />)

    await act(async () => requests[0]!.resolve(snapshot(tickets)))

    const dialog = screen.getByRole('dialog', { name: firstTicket.name })
    fireEvent.error(dialog.querySelector('image')!)
    expect(within(dialog).getByText('Zone map not available.')).toBeInTheDocument()
  })
})
