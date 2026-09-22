import { createContext, useContext } from 'react'
import type { AuthApi } from '@/controllers/use-auth-controller'

export const AuthContext = createContext<AuthApi | null>(null)

export function useAuth(): AuthApi {
  const api = useContext(AuthContext)
  if (!api) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return api
}
