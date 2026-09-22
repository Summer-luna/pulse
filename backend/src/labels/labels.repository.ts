import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './label.entity.js';

export interface IssueLabelRow {
  issueId: string;
  label: Label;
}

@Injectable()
export class LabelsRepository {
  constructor(@InjectRepository(Label) private readonly repo: Repository<Label>) {}

  findAll(): Promise<Label[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  countByIds(ids: string[]): Promise<number> {
    if (ids.length === 0) {
      return Promise.resolve(0);
    }
    return this.repo.createQueryBuilder('label').where('label.id IN (:...ids)', { ids }).getCount();
  }

  async labelsByIssueIds(issueIds: string[]): Promise<IssueLabelRow[]> {
    if (issueIds.length === 0) {
      return [];
    }
    const rows: { issue_id: string; id: string; name: string; color: string; created_at: string }[] = await this.repo.query(
      `SELECT il.issue_id, l.id, l.name, l.color, l.created_at
       FROM issue_labels il
       JOIN labels l ON l.id = il.label_id
       WHERE il.issue_id = ANY($1::uuid[])
       ORDER BY l.name ASC`,
      [issueIds],
    );
    return rows.map((row) => ({
      issueId: row.issue_id,
      label: { id: row.id, name: row.name, color: row.color, createdAt: row.created_at } as unknown as Label,
    }));
  }

  async setLabels(issueId: string, labelIds: string[]): Promise<void> {
    await this.repo.manager.transaction(async (manager) => {
      await manager.query(`DELETE FROM issue_labels WHERE issue_id = $1`, [issueId]);
      if (labelIds.length > 0) {
        const values = labelIds.map((_, index) => `($1, $${index + 2})`).join(', ');
        await manager.query(`INSERT INTO issue_labels (issue_id, label_id) VALUES ${values}`, [issueId, ...labelIds]);
      }
    });
  }
}
