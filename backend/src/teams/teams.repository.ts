import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { Team } from './team.entity.js';

export type TeamPatch = Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt'>>;

export interface TeamMemberRow {
  teamId: string;
  user: User;
}

const MEMBER_COLUMNS = ['id', 'name', 'email', 'color', 'role', 'created_at'] as const;
const ACTIVE_PROJECT_STATUSES = ['BACKLOG', 'PLANNED', 'IN_PROGRESS'];

@Injectable()
export class TeamsRepository {
  constructor(@InjectRepository(Team) private readonly repo: Repository<Team>) {}

  findAll(): Promise<Team[]> {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  findById(id: string): Promise<Team | null> {
    return this.repo.findOneBy({ id });
  }

  findByIds(ids: string[]): Promise<Team[]> {
    return this.repo.findBy({ id: In(ids) });
  }

  findByKey(key: string): Promise<Team | null> {
    return this.repo.findOneBy({ key });
  }

  create(data: TeamPatch & Pick<Team, 'name' | 'key'>): Promise<Team> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, patch: TeamPatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async memberIds(teamId: string): Promise<string[]> {
    const rows: { user_id: string }[] = await this.repo.query(`SELECT user_id FROM team_members WHERE team_id = $1`, [teamId]);
    return rows.map((row) => row.user_id);
  }

  async membersByTeamIds(teamIds: string[]): Promise<TeamMemberRow[]> {
    if (teamIds.length === 0) {
      return [];
    }
    const rows: ({ team_id: string } & Record<(typeof MEMBER_COLUMNS)[number], string>)[] = await this.repo.query(
      `SELECT tm.team_id, ${MEMBER_COLUMNS.map((column) => `u.${column}`).join(', ')}
       FROM team_members tm
       JOIN users u ON u.id = tm.user_id
       WHERE tm.team_id = ANY($1::uuid[])`,
      [teamIds],
    );
    return rows.map((row) => ({
      teamId: row.team_id,
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        color: row.color,
        role: row.role,
        createdAt: row.created_at,
      } as unknown as User,
    }));
  }

  async setMembers(teamId: string, userIds: string[]): Promise<void> {
    await this.repo.manager.transaction(async (manager) => {
      await manager.query(`DELETE FROM team_members WHERE team_id = $1`, [teamId]);
      if (userIds.length > 0) {
        const values = userIds.map((_, index) => `($1, $${index + 2})`).join(', ');
        await manager.query(`INSERT INTO team_members (team_id, user_id) VALUES ${values}`, [teamId, ...userIds]);
      }
    });
  }

  async addMember(teamId: string, userId: string): Promise<void> {
    await this.repo.query(`INSERT INTO team_members (team_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [teamId, userId]);
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    await this.repo.query(`DELETE FROM team_members WHERE team_id = $1 AND user_id = $2`, [teamId, userId]);
  }

  async activeProjectCountsByTeamIds(teamIds: string[]): Promise<Map<string, number>> {
    if (teamIds.length === 0) {
      return new Map();
    }
    const rows: { team_id: string; count: string }[] = await this.repo.query(
      `SELECT team_id, COUNT(*) AS count
       FROM projects
       WHERE team_id = ANY($1::uuid[]) AND status = ANY($2::project_status[])
       GROUP BY team_id`,
      [teamIds, ACTIVE_PROJECT_STATUSES],
    );
    return new Map(rows.map((row) => [row.team_id, Number(row.count)]));
  }
}
