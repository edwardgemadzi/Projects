import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Log error to external service in production
        if (process.env.NODE_ENV === 'production') {
            // Send to error reporting service
            console.log('Error logged to service:', error.message);
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow">
                                <div className="card-body text-center p-5">
                                    <div className="mb-4">
                                        <i className="fas fa-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
                                    </div>
                                    <h3 className="card-title mb-3">Oops! Something went wrong</h3>
                                    <p className="text-muted mb-4">
                                        We encountered an unexpected error. Our team has been notified and is working to fix it.
                                    </p>
                                    
                                    {process.env.NODE_ENV === 'development' && this.state.error && (
                                        <div className="alert alert-warning text-start mb-4">
                                            <h6 className="alert-heading">Error Details (Development)</h6>
                                            <p className="mb-1"><strong>Error:</strong> {this.state.error.message}</p>
                                            <details>
                                                <summary>Stack Trace</summary>
                                                <pre className="mt-2" style={{ fontSize: '0.8rem' }}>
                                                    {this.state.errorInfo?.componentStack}
                                                </pre>
                                            </details>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-center gap-3">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={this.handleRetry}
                                        >
                                            <i className="fas fa-redo me-2"></i>
                                            Try Again
                                        </button>
                                        <button 
                                            className="btn btn-outline-secondary"
                                            onClick={this.handleRefresh}
                                        >
                                            <i className="fas fa-sync-alt me-2"></i>
                                            Refresh Page
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <small className="text-muted">
                                            If the problem persists, please contact support.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
