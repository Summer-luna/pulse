import { Navigate, Outlet } from 'react-router'
import { useAuth } from './auth-context'

export function GuestOnly() {
  const { status } = useAuth()

  if (status === 'loading') {
    return null
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
