import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSolutionDto } from './create-solution.dto';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class UpdateSolutionDto extends PartialType(CreateSolutionDto) {
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
