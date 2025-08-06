import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border spinner-border-lg'
  };

  const spinnerClass = `spinner-border text-primary ${sizeClasses[size]}`;

  if (fullScreen) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-light bg-opacity-75" style={{ zIndex: 9999 }}>
        <div className={spinnerClass} role="status">
          <span className="visually-hidden">{text}</span>
        </div>
        {text && <p className="mt-3 text-muted">{text}</p>}
      </div>
    );
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-4">
      <div className={spinnerClass} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <p className="mt-2 text-muted">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
