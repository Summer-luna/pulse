import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '../users/user.entity.js';
import type { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

function user(overrides: Partial<User> = {}): User {
  return {
    id: 'u1',
    name: 'Ada',
    email: 'ada@example.com',
    color: '#000',
    passwordHash: 'hash',
    createdAt: new Date(),
    ...overrides,
  } as User;
}

describe('AuthService', () => {
  const users = { register: vi.fn(), findCredentialsByEmail: vi.fn() };
  const jwt = { sign: vi.fn(() => 'signed-token') };
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService(users as unknown as UsersService, jwt as unknown as JwtService);
  });

  describe('register', () => {
    it('hashes the password and issues a token for the new user', async () => {
      const created = user();
      users.register.mockResolvedValue(created);

      const result = await service.register({ name: '  Ada  ', email: ' ADA@Example.com ', password: 'longenough' });

      expect(users.register).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Ada', email: 'ada@example.com' }),
      );
      const passedHash = users.register.mock.calls[0][0].passwordHash;
      await expect(bcrypt.compare('longenough', passedHash)).resolves.toBe(true);
      expect(result).toEqual({ token: 'signed-token', user: created });
      expect(jwt.sign).toHaveBeenCalledWith({ sub: created.id });
    });
  });

  describe('login', () => {
    it('issues a token when the password matches', async () => {
      const hash = await bcrypt.hash('correct-password', 4);
      users.findCredentialsByEmail.mockResolvedValue(user({ passwordHash: hash }));

      const result = await service.login({ email: 'ADA@example.com', password: 'correct-password' });

      expect(users.findCredentialsByEmail).toHaveBeenCalledWith('ada@example.com');
      expect(result.token).toBe('signed-token');
    });

    it('rejects an unknown email', async () => {
      users.findCredentialsByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'nobody@example.com', password: 'x' })).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects a wrong password', async () => {
      const hash = await bcrypt.hash('correct-password', 4);
      users.findCredentialsByEmail.mockResolvedValue(user({ passwordHash: hash }));
      await expect(service.login({ email: 'ada@example.com', password: 'wrong' })).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
