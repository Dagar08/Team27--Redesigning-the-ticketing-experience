import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroVideo } from '@/components/landing/HeroVideo'

let paused: boolean
let play: ReturnType<typeof vi.fn>

beforeEach(() => {
  paused = true
  play = vi.fn(function (this: HTMLMediaElement) {
    paused = false
    this.dispatchEvent(new Event('play'))
    return Promise.resolve()
  })
  Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: play })
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value(this: HTMLMediaElement) {
      paused = true
      this.dispatchEvent(new Event('pause'))
    },
  })
  Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
    configurable: true,
    get: () => paused,
  })
})

afterEach(() => {
  cleanup()
  Reflect.deleteProperty(HTMLMediaElement.prototype, 'play')
  Reflect.deleteProperty(HTMLMediaElement.prototype, 'pause')
  Reflect.deleteProperty(HTMLMediaElement.prototype, 'paused')
})

describe('HeroVideo', () => {
  it('starts the muted looping race video on mount, even with reduced motion', async () => {
    const { container } = render(<HeroVideo />)
    await act(async () => {})

    const video = container.querySelector('video')!
    expect(video.muted).toBe(true)
    expect(video.loop).toBe(true)
    expect(video).not.toHaveClass('motion-reduce:hidden')
    expect(video.querySelector('source')).toHaveAttribute('src', '/media/race-loop.mp4')
    expect(play).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Pause background video' })).toBeInTheDocument()
  })

  it('lets users pause and resume the background motion', async () => {
    const user = userEvent.setup()
    render(<HeroVideo />)
    await act(async () => {})

    await user.click(screen.getByRole('button', { name: 'Pause background video' }))
    expect(screen.getByRole('button', { name: 'Play background video' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Play background video' }))
    expect(screen.getByRole('button', { name: 'Pause background video' })).toBeInTheDocument()
  })

  it('shows a play control if the browser blocks autoplay', async () => {
    play.mockImplementationOnce(() => Promise.reject(new Error('NotAllowedError')))
    render(<HeroVideo />)
    await act(async () => {})

    expect(screen.getByRole('button', { name: 'Play background video' })).toBeInTheDocument()
  })
})
