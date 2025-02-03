import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRecordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  // Keep fileName for backward compatibility
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  issueId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  takeNumber: number;
}
