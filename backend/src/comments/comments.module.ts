import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity.js';
import { CommentsRepository } from './comments.repository.js';
import { CommentsResolver } from './comments.resolver.js';
import { CommentsService } from './comments.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentsRepository, CommentsResolver, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
