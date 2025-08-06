import React from 'react';

const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error, errorInfo) => {
      console.error('Error caught by boundary:', error, errorInfo);
      setHasError(true);
    };

    // This is a simplified error boundary - in a real app you'd use componentDidCatch
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', (event) => {
      errorHandler(event.reason, { componentStack: '' });
    });

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  if (hasError) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger text-center">
              <h4 className="alert-heading">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Oops! Something went wrong
              </h4>
              <p>We encountered an unexpected error. Please try refreshing the page.</p>
              <hr />
              <button 
                className="btn btn-outline-danger"
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
