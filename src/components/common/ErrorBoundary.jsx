import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary - Catches JavaScript errors anywhere in child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Here you could send error to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h2 className="error-boundary__title">Oops! Something went wrong</h2>
            <p className="error-boundary__message">
              We're sorry, but an unexpected error has occurred. Please try refreshing the page.
            </p>
            <details className="error-boundary__details">
              <summary>Error Details</summary>
              <pre className="error-boundary__stack">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <div className="error-boundary__actions">
              <button 
                className="error-boundary__button" 
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <button 
                className="error-boundary__button error-boundary__button--secondary" 
                onClick={this.handleReset}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
