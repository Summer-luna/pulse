import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';
import { CommentsModule } from './comments/comments.module.js';
import { CommonModule } from './common/common.module.js';
import { CustomersModule } from './customers/customers.module.js';
import type { GraphQLContext } from './common/loaders/loaders.js';
import { LoadersModule } from './common/loaders/loaders.module.js';
import { LoadersService } from './common/loaders/loaders.service.js';
import { buildDataSourceOptions } from './database/data-source-options.js';
import { IssuesModule } from './issues/issues.module.js';
import { LabelsModule } from './labels/labels.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ReleasePipelinesModule } from './release-pipelines/release-pipelines.module.js';
import { ReleasesModule } from './releases/releases.module.js';
import { RequestsModule } from './requests/requests.module.js';
import { UploadsModule } from './uploads/uploads.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...buildDataSourceOptions(config.getOrThrow<string>('DATABASE_URL')),
        migrationsRun: true,
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [LoadersModule],
      inject: [LoadersService],
      useFactory: (loaders: LoadersService) => ({
        autoSchemaFile: true,
        sortSchema: true,
        graphiql: true,
        context: ({ req }: { req: GraphQLContext['req'] }): GraphQLContext => ({ req, loaders: loaders.create() }),
      }),
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    ReleasePipelinesModule,
    ReleasesModule,
    IssuesModule,
    LabelsModule,
    UploadsModule,
    CommentsModule,
    RequestsModule,
    CustomersModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
