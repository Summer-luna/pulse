import type { ReactNode } from 'react'
import { useAuthController } from '@/controllers/use-auth-controller'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const api = useAuthController()
  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}
