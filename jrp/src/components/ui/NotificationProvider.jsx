import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

// Notification Context
const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const showSuccess = useCallback((message, duration) => addNotification(message, 'success', duration), [addNotification]);
  const showError = useCallback((message, duration) => addNotification(message, 'error', duration), [addNotification]);
  const showWarning = useCallback((message, duration) => addNotification(message, 'warning', duration), [addNotification]);
  const showInfo = useCallback((message, duration) => addNotification(message, 'info', duration), [addNotification]);
  
  // Generic showNotification function for backwards compatibility
  const showNotification = useCallback((message, type = 'info', duration) => {
    return addNotification(message, type, duration);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showNotification
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Notification Container Component
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Individual Toast Component
const NotificationToast = ({ notification, onClose }) => {
  const { id, message, type } = notification;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getToastClass = () => {
    const baseClasses = 'toast show mb-2';
    switch (type) {
      case 'success':
        return `${baseClasses} border-success`;
      case 'error':
        return `${baseClasses} border-danger`;
      case 'warning':
        return `${baseClasses} border-warning`;
      default:
        return `${baseClasses} border-info`;
    }
  };

  const getIconClass = () => {
    switch (type) {
      case 'success':
        return 'bi bi-check-circle-fill text-success';
      case 'error':
        return 'bi bi-exclamation-triangle-fill text-danger';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill text-warning';
      default:
        return 'bi bi-info-circle-fill text-info';
    }
  };

  return (
    <div className={getToastClass()} role="alert">
      <div className="toast-header">
        <i className={`${getIconClass()} me-2`}></i>
        <strong className="me-auto">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </strong>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default NotificationProvider;
