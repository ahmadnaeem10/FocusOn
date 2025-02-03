import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { defaultCategories } from './defaultCategories';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.create(createCategoryDto);
  }

  findAll() {
    return this.categoriesRepository.findAll();
  }

  findByUserId(id: number) {
    return this.categoriesRepository.findByUserId(id);
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesRepository.update(id, {
      ...updateCategoryDto,
      updatedAt: new Date(),
    });
  }

  remove(id: number) {
    return this.categoriesRepository.remove(id);
  }

  async createDefaultCategories(userId: number) {
    for (const category of defaultCategories) {
      await this.create({
        name: category,
        userId,
      });
    }
  }
}
