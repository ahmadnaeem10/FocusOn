import { ApiProperty } from '@nestjs/swagger';
import { CreateIssueDto } from './create-issue.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { NewQuestionWithoutIssueIdDto } from '../../questions/dto/new-question-without-issue-id.dto';
import { Type } from 'class-transformer';
import { CreateSolutionWithoutIssueIdDto } from '../../solutions/dto/create-solution-without-issue-id.dto';

export class CreateFullIssueDto {
  @ApiProperty({
    type: CreateIssueDto,
  })
  @ValidateNested()
  @IsNotEmpty()
  issueData: CreateIssueDto;

  @ApiProperty({
    type: [NewQuestionWithoutIssueIdDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewQuestionWithoutIssueIdDto)
  questions: NewQuestionWithoutIssueIdDto[];

  @ApiProperty({
    type: [CreateSolutionWithoutIssueIdDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateSolutionWithoutIssueIdDto)
  solutions: CreateSolutionWithoutIssueIdDto[];
}
