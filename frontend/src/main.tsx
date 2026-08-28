import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Zentrix Workspace Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080A0F] text-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto text-2xl font-mono">
            ⚡
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-2xl font-black tracking-wide text-white">Zentrix Workspace</h1>
            <p className="text-sm text-gray-400">
              A session refresh was required. Click below to clear cache and reload your workspace.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-cyan-400 to-lime-400 text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
          >
            Reset Workspace & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
