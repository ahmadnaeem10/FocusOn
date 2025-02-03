import { Exclude } from 'class-transformer';
import { UserRole } from '../../../enum/user-role';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  role: UserRole;
  @ApiProperty()
  verified: boolean;
  @Exclude()
  password: string;

  @ApiProperty()
  isOnboardingCompleted: boolean;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
