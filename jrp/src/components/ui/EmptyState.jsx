import React from 'react';

const EmptyState = ({ 
  icon = 'bi-inbox',
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionButton = null,
  className = ''
}) => {
  return (
    <div className={`text-center py-5 ${className}`}>
      <div className="mb-4">
        <i className={`${icon} display-1 text-muted`}></i>
      </div>
      <h3 className="text-muted mb-3">{title}</h3>
      <p className="text-muted mb-4">{description}</p>
      {actionButton && (
        <div>
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
