import { Injectable } from '@nestjs/common';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { SolutionsRepository } from './solutions.repository';

@Injectable()
export class SolutionsService {
  constructor(private readonly solutionsRepository: SolutionsRepository) {}
  create(createSolutionDto: CreateSolutionDto) {
    return this.solutionsRepository.create(createSolutionDto);
  }

  findAll() {
    return this.solutionsRepository.findAll();
  }

  findByIssueId(id: number) {
    return this.solutionsRepository.findByIssueId(id);
  }

  findOne(id: number) {
    return this.solutionsRepository.findOne(id);
  }

  update(id: number, updateSolutionDto: UpdateSolutionDto) {
    return this.solutionsRepository.update(id, {
      ...updateSolutionDto,
      updatedAt: new Date(),
    });
  }

  remove(id: number) {
    return this.solutionsRepository.remove(id);
  }

  createMany(createSolutionDto: CreateSolutionDto[]) {
    return this.solutionsRepository.createMany(createSolutionDto);
  }
}
