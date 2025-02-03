import { DrizzleService } from '../drizzle/drizzle.service';
import { questions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionsRepository {
  constructor(private readonly db: DrizzleService) {}

  create(createQuestionDto: CreateQuestionDto) {
    return this.db.conn
      .insert(questions)
      .values({
        ...createQuestionDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(questions);
  }

  findByCategoryId(id: number) {
    return this.db.conn.query.questions.findMany({
      where: (questions) => eq(questions.categoryId, id),
    });
  }

  findOne(id: number) {
    return this.db.conn.query.questions.findFirst({
      where: (questions) => eq(questions.id, id),
    });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return (
      await this.db.conn
        .update(questions)
        .set({ ...updateQuestionDto, updatedAt: new Date() })
        .where(eq(questions.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn.delete(questions).where(eq(questions.id, id)).execute();
  }
}
