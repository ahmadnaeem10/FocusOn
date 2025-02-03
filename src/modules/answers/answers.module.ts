import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AnswersRepository } from './answers.repository';

@Module({
  imports: [DrizzleModule],
  controllers: [AnswersController],
  providers: [AnswersService, AnswersRepository],
  exports: [AnswersService],
})
export class AnswersModule {}
