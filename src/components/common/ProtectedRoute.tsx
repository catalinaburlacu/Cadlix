import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/useUser'
import type { ChildrenProps } from '@/types'

export default function ProtectedRoute({ children }: ChildrenProps) {
  const { isAuthenticated, user } = useUser()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />
  }

  return children
}
