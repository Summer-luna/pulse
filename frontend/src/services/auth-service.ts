import type { User } from '@/domain/types'
import type { LoginInput, RegisterInput } from '@/graphql/generated/graphql'
import { setToken } from '@/lib/auth-token'
import { authRepository } from '@/repositories/auth-repository'

export interface LoginDraft {
  email: string
  password: string
}

export interface RegisterDraft {
  name: string
  email: string
  password: string
}

const MIN_PASSWORD_LENGTH = 8

class AuthService {
  emptyLoginDraft(): LoginDraft {
    return { email: '', password: '' }
  }

  emptyRegisterDraft(): RegisterDraft {
    return { name: '', email: '', password: '' }
  }

  async login(draft: LoginDraft): Promise<User> {
    const payload = await authRepository.login(this.toLoginInput(draft))
    setToken(payload.token)
    return payload.user
  }

  async register(draft: RegisterDraft): Promise<User> {
    const payload = await authRepository.register(this.toRegisterInput(draft))
    setToken(payload.token)
    return payload.user
  }

  me(): Promise<User> {
    return authRepository.me()
  }

  logout(): void {
    setToken(null)
  }

  private toLoginInput(draft: LoginDraft): LoginInput {
    const email = draft.email.trim().toLowerCase()
    if (!email) {
      throw new Error('Email is required')
    }
    if (!draft.password) {
      throw new Error('Password is required')
    }
    return { email, password: draft.password }
  }

  private toRegisterInput(draft: RegisterDraft): RegisterInput {
    const name = draft.name.trim()
    const email = draft.email.trim().toLowerCase()
    if (!name) {
      throw new Error('Name is required')
    }
    if (!email) {
      throw new Error('Email is required')
    }
    if (draft.password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    }
    return { name, email, password: draft.password }
  }
}

export const authService = new AuthService()
