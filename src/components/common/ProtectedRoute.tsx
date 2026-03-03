import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/useUser'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ProtectedRoute({ children, fallback = null }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useUser()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />
  }

  return fallback || children
}
