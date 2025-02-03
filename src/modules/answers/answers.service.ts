import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { AnswersRepository } from './answers.repository';

@Injectable()
export class AnswersService {
  constructor(private readonly answersRepository: AnswersRepository) {}
  create(createAnswerDto: CreateAnswerDto) {
    return this.answersRepository.create(createAnswerDto);
  }

  findAll() {
    return this.answersRepository.findAll();
  }

  findByIssueId(id: number) {
    return this.answersRepository.findByIssueId(id);
  }

  findByQuestionId(id: number) {
    return this.answersRepository.findByQuestionId(id);
  }

  findOne(id: number) {
    return this.answersRepository.findOne(id);
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return this.answersRepository.update(id, updateAnswerDto);
  }

  remove(id: number) {
    return this.answersRepository.remove(id);
  }
}
