import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { User } from '@/domain/types'
import { getToken } from '@/lib/auth-token'
import { errorMessage } from '@/lib/error-message'
import { type LoginDraft, type RegisterDraft, authService } from '@/services/auth-service'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthApi {
  user: User | null
  status: AuthStatus
  login: (draft: LoginDraft) => Promise<void>
  register: (draft: RegisterDraft) => Promise<void>
  logout: () => void
  error: string | null
}

export function useAuthController(): AuthApi {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(getToken)

  const me = useQuery({ queryKey: ['me'], queryFn: () => authService.me(), enabled: Boolean(token), retry: false })

  function signOut() {
    authService.logout()
    setToken(null)
    queryClient.clear()
  }

  useEffect(() => {
    if (token && me.isError) {
      signOut()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, me.isError])

  const login = useMutation({
    mutationFn: (draft: LoginDraft) => authService.login(draft),
    onSuccess: (user) => {
      setToken(getToken())
      queryClient.setQueryData(['me'], user)
    },
  })

  const register = useMutation({
    mutationFn: (draft: RegisterDraft) => authService.register(draft),
    onSuccess: (user) => {
      setToken(getToken())
      queryClient.setQueryData(['me'], user)
    },
  })

  const status: AuthStatus = !token ? 'unauthenticated' : me.isError ? 'unauthenticated' : me.data ? 'authenticated' : 'loading'

  return {
    user: token ? (me.data ?? null) : null,
    status,
    login: async (draft) => {
      await login.mutateAsync(draft)
    },
    register: async (draft) => {
      await register.mutateAsync(draft)
    },
    logout: signOut,
    error: errorMessage(login.error ?? register.error),
  }
}
