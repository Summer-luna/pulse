import { BadRequestException, Injectable } from '@nestjs/common';
import { IssueLabelRow, LabelsRepository } from './labels.repository.js';
import { Label } from './label.entity.js';

@Injectable()
export class LabelsService {
  constructor(private readonly labels: LabelsRepository) {}

  list(): Promise<Label[]> {
    return this.labels.findAll();
  }

  labelsByIssueIds(issueIds: string[]): Promise<IssueLabelRow[]> {
    return this.labels.labelsByIssueIds(issueIds);
  }

  async setIssueLabels(issueId: string, labelIds: string[]): Promise<void> {
    await this.labels.setLabels(issueId, labelIds);
  }

  async resolveLabelIds(labelIds: string[] | undefined): Promise<string[]> {
    if (!labelIds || labelIds.length === 0) {
      return [];
    }
    const unique = [...new Set(labelIds)];
    const count = await this.labels.countByIds(unique);
    if (count !== unique.length) {
      throw new BadRequestException('One or more labels do not exist');
    }
    return unique;
  }
}
