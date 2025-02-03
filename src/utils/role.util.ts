import { UserRole } from '../enum/user-role';

export class RoleUtil {
  static normalizeRole(role: string): UserRole {
    const roles = Object.values(UserRole);
    if (roles.includes(role as UserRole)) {
      return role as UserRole;
    }
  }
}
