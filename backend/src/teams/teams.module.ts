import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module.js';
import { Team } from './team.entity.js';
import { TeamsRepository } from './teams.repository.js';
import { TeamsResolver } from './teams.resolver.js';
import { TeamsService } from './teams.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), UsersModule],
  providers: [TeamsRepository, TeamsResolver, TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
