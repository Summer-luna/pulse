import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LabelsRepository } from './labels.repository.js';
import { LabelsService } from './labels.service.js';

describe('LabelsService', () => {
  const labels = { countByIds: vi.fn(), setLabels: vi.fn(), findAll: vi.fn() };
  let service: LabelsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LabelsService(labels as unknown as LabelsRepository);
  });

  describe('resolveLabelIds', () => {
    it('returns an empty list when nothing is passed', async () => {
      await expect(service.resolveLabelIds(undefined)).resolves.toEqual([]);
      await expect(service.resolveLabelIds([])).resolves.toEqual([]);
      expect(labels.countByIds).not.toHaveBeenCalled();
    });

    it('deduplicates ids before checking existence', async () => {
      labels.countByIds.mockResolvedValue(2);
      const result = await service.resolveLabelIds(['a', 'a', 'b']);
      expect(labels.countByIds).toHaveBeenCalledWith(['a', 'b']);
      expect(result).toEqual(['a', 'b']);
    });

    it('rejects when some ids do not exist', async () => {
      labels.countByIds.mockResolvedValue(1);
      await expect(service.resolveLabelIds(['a', 'b'])).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
