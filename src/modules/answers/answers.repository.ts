import { DrizzleService } from '../drizzle/drizzle.service';
import { answers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswersRepository {
  constructor(private readonly db: DrizzleService) {}

  create(createAnswerDto: CreateAnswerDto) {
    return this.db.conn
      .insert(answers)
      .values({
        ...createAnswerDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(answers);
  }

  findByQuestionId(id: number) {
    return this.db.conn.query.answers.findMany({
      where: (answers) => eq(answers.questionId, id),
    });
  }

  findByIssueId(id: number) {
    return this.db.conn.query.answers.findMany({
      where: (answers) => eq(answers.issueId, id),
    });
  }

  findOne(id: number) {
    return this.db.conn.query.answers.findFirst({
      where: (answers) => eq(answers.id, id),
    });
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return (
      await this.db.conn
        .update(answers)
        .set({ ...updateAnswerDto, updatedAt: new Date() })
        .where(eq(answers.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn.delete(answers).where(eq(answers.id, id)).execute();
  }
}
