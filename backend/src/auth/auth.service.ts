import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthPayload } from './auth-payload.model.js';
import { LoginInput } from './login.input.js';
import { RegisterInput } from './register.input.js';

const PASSWORD_HASH_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthPayload> {
    const passwordHash = await bcrypt.hash(input.password, PASSWORD_HASH_ROUNDS);
    const user = await this.users.register({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash,
    });
    return this.issueToken(user);
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const email = input.email.trim().toLowerCase();
    const user = await this.users.findCredentialsByEmail(email);
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.issueToken(user);
  }

  private issueToken(user: User): AuthPayload {
    return { token: this.jwt.sign({ sub: user.id }), user };
  }
}
