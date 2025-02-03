import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRecordDto } from './create-record.dto';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class UpdateRecordDto extends PartialType(CreateRecordDto) {
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
