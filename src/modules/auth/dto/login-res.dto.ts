import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  user: UserDto;
}
