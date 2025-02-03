import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsRepository } from './questions.repository';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly answersService: AnswersService,
  ) {}
  create(createQuestionDto: CreateQuestionDto) {
    return this.questionsRepository.create(createQuestionDto);
  }

  findAll() {
    return this.questionsRepository.findAll();
  }

  findByCategoryId(id: number) {
    return this.questionsRepository.findByCategoryId(id);
  }

  findOne(id: number) {
    return this.questionsRepository.findOne(id);
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.questionsRepository.update(id, {
      ...updateQuestionDto,
      updatedAt: new Date(),
    });
  }

  remove(id: number) {
    return this.questionsRepository.remove(id);
  }
  async createMany(createQuestionDto: CreateQuestionDto[], issueId: number) {
    const questions = [];
    for (const questionData of createQuestionDto) {
      const question = (
        await this.create({
          name: questionData.name,
          type: questionData.type,
          categoryId: questionData.categoryId,
        })
      )[0];
      await this.answersService.create({
        questionId: question.id,
        answer: questionData.answer,
        issueId,
      });
      questions.push(question);
    }
    return questions;
  }
}
