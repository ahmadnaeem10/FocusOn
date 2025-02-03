import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { IssuesRepository } from './issues.repository';
import { QuestionsModule } from '../questions/questions.module';
import { SolutionsModule } from '../solutions/solutions.module';

@Module({
  imports: [DrizzleModule, QuestionsModule, SolutionsModule],
  controllers: [IssuesController],
  providers: [IssuesService, IssuesRepository],
  exports: [IssuesService],
})
export class IssuesModule {}
