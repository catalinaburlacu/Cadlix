import { useState, useCallback } from 'react'
import type { Toast as ToastData, ToastType, ToastContextType, ChildrenProps } from '@/types'
import { ToastContext } from '../../context/ToastContext'
import './Toast.css'

export function ToastProvider({ children }: ChildrenProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const removeToast = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 5000): string => {
      const id = Date.now().toString()
      const newToast: ToastData = { id, message, type, duration }

      setToasts(prev => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    [removeToast]
  )

  const toast: ToastContextType = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className='toast-container' role='region' aria-live='polite' aria-label='Notifications'>
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

interface ToastItemProps extends ToastData {
  onRemove: (id: string) => void
}

function ToastItem({ id, message, type, onRemove }: ToastItemProps) {
  const icons: Record<ToastType, string> = {
    success: '\u2713',
    error: '\u2715',
    warning: '\u26A0',
    info: '\u2139',
  }

  return (
    <div className={`toast toast--${type}`} role='alert'>
      <span className='toast-icon' aria-hidden='true'>
        {icons[type]}
      </span>
      <span className='toast-message'>{message}</span>
      <button className='toast-close' onClick={() => onRemove(id)} aria-label='Close notification'>
        x
      </button>
    </div>
  )
}
