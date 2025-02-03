import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OnboardUserRequestDto {
  @ApiProperty({
    type: String,
    description: 'Musician Level',
    example: 'musicianLevel',
  })
  @IsString()
  @IsOptional()
  musicianLevel?: string;
  @ApiProperty({
    type: [String],
    description: 'Help With',
    example: ['helpWith'],
  })
  @IsOptional()
  helpWith?: string[];

  @ApiProperty({
    type: String,
    description: 'Feel About Practising',
    example: 'feelAboutPractising',
  })
  @IsOptional()
  feelAboutPractising?: string;
  @ApiProperty({
    type: String,
    description: 'Plan Skills',
    example: 'planSkills',
  })
  @IsOptional()
  planSkills?: string;
}

export const exampleOnboardUserRequestDto = {
  musicianLevel: 'musicianLevel',
  helpWith: ['helpWith'],
  feelAboutPractising: 'feelAboutPractising',
  planSkills: 'planSkills',
};
