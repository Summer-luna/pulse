import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InviteMembersInput } from './invite-members.input.js';
import { InvitedMember } from './invited-member.model.js';
import { generateTemporaryPassword } from './temporary-password.js';
import { randomUserColor } from './user-color.js';
import { UserRole } from './user-role.enum.js';
import { User } from './user.entity.js';
import { UsersRepository } from './users.repository.js';

const PASSWORD_HASH_ROUNDS = 10;

export interface NewUserProfile {
  name: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  list(): Promise<User[]> {
    return this.users.findAll();
  }

  findByIds(ids: string[]): Promise<User[]> {
    return this.users.findByIds(ids);
  }

  findById(id: string): Promise<User | null> {
    return this.users.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findByEmail(email);
  }

  findCredentialsByEmail(email: string): Promise<User | null> {
    return this.users.findByEmailWithPasswordHash(email);
  }

  async assertExists(id: string): Promise<void> {
    if (!(await this.users.findById(id))) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async register(profile: NewUserProfile): Promise<User> {
    if (await this.users.findByEmail(profile.email)) {
      throw new ConflictException('Email is already registered');
    }
    return this.users.create({ ...profile, color: randomUserColor(), role: UserRole.MEMBER });
  }

  async invite(input: InviteMembersInput, actingUser: User): Promise<InvitedMember[]> {
    this.assertAdmin(actingUser);
    const results: InvitedMember[] = [];
    for (const rawEmail of input.emails) {
      const email = rawEmail.trim().toLowerCase();
      if (await this.users.findByEmail(email)) {
        throw new ConflictException(`${email} is already a member`);
      }
      const temporaryPassword = generateTemporaryPassword();
      const passwordHash = await bcrypt.hash(temporaryPassword, PASSWORD_HASH_ROUNDS);
      const user = await this.users.create({
        name: email.split('@')[0],
        email,
        passwordHash,
        color: randomUserColor(),
        role: input.role ?? UserRole.MEMBER,
      });
      results.push({ user, temporaryPassword });
    }
    return results;
  }

  async remove(id: string, actingUser: User): Promise<User> {
    this.assertAdmin(actingUser);
    if (id === actingUser.id) {
      throw new BadRequestException('You cannot remove yourself');
    }
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    await this.users.remove(id);
    return user;
  }

  private assertAdmin(user: User): void {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can manage workspace members');
    }
  }
}
