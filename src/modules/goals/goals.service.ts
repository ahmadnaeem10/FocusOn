import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsRepository } from './goals.repository';

@Injectable()
export class GoalsService {
  constructor(private readonly goalsRepository: GoalsRepository) {}
  create(createGoalDto: CreateGoalDto) {
    return this.goalsRepository.create(createGoalDto);
  }

  findAll() {
    return this.goalsRepository.findAll();
  }

  findByUserId(id: number) {
    return this.goalsRepository.findByUserId(id);
  }

  findOne(id: number) {
    return this.goalsRepository.findOne(id);
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    return this.goalsRepository.update(id, updateGoalDto);
  }

  remove(id: number) {
    return this.goalsRepository.remove(id);
  }
}
