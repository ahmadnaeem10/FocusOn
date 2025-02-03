import { DrizzleService } from '../drizzle/drizzle.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly db: DrizzleService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.db.conn
      .insert(categories)
      .values({
        ...createCategoryDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(categories);
  }

  findByUserId(id: number) {
    return this.db.conn.query.categories.findMany({
      where: (categories) => eq(categories.userId, id),
    });
  }

  findOne(id: number) {
    return this.db.conn.query.categories.findFirst({
      where: (categories) => eq(categories.id, id),
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return (
      await this.db.conn
        .update(categories)
        .set({ ...updateCategoryDto, updatedAt: new Date() })
        .where(eq(categories.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn
      .delete(categories)
      .where(eq(categories.id, id))
      .execute();
  }
}
