import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  count: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  goodCount: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  wrongCount: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
