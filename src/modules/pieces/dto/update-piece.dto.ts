import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePieceDto } from './create-piece.dto';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class UpdatePieceDto extends PartialType(CreatePieceDto) {
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
