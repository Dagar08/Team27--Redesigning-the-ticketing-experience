'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="font-semibold text-white">Something went wrong</p>
            <p className="max-w-sm text-sm text-zinc-300">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="text-gp-red-400 min-h-11 rounded-sm text-sm font-semibold underline underline-offset-2 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
