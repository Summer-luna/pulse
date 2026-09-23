import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity.js';

export type NewUser = Pick<User, 'name' | 'email' | 'passwordHash' | 'color'> & Partial<Pick<User, 'role'>>;

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findAll(): Promise<User[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  findByIds(ids: string[]): Promise<User[]> {
    return this.repo.findBy({ id: In(ids) });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  findByEmailWithPasswordHash(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
      select: { id: true, name: true, email: true, color: true, role: true, createdAt: true, passwordHash: true },
    });
  }

  create(data: NewUser): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
