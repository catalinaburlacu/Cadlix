import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/useUser'
import type { ChildrenProps } from '@/types'

export default function AdminRoute({ children }: ChildrenProps) {
  const { isAuthenticated, user } = useUser()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to='/home' replace />
  }

  return children
}
