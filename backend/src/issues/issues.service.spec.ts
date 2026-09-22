import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LabelsService } from '../labels/labels.service.js';
import type { ProjectsService } from '../projects/projects.service.js';
import type { ReleasesService } from '../releases/releases.service.js';
import type { UsersService } from '../users/users.service.js';
import { IssueStatus } from './issue-status.enum.js';
import type { Issue } from './issue.entity.js';
import type { IssuesRepository } from './issues.repository.js';
import { IssuesService } from './issues.service.js';

function issue(overrides: Partial<Issue>): Issue {
  return { id: 'issue', projectId: 'p1', number: 1, status: IssueStatus.TODO, parentId: null, ...overrides } as Issue;
}

describe('IssuesService', () => {
  let store: Map<string, Issue>;
  let issues: { [K in keyof IssuesRepository]: ReturnType<typeof vi.fn> };
  let projects: { get: ReturnType<typeof vi.fn>; getByKey: ReturnType<typeof vi.fn>; allocateIssueNumber: ReturnType<typeof vi.fn> };
  let releases: { get: ReturnType<typeof vi.fn> };
  let users: { assertExists: ReturnType<typeof vi.fn> };
  let labels: { resolveLabelIds: ReturnType<typeof vi.fn>; setIssueLabels: ReturnType<typeof vi.fn> };
  let service: IssuesService;

  beforeEach(() => {
    store = new Map();
    issues = {
      findById: vi.fn(async (id: string) => store.get(id) ?? null),
      findByProjectAndNumber: vi.fn(),
      findAncestorIds: vi.fn(),
      create: vi.fn(async (data: Partial<Issue>) => ({ id: 'new', ...data }) as Issue),
      update: vi.fn(),
    } as unknown as typeof issues;
    projects = {
      get: vi.fn(async () => ({ id: 'p1' })),
      getByKey: vi.fn(async () => ({ id: 'p1' })),
      allocateIssueNumber: vi.fn(async () => 7),
    };
    releases = { get: vi.fn() };
    users = { assertExists: vi.fn() };
    labels = { resolveLabelIds: vi.fn(async (ids?: string[]) => ids ?? []), setIssueLabels: vi.fn() };
    service = new IssuesService(
      issues as unknown as IssuesRepository,
      projects as unknown as ProjectsService,
      releases as unknown as ReleasesService,
      users as unknown as UsersService,
      labels as unknown as LabelsService,
    );
  });

  describe('getByIdentifier', () => {
    it('resolves KEY-number through the project key', async () => {
      const found = issue({ id: 'found', number: 12 });
      issues.findByProjectAndNumber.mockResolvedValue(found);

      await expect(service.getByIdentifier('web-12')).resolves.toBe(found);
      expect(projects.getByKey).toHaveBeenCalledWith('web');
      expect(issues.findByProjectAndNumber).toHaveBeenCalledWith('p1', 12);
    });

    it('rejects malformed identifiers', async () => {
      await expect(service.getByIdentifier('nope')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('reports a missing issue', async () => {
      issues.findByProjectAndNumber.mockResolvedValue(null);
      await expect(service.getByIdentifier('WEB-99')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('allocates the next issue number from the project', async () => {
      await service.create({ projectId: 'p1', title: 'Hello' });
      expect(issues.create).toHaveBeenCalledWith(expect.objectContaining({ projectId: 'p1', number: 7, title: 'Hello' }));
    });

    it('stamps completedAt when created as done', async () => {
      await service.create({ projectId: 'p1', title: 'Done already', status: IssueStatus.DONE });
      expect(issues.create.mock.calls[0][0].completedAt).toBeInstanceOf(Date);
    });

    it('rejects a parent from another project', async () => {
      store.set('parent', issue({ id: 'parent', projectId: 'other' }));
      await expect(service.create({ projectId: 'p1', title: 'Sub', parentId: 'parent' })).rejects.toBeInstanceOf(BadRequestException);
      expect(issues.create).not.toHaveBeenCalled();
    });

    it('rejects a release from another project', async () => {
      releases.get.mockResolvedValue({ id: 'r1', projectId: 'other' });
      await expect(service.create({ projectId: 'p1', title: 'X', releaseId: 'r1' })).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('update', () => {
    it('refuses to move an issue under its own descendant', async () => {
      store.set('a', issue({ id: 'a' }));
      store.set('b', issue({ id: 'b', parentId: 'a' }));
      issues.findAncestorIds.mockResolvedValue(['b', 'a']);

      await expect(service.update('a', { parentId: 'b' })).rejects.toBeInstanceOf(BadRequestException);
      expect(issues.update).not.toHaveBeenCalled();
    });

    it('allows re-parenting to an unrelated issue', async () => {
      store.set('a', issue({ id: 'a' }));
      store.set('c', issue({ id: 'c' }));
      issues.findAncestorIds.mockResolvedValue(['c']);

      await service.update('a', { parentId: 'c' });
      expect(issues.update).toHaveBeenCalledWith('a', expect.objectContaining({ parentId: 'c' }));
    });

    it('sets completedAt on the way to done and clears it when reopened', async () => {
      store.set('a', issue({ id: 'a', status: IssueStatus.IN_PROGRESS }));
      await service.update('a', { status: IssueStatus.DONE });
      expect(issues.update.mock.calls[0][1].completedAt).toBeInstanceOf(Date);

      store.set('a', issue({ id: 'a', status: IssueStatus.DONE }));
      await service.update('a', { status: IssueStatus.TODO });
      expect(issues.update.mock.calls[1][1].completedAt).toBeNull();
    });

    it('keeps completedAt untouched when the status does not change', async () => {
      store.set('a', issue({ id: 'a', status: IssueStatus.DONE }));
      await service.update('a', { status: IssueStatus.DONE, title: 'Renamed' });
      expect(issues.update.mock.calls[0][1]).not.toHaveProperty('completedAt');
    });

    it('lets callers clear the release with null', async () => {
      store.set('a', issue({ id: 'a' }));
      await service.update('a', { releaseId: null });
      expect(releases.get).not.toHaveBeenCalled();
      expect(issues.update).toHaveBeenCalledWith('a', expect.objectContaining({ releaseId: null }));
    });
  });
});
