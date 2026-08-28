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
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    return { hasError: false, error: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Zentrix Auto-recovered Error:', error, errorInfo);
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
  }

  public render() {
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
