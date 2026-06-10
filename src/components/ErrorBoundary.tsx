import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
  if (this.state.hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 relative overflow-hidden">

        {/* Background Glow Effects */}
        <div className="absolute w-96 h-96 bg-red-500/20 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">

          {/* Emoji */}
          <div className="text-6xl mb-6 animate-bounce">
            🚨
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            Oops! Something Broke
          </h1>

          {/* Description */}
          <p className="text-white/80 mb-8">
            Don't worry — our system caught the error.
            <br />
            Try refreshing the page to continue.
          </p>

          {/* Button */}
          <button
            onClick={this.handleReload}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Reload Application
          </button>

          {/* Small Footer Text */}
          <p className="text-xs text-white/50 mt-6">
            If the issue persists, please contact support.
          </p>
        </div>
      </div>
    );
  }

  return this.props.children;
}

}

export default ErrorBoundary;
