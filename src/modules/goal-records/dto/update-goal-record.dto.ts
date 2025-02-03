import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGoalRecordDto } from './create-goal-record.dto';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class UpdateGoalRecordDto extends PartialType(CreateGoalRecordDto) {
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
