import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { RoleModule } from '../role/role.module';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [DrizzleModule, RoleModule, CategoriesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
