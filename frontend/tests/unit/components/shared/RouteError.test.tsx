import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RouteError } from '@/components/shared/RouteError'
import TicketsError from '@/app/(dashboard)/tickets/error'

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('route error boundaries (no technical text, per the error-message rules)', () => {
  it('shows a friendly fallback without the raw error or its digest, and retries', async () => {
    const retry = vi.fn()
    const user = userEvent.setup()
    const error = Object.assign(new Error('Cannot read properties of undefined'), {
      digest: 'abc123',
    })
    render(<RouteError error={error} retry={retry} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Something went wrong')
    expect(alert).not.toHaveTextContent('abc123')
    expect(alert).not.toHaveTextContent('Cannot read properties')
    expect(screen.getByRole('link', { name: 'Back to dashboard' })).toHaveAttribute(
      'href',
      '/dashboard'
    )
    expect(console.error).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(retry).toHaveBeenCalledTimes(1)
  })

  it('keeps ticket users within the ticket explorer', () => {
    render(<TicketsError error={new Error('boom')} retry={vi.fn()} />)

    expect(screen.getByRole('heading', { name: "We couldn't show this ticket page" })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Back to tickets' })).toHaveAttribute(
      'href',
      '/tickets'
    )
  })
})
