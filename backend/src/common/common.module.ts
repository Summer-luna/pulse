import { Module } from '@nestjs/common';
import { DateScalar } from './date.scalar.js';

@Module({
  providers: [DateScalar],
})
export class CommonModule {}
