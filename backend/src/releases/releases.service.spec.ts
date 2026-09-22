import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProjectsService } from '../projects/projects.service.js';
import type { Release } from './release.entity.js';
import { ReleaseStatus } from './release-status.enum.js';
import type { ReleasesRepository } from './releases.repository.js';
import { ReleasesService } from './releases.service.js';

describe('ReleasesService', () => {
  const repo = {
    findById: vi.fn(),
    create: vi.fn(async (data: Partial<Release>) => ({ id: 'r', ...data }) as Release),
    update: vi.fn(),
  };
  const projects = { get: vi.fn() };
  let service: ReleasesService;

  beforeEach(() => {
    vi.clearAllMocks();
    repo.findById.mockResolvedValue({ id: 'r' });
    service = new ReleasesService(repo as unknown as ReleasesRepository, projects as unknown as ProjectsService);
  });

  it('stamps releasedAt when completed', async () => {
    await service.update('r', { status: ReleaseStatus.COMPLETED });
    expect(repo.update.mock.calls[0][1].releasedAt).toBeInstanceOf(Date);
  });

  it('clears releasedAt when moved out of completed', async () => {
    await service.update('r', { status: ReleaseStatus.IN_PROGRESS });
    expect(repo.update.mock.calls[0][1].releasedAt).toBeNull();
  });

  it('does not touch releasedAt for unrelated edits', async () => {
    await service.update('r', { name: 'Renamed' });
    expect(repo.update.mock.calls[0][1]).not.toHaveProperty('releasedAt');
  });

  it('requires the project to exist on create', async () => {
    projects.get.mockRejectedValue(new Error('missing'));
    await expect(service.create({ projectId: 'nope', name: 'v1' })).rejects.toThrow('missing');
    expect(repo.create).not.toHaveBeenCalled();
  });
});
