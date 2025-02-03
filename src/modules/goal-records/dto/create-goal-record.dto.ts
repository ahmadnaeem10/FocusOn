import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGoalRecordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  order: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  goalId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
