import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { Project } from './project.entity.js';

export type ProjectPatch = Partial<Omit<Project, 'id' | 'issueCounter' | 'createdAt' | 'updatedAt'>>;

export interface ProjectMemberRow {
  projectId: string;
  user: User;
}

const MEMBER_COLUMNS = ['id', 'name', 'email', 'color', 'created_at'] as const;

@Injectable()
export class ProjectsRepository {
  constructor(@InjectRepository(Project) private readonly repo: Repository<Project>) {}

  findAll(): Promise<Project[]> {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  findById(id: string): Promise<Project | null> {
    return this.repo.findOneBy({ id });
  }

  findByIds(ids: string[]): Promise<Project[]> {
    return this.repo.findBy({ id: In(ids) });
  }

  findByKey(key: string): Promise<Project | null> {
    return this.repo.findOneBy({ key });
  }

  create(data: ProjectPatch & Pick<Project, 'name' | 'key'>): Promise<Project> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, patch: ProjectPatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async allocateIssueNumber(id: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder()
      .update(Project)
      .set({ issueCounter: () => 'issue_counter + 1' })
      .where('id = :id', { id })
      .returning('issue_counter')
      .execute();
    return Number(result.raw[0].issue_counter);
  }

  async memberIds(projectId: string): Promise<string[]> {
    const rows: { user_id: string }[] = await this.repo.query(`SELECT user_id FROM project_members WHERE project_id = $1`, [
      projectId,
    ]);
    return rows.map((row) => row.user_id);
  }

  async membersByProjectIds(projectIds: string[]): Promise<ProjectMemberRow[]> {
    if (projectIds.length === 0) {
      return [];
    }
    const rows: ({ project_id: string } & Record<(typeof MEMBER_COLUMNS)[number], string>)[] = await this.repo.query(
      `SELECT pm.project_id, ${MEMBER_COLUMNS.map((column) => `u.${column}`).join(', ')}
       FROM project_members pm
       JOIN users u ON u.id = pm.user_id
       WHERE pm.project_id = ANY($1::uuid[])`,
      [projectIds],
    );
    return rows.map((row) => ({
      projectId: row.project_id,
      user: { id: row.id, name: row.name, email: row.email, color: row.color, createdAt: row.created_at } as unknown as User,
    }));
  }

  async setMembers(projectId: string, userIds: string[]): Promise<void> {
    await this.repo.manager.transaction(async (manager) => {
      await manager.query(`DELETE FROM project_members WHERE project_id = $1`, [projectId]);
      if (userIds.length > 0) {
        const values = userIds.map((_, index) => `($1, $${index + 2})`).join(', ');
        await manager.query(`INSERT INTO project_members (project_id, user_id) VALUES ${values}`, [projectId, ...userIds]);
      }
    });
  }
}
