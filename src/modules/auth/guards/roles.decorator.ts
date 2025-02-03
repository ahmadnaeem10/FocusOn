import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../enum/user-role';
import { ROLES_REFLECTOR } from '../../../constant/roles-reflector';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_REFLECTOR, roles);
