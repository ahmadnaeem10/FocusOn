import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { QuestionsRepository } from './questions.repository';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [DrizzleModule, AnswersModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsRepository],
  exports: [QuestionsService],
})
export class QuestionsModule {}
