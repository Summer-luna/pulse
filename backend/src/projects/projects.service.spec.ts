import { BadRequestException, ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '../users/user.entity.js';
import type { UsersService } from '../users/users.service.js';
import type { Project } from './project.entity.js';
import type { ProjectsRepository } from './projects.repository.js';
import { ProjectsService } from './projects.service.js';

function project(overrides: Partial<Project> = {}): Project {
  return { id: 'p1', key: 'WEB', name: 'Web App', ...overrides } as Project;
}

describe('ProjectsService', () => {
  const projects = {
    findByKey: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    setMembers: vi.fn(),
  };
  const users = { assertExists: vi.fn(), findByIds: vi.fn() };
  let service: ProjectsService;

  beforeEach(() => {
    vi.clearAllMocks();
    projects.findByKey.mockResolvedValue(null);
    projects.create.mockResolvedValue(project());
    projects.findById.mockResolvedValue(project());
    service = new ProjectsService(projects as unknown as ProjectsRepository, users as unknown as UsersService);
  });

  describe('create', () => {
    it('rejects a duplicate key', async () => {
      projects.findByKey.mockResolvedValue(project());
      await expect(service.create({ name: 'X', key: 'WEB' })).rejects.toBeInstanceOf(ConflictException);
      expect(projects.create).not.toHaveBeenCalled();
    });

    it('rejects member ids that do not exist', async () => {
      users.findByIds.mockResolvedValue([{ id: 'u1' } as User]);
      await expect(service.create({ name: 'X', key: 'NEW', memberIds: ['u1', 'u2'] })).rejects.toBeInstanceOf(BadRequestException);
      expect(projects.create).not.toHaveBeenCalled();
    });

    it('deduplicates member ids and sets them after creating the project', async () => {
      users.findByIds.mockResolvedValue([{ id: 'u1' } as User]);
      await service.create({ name: 'X', key: 'NEW', memberIds: ['u1', 'u1'] });
      expect(users.findByIds).toHaveBeenCalledWith(['u1']);
      expect(projects.setMembers).toHaveBeenCalledWith('p1', ['u1']);
    });

    it('uppercases the key', async () => {
      await service.create({ name: 'X', key: 'new' });
      expect(projects.create).toHaveBeenCalledWith(expect.objectContaining({ key: 'NEW' }));
    });
  });

  describe('update', () => {
    it('leaves members untouched when memberIds is not provided', async () => {
      await service.update('p1', { name: 'Renamed' });
      expect(projects.setMembers).not.toHaveBeenCalled();
    });

    it('replaces members when memberIds is provided, including an empty list', async () => {
      users.findByIds.mockResolvedValue([]);
      await service.update('p1', { memberIds: [] });
      expect(projects.setMembers).toHaveBeenCalledWith('p1', []);
    });
  });
});
