import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { GoalsRepository } from './goals.repository';

@Module({
  imports: [DrizzleModule],
  controllers: [GoalsController],
  providers: [GoalsService, GoalsRepository],
  exports: [GoalsService],
})
export class GoalsModule {}
