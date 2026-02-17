import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ToastContext } from '../../context/ToastContext.js';
import './Toast.css';

/**
 * Toast Provider - Manages toast notifications
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Remove toast function (defined before addToast to avoid reference issues)
  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    const newToast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Toast Container Component
 */
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

ToastContainer.propTypes = {
  toasts: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

/**
 * Individual Toast Component
 */
function Toast({ id, message, type, onRemove }) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast-icon" aria-hidden="true">
        {icons[type]}
      </span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => onRemove(id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  onRemove: PropTypes.func.isRequired,
};
