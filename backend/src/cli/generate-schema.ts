import { writeFileSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { AuthResolver } from '../auth/auth.resolver.js';
import { CommentsResolver } from '../comments/comments.resolver.js';
import { DateScalar } from '../common/date.scalar.js';
import { IssuesResolver } from '../issues/issues.resolver.js';
import { LabelsResolver } from '../labels/labels.resolver.js';
import { ProjectsResolver } from '../projects/projects.resolver.js';
import { ReleasePipelinesResolver } from '../release-pipelines/release-pipelines.resolver.js';
import { ReleasesResolver } from '../releases/releases.resolver.js';
import { UsersResolver } from '../users/users.resolver.js';

const OUTPUT = 'schema.graphql';

const app = await NestFactory.create(GraphQLSchemaBuilderModule, { logger: false });
await app.init();

const schema = await app
  .get(GraphQLSchemaFactory)
  .create(
    [
      AuthResolver,
      UsersResolver,
      ProjectsResolver,
      ReleasesResolver,
      ReleasePipelinesResolver,
      IssuesResolver,
      LabelsResolver,
      CommentsResolver,
    ],
    [DateScalar],
  );

writeFileSync(OUTPUT, `${printSchema(lexicographicSortSchema(schema))}\n`);
console.log(`Wrote ${OUTPUT}`);
await app.close();
