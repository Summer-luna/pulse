import { beforeEach, describe, expect, it, vi } from 'vitest'

const { login, register } = vi.hoisted(() => ({ login: vi.fn(), register: vi.fn() }))
vi.mock('@/repositories/auth-repository', () => ({ authRepository: { login, register, me: vi.fn() } }))
vi.mock('@/lib/auth-token', () => ({ setToken: vi.fn() }))

const { authService } = await import('./auth-service')
const { setToken } = await import('@/lib/auth-token')

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('trims and lowercases the email before calling the repository', async () => {
      login.mockResolvedValue({ token: 't', user: { id: '1' } })
      await authService.login({ email: '  ADA@Example.com  ', password: 'secret123' })
      expect(login).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'secret123' })
      expect(setToken).toHaveBeenCalledWith('t')
    })

    it('rejects an empty email without calling the repository', async () => {
      await expect(authService.login({ email: '  ', password: 'secret123' })).rejects.toThrow('Email is required')
      expect(login).not.toHaveBeenCalled()
    })

    it('rejects an empty password without calling the repository', async () => {
      await expect(authService.login({ email: 'ada@example.com', password: '' })).rejects.toThrow('Password is required')
      expect(login).not.toHaveBeenCalled()
    })
  })

  describe('register', () => {
    it('rejects a short password without calling the repository', async () => {
      await expect(
        authService.register({ name: 'Ada', email: 'ada@example.com', password: 'short' }),
      ).rejects.toThrow('at least 8 characters')
      expect(register).not.toHaveBeenCalled()
    })

    it('trims the name and stores the returned token', async () => {
      register.mockResolvedValue({ token: 't2', user: { id: '2' } })
      await authService.register({ name: '  Ada  ', email: 'ada@example.com', password: 'longenough' })
      expect(register).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@example.com', password: 'longenough' })
      expect(setToken).toHaveBeenCalledWith('t2')
    })
  })
})
