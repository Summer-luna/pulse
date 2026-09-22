import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUserColor } from './user-color.js';
import { User } from './user.entity.js';
import { UsersRepository } from './users.repository.js';

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
    return this.users.create({ ...profile, color: randomUserColor() });
  }
}
