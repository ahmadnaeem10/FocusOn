import { Module } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [RoleRepository, RoleService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
