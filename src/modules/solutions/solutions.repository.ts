import { DrizzleService } from '../drizzle/drizzle.service';
import { solutions } from '../drizzle/schema';
import { and, eq, not } from 'drizzle-orm';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SolutionsRepository {
  constructor(private readonly db: DrizzleService) {}

  create(createSolutionDto: CreateSolutionDto) {
    return this.db.conn
      .insert(solutions)
      .values({
        ...createSolutionDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(solutions);
  }

  findByIssueId(id: number) {
    return this.db.conn.query.solutions.findMany({
      where: (solutions) =>
        and(eq(solutions.issueId, id), not(eq(solutions.result, 'NotWorking'))),
      orderBy: (solutions, { desc }) => [desc(solutions.createdAt)],
    });
  }

  findOne(id: number) {
    return this.db.conn.query.solutions.findFirst({
      where: (solutions) => eq(solutions.id, id),
    });
  }

  async update(id: number, updateSolutionDto: UpdateSolutionDto) {
    return (
      await this.db.conn
        .update(solutions)
        .set({ ...updateSolutionDto, updatedAt: new Date() })
        .where(eq(solutions.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn.delete(solutions).where(eq(solutions.id, id)).execute();
  }

  async createMany(createSolutionDto: CreateSolutionDto[]) {
    if (createSolutionDto.length > 0) {
      return this.db.conn
        .insert(solutions)
        .values(
          createSolutionDto.map((solution) => ({
            ...solution,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        )
        .returning();
    }
  }
}
