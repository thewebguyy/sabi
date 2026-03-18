import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-hot/10 text-hot flex items-center justify-center mb-6">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-syne font-extrabold text-text-primary mb-2">Abeg, something went wrong</h1>
          <p className="text-text-muted mb-8 max-w-xs mx-auto">Sabi encountered a small problem. Try refreshing the page or going back.</p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-accent text-primary font-extrabold px-8 py-4 rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            <RefreshCcw size={20} /> Refresh Sabi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
