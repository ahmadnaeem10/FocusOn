import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { QuestionType } from '../../../enum/question-type';

export class NewQuestionWithoutIssueIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty({
    type: QuestionType,
    enum: QuestionType,
    example: QuestionType.BOOLEAN,
  })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;
}
