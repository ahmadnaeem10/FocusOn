import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsString()
  fullName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
  verified?: boolean;
}
