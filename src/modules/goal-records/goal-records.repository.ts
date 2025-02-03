import { DrizzleService } from '../drizzle/drizzle.service';
import { goalRecords } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { CreateGoalRecordDto } from './dto/create-goal-record.dto';
import { UpdateGoalRecordDto } from './dto/update-goal-record.dto';

@Injectable()
export class GoalRecordsRepository {
  constructor(private readonly db: DrizzleService) {}

  create(createGoalRecordDto: CreateGoalRecordDto) {
    return this.db.conn
      .insert(goalRecords)
      .values({
        ...createGoalRecordDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(goalRecords);
  }

  findByGoalId(id: number) {
    return this.db.conn.query.goalRecords.findMany({
      where: (goalRecords) => eq(goalRecords.goalId, id),
    });
  }

  findOne(id: number) {
    return this.db.conn.query.goalRecords.findFirst({
      where: (goalRecords) => eq(goalRecords.id, id),
    });
  }

  async update(id: number, updateGoalRecordDto: UpdateGoalRecordDto) {
    return (
      await this.db.conn
        .update(goalRecords)
        .set({ ...updateGoalRecordDto, updatedAt: new Date() })
        .where(eq(goalRecords.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn.delete(goalRecords).where(eq(goalRecords.id, id)).execute();
  }
}
