import { Module } from '@nestjs/common';
import { UserRole } from '../../enum/user-role';
import { UsersModule } from '../users/users.module';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';

@Module({
  imports: [UsersModule, RoleModule],
})
export class OnAppInitModule {
  constructor(private readonly roleService: RoleService) {}

  private async createRoles() {
    const roles = Object.values(UserRole);
    await Promise.all(
      roles.map(async (role) => {
        const isRoleExists = await this.roleService.existsByName(role);
        if (!isRoleExists) {
          await this.roleService.createRole(role);
        } else {
          console.info(`Role ${role} already exists`);
        }
      }),
    );
  }

  onModuleInit() {
    void this.createRoles().then(() => {});
  }
}
