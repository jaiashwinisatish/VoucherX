import { Component, ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Unhandled application error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-xl p-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">VoucherX failed to load</h1>
            <p className="text-slate-600 mb-4">
              A runtime error was caught. Please refresh the page. If you use ad/tracker blockers, allow `127.0.0.1`
              for local development.
            </p>
            {this.state.errorMessage && (
              <pre className="text-xs bg-slate-100 text-slate-700 rounded-lg p-3 overflow-x-auto">
                {this.state.errorMessage}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
