import { Module } from '@nestjs/common';
import { GoalRecordsService } from './goal-records.service';
import { GoalRecordsController } from './goal-records.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { GoalRecordsRepository } from './goal-records.repository';

@Module({
  imports: [DrizzleModule],
  controllers: [GoalRecordsController],
  providers: [GoalRecordsService, GoalRecordsRepository],
  exports: [GoalRecordsService],
})
export class GoalRecordsModule {}
