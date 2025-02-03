import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  roleId: number;
}
