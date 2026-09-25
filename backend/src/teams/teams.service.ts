import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { CreateTeamInput } from './create-team.input.js';
import { Team } from './team.entity.js';
import { TeamMemberRow, TeamsRepository } from './teams.repository.js';
import { UpdateTeamInput } from './update-team.input.js';

@Injectable()
export class TeamsService {
  constructor(
    private readonly teams: TeamsRepository,
    private readonly users: UsersService,
  ) {}

  list(): Promise<Team[]> {
    return this.teams.findAll();
  }

  findByIds(ids: string[]): Promise<Team[]> {
    return this.teams.findByIds(ids);
  }

  membersByTeamIds(ids: string[]): Promise<TeamMemberRow[]> {
    return this.teams.membersByTeamIds(ids);
  }

  memberIds(teamId: string): Promise<string[]> {
    return this.teams.memberIds(teamId);
  }

  activeProjectCountsByTeamIds(ids: string[]): Promise<Map<string, number>> {
    return this.teams.activeProjectCountsByTeamIds(ids);
  }

  async get(id: string): Promise<Team> {
    const team = await this.teams.findById(id);
    if (!team) {
      throw new NotFoundException(`Team ${id} not found`);
    }
    return team;
  }

  async create(input: CreateTeamInput): Promise<Team> {
    const key = input.key.toUpperCase();
    if (await this.teams.findByKey(key)) {
      throw new ConflictException(`Team key ${key} is already in use`);
    }
    const { memberIds, ...patch } = input;
    const resolvedMemberIds = await this.resolveMemberIds(memberIds);
    const team = await this.teams.create({ ...patch, key });
    await this.teams.setMembers(team.id, resolvedMemberIds);
    return team;
  }

  async update(id: string, input: UpdateTeamInput): Promise<Team> {
    await this.get(id);
    const { memberIds, ...patch } = input;
    await this.teams.update(id, patch);
    if (memberIds) {
      await this.teams.setMembers(id, await this.resolveMemberIds(memberIds));
    }
    return this.get(id);
  }

  async remove(id: string): Promise<Team> {
    const team = await this.get(id);
    await this.teams.remove(id);
    return team;
  }

  async join(id: string, userId: string): Promise<Team> {
    await this.get(id);
    await this.teams.addMember(id, userId);
    return this.get(id);
  }

  async leave(id: string, userId: string): Promise<Team> {
    await this.get(id);
    await this.teams.removeMember(id, userId);
    return this.get(id);
  }

  private async resolveMemberIds(memberIds: string[] | undefined): Promise<string[]> {
    if (!memberIds || memberIds.length === 0) {
      return [];
    }
    const unique = [...new Set(memberIds)];
    const found = await this.users.findByIds(unique);
    if (found.length !== unique.length) {
      throw new BadRequestException('One or more members do not exist');
    }
    return unique;
  }
}
