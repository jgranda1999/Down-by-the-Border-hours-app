import { Component, type ErrorInfo, type ReactNode } from 'react'
import Button from '@/components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Intentionally no console logging in production UI paths.
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-brand-surface px-4">
          <div className="w-full max-w-md rounded-xl border border-brand-border bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-brand-ink">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-brand-muted">
              The app hit an unexpected error. Refresh the page and try again.
            </p>
            <div className="mt-6">
              <Button onClick={this.handleReload}>Refresh page</Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
