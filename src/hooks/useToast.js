import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext.js';

/**
 * Hook to use toast notifications
 * @returns {Object} Toast methods (success, error, warning, info)
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
