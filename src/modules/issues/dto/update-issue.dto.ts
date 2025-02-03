import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateIssueDto } from './create-issue.dto';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class UpdateIssueDto extends PartialType(CreateIssueDto) {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
