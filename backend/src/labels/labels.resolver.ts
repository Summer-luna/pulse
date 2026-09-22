import { Query, Resolver } from '@nestjs/graphql';
import { Label } from './label.entity.js';
import { LabelsService } from './labels.service.js';

@Resolver(() => Label)
export class LabelsResolver {
  constructor(private readonly labels: LabelsService) {}

  @Query(() => [Label], { name: 'labels' })
  list(): Promise<Label[]> {
    return this.labels.list();
  }
}
