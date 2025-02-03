import { Injectable } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssuesRepository } from './issues.repository';
import { CreateFullIssueDto } from './dto/create-full-issue.dto';
import { QuestionsService } from '../questions/questions.service';
import { CreateQuestionDto } from '../questions/dto/create-question.dto';
import { SolutionsService } from '../solutions/solutions.service';
import { CreateSolutionDto } from '../solutions/dto/create-solution.dto';

@Injectable()
export class IssuesService {
  constructor(
    private readonly issuesRepository: IssuesRepository,
    private readonly questionsService: QuestionsService,
    private readonly solutionsService: SolutionsService,
  ) {}
  create(createIssueDto: CreateIssueDto) {
    return this.issuesRepository.create(createIssueDto);
  }

  findAll() {
    return this.issuesRepository.findAll();
  }

  findByUserId(id: number) {
    return this.issuesRepository.findByUserId(id);
  }

  async findByUserIdWithSolutionDescription(id: number) {
    const data =
      await this.issuesRepository.findByUserIdWithSolutionDescription(id);

    return data?.map((issue) => {
      return {
        ...issue.issues,
        solutionDescription: issue.solutions.description,
      };
    });
  }

  findByUserIdAndCategory(id: number, userId: number) {
    return this.issuesRepository.findByUserIdAndCategory(id, userId);
  }

  findByUserIdAndPiece(id: number, userId: number) {
    return this.issuesRepository.findByUserIdAndPiece(id, userId);
  }

  findOne(id: number) {
    return this.issuesRepository.findOne(id);
  }

  update(id: number, updateIssueDto: UpdateIssueDto) {
    return this.issuesRepository.update(id, {
      ...updateIssueDto,
      updatedAt: new Date(),
    });
  }

  remove(id: number) {
    return this.issuesRepository.remove(id);
  }

  async createFullIssue(createFullIssueDto: CreateFullIssueDto) {
    const issue = (await this.create(createFullIssueDto.issueData))[0];
    const mappedQuestions: CreateQuestionDto[] =
      createFullIssueDto.questions.map((question) => ({
        name: question.name,
        type: question.type,
        categoryId: issue.categoryId,
        answer: question.answer,
      }));

    const mappedSolutions: CreateSolutionDto[] =
      createFullIssueDto?.solutions?.map((solution) => ({
        active: solution.active,
        description: solution.description,
        result: solution.result,
        title: solution.title,
        issueId: issue.id,
      }));
    const savedQuestions = mappedQuestions
      ? await this.questionsService.createMany(mappedQuestions, issue.id)
      : [];
    const savedSolutions = mappedSolutions
      ? await this.solutionsService.createMany(mappedSolutions)
      : [];

    return {
      issue,
      questions: savedQuestions,
      solutions: savedSolutions,
    };
  }
}
