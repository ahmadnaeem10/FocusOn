import { DrizzleService } from '../drizzle/drizzle.service';
import { goals } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsRepository {
  constructor(private readonly db: DrizzleService) {}

  create(createGoalDto: CreateGoalDto) {
    return this.db.conn
      .insert(goals)
      .values({
        ...createGoalDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(goals);
  }

  findByUserId(id: number) {
    return this.db.conn.query.goals.findMany({
      where: (goals) => eq(goals.userId, id),
    });
  }

  findOne(id: number) {
    return this.db.conn.query.goals.findFirst({
      where: (goals) => eq(goals.id, id),
    });
  }

  async update(id: number, updateGoalDto: UpdateGoalDto) {
    return (
      await this.db.conn
        .update(goals)
        .set({ ...updateGoalDto, updatedAt: new Date() })
        .where(eq(goals.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn.delete(goals).where(eq(goals.id, id)).execute();
  }
}
