import { Module } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { SolutionsController } from './solutions.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { SolutionsRepository } from './solutions.repository';

@Module({
  imports: [DrizzleModule],
  controllers: [SolutionsController],
  providers: [SolutionsService, SolutionsRepository],
  exports: [SolutionsService],
})
export class SolutionsModule {}
