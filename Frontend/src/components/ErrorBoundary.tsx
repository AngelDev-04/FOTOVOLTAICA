import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 rounded-lg border border-red-500 bg-red-50 dark:bg-red-900/20">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
            Error al cargar el componente
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 mb-3">
            Ocurrió un error al intentar mostrar este componente. Por favor, recarga la página.
          </p>
          <details className="text-xs text-red-700 dark:text-red-400">
            <summary className="cursor-pointer">Detalles técnicos</summary>
            <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-auto">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
