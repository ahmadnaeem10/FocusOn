import { DrizzleService } from '../drizzle/drizzle.service';
import { issues, solutions } from '../drizzle/schema';
import { and, eq, exists, not, or, sql } from 'drizzle-orm';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IssuesRepository {
  constructor(private readonly db: DrizzleService) {}

  create(createIssueDto: CreateIssueDto) {
    return this.db.conn
      .insert(issues)
      .values({
        ...createIssueDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(issues);
  }

  async findByUserId(id: number) {
    const subQuery = this.getWorkingSolutionsSubQuery();

    return this.db.conn
      .select()
      .from(issues)
      .where(
        and(
          eq(issues.userId, id),
          or(
            exists(subQuery),
            not(
              exists(
                this.db.conn
                  .select()
                  .from(solutions)
                  .where(eq(solutions.issueId, issues.id)),
              ),
            ),
          ),
        ),
      );
  }

  findByUserIdWithSolutionDescription(id: number) {
    return this.db.conn
      .select()
      .from(issues)
      .innerJoin(solutions, eq(issues.id, solutions.issueId))
      .where(eq(issues.userId, id));
  }

  findByUserIdAndCategory(id: number, userId: number) {
    const subQuery = this.getWorkingSolutionsSubQuery();
    return this.db.conn.query.issues.findMany({
      where: (issues) =>
        and(
          eq(issues.userId, userId),
          eq(issues.categoryId, id),
          or(
            exists(subQuery),
            not(
              exists(
                this.db.conn
                  .select()
                  .from(solutions)
                  .where(eq(solutions.issueId, issues.id)),
              ),
            ),
          ),
        ),
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    });
  }

  findByUserIdAndPiece(id: number, userId: number) {
    const subQuery = this.getWorkingSolutionsSubQuery();
    return this.db.conn.query.issues.findMany({
      where: (issues) =>
        and(
          eq(issues.userId, userId),
          eq(issues.pieceId, id),
          or(
            exists(subQuery),
            not(
              exists(
                this.db.conn
                  .select()
                  .from(solutions)
                  .where(eq(solutions.issueId, issues.id)),
              ),
            ),
          ),
        ),
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    });
  }

  findOne(id: number) {
    return this.db.conn.query.issues.findFirst({
      where: (issues) => eq(issues.id, id),
    });
  }

  async update(id: number, updateIssueDto: UpdateIssueDto) {
    return (
      await this.db.conn
        .update(issues)
        .set({ ...updateIssueDto, updatedAt: new Date() })
        .where(eq(issues.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn.delete(issues).where(eq(issues.id, id)).execute();
  }

  private getWorkingSolutionsSubQuery() {
    return this.db.conn
      .select()
      .from(solutions)
      .where(
        and(
          eq(solutions.issueId, sql`${issues.id}`),
          eq(solutions.result, 'Working'),
        ),
      );
  }
}
