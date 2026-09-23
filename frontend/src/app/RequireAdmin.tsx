import { Navigate, Outlet } from 'react-router'
import { useAuth } from './auth-context'

export function RequireAdmin() {
  const { user } = useAuth()

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/issues" replace />
  }

  return <Outlet />
}
