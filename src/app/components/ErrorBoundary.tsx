import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Filter out known non-critical errors
    const errorMessage = error.message || error.toString() || '';
    const errorStack = error.stack || '';
    
    // Ignore Figma Make internal errors and runtime errors
    if (errorMessage.includes('logPreviewError') || 
        errorMessage.includes('reduxState') ||
        errorMessage.includes('Cross-Origin Resource Sharing') ||
        errorMessage.includes('Unknown runtime error') ||
        errorMessage.includes('webpack-artifacts') ||
        errorStack.includes('figma.com') ||
        errorStack.includes('code_components_preview_iframe')) {
      return { hasError: false, error: null };
    }
    
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    const errorMessage = error.message || error.toString() || '';
    const errorStack = error.stack || '';
    
    // Suppress known non-critical errors from logging
    if (errorMessage.includes('logPreviewError') || 
        errorMessage.includes('reduxState') ||
        errorMessage.includes('Cross-Origin Resource Sharing') ||
        errorMessage.includes('Unknown runtime error') ||
        errorMessage.includes('webpack-artifacts') ||
        errorStack.includes('figma.com') ||
        errorStack.includes('code_components_preview_iframe')) {
      return;
    }
    
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Une erreur s'est produite</h2>
            <p className="text-gray-600 mb-4">L'application a rencontré une erreur inattendue.</p>
            {this.state.error && (
              <p className="text-sm text-gray-500 mb-4 font-mono bg-gray-100 p-2 rounded">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}