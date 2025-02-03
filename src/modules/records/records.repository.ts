import { DrizzleService } from '../drizzle/drizzle.service';
import { records } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecordsRepository {
  constructor(private readonly db: DrizzleService) {}

  create(createRecordDto: CreateRecordDto) {
    return this.db.conn
      .insert(records)
      .values({
        ...createRecordDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(records);
  }

  findByIssueId(id: number) {
    return this.db.conn.query.records.findMany({
      where: (records) => eq(records.issueId, id),
    });
  }

  findByUserId(id: number) {
    return this.db.conn.query.records.findMany({
      with: {
        issues: {
          with: {
            solutions: true,
          },
        },
      },
      where: (records) => eq(records.userId, id),
    });
  }

  findOne(id: number) {
    return this.db.conn.query.records.findFirst({
      where: (records) => eq(records.id, id),
    });
  }

  async update(id: number, updateRecordDto: UpdateRecordDto) {
    return (
      await this.db.conn
        .update(records)
        .set({ ...updateRecordDto, updatedAt: new Date() })
        .where(eq(records.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn.delete(records).where(eq(records.id, id)).execute();
  }

  // New method to fetch recordings by both userId and issueId
  findByUserIdAndIssueId(userId: number, issueId: number) {
    return this.db.conn.query.records.findMany({
      where: and(
        eq(records.userId, userId),
        eq(records.issueId, issueId),
      ),
    });
  }
}
