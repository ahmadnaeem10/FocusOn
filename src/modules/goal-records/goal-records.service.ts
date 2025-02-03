import { Injectable } from '@nestjs/common';
import { CreateGoalRecordDto } from './dto/create-goal-record.dto';
import { UpdateGoalRecordDto } from './dto/update-goal-record.dto';
import { GoalRecordsRepository } from './goal-records.repository';

@Injectable()
export class GoalRecordsService {
  constructor(private readonly goalRecordsRepository: GoalRecordsRepository) {}
  create(createGoalRecordDto: CreateGoalRecordDto) {
    return this.goalRecordsRepository.create(createGoalRecordDto);
  }

  findAll() {
    return this.goalRecordsRepository.findAll();
  }

  findByGoalId(id: number) {
    return this.goalRecordsRepository.findByGoalId(id);
  }

  findOne(id: number) {
    return this.goalRecordsRepository.findOne(id);
  }

  update(id: number, updateGoalRecordDto: UpdateGoalRecordDto) {
    return this.goalRecordsRepository.update(id, updateGoalRecordDto);
  }

  remove(id: number) {
    return this.goalRecordsRepository.remove(id);
  }
}
