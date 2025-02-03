import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  passwordCode,
  userInfo,
  users,
  verificationCode,
} from '../drizzle/schema';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DrizzleService) {}

  create(
    params: Omit<CreateUserDto, 'password'> &
      Partial<CreateUserDto> & {
        roleId: number;
      },
  ) {
    return this.db.conn
      .insert(users)
      .values({
        email: params.email,
        password: params.password,
        fullName: params.fullName,
        roleId: params.roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
        verified: params.verified || false,
      })
      .returning();
  }

  async findAll() {
    return this.db.conn.select().from(users);
  }

  findByEmail(email: string) {
    return this.db.conn.query.users.findFirst({
      where: (users) => eq(users.email, email),
      with: {
        user_role: true,
      },
    });
  }

  findById(id: number) {
    return this.db.conn.query.users.findFirst({
      where: (users) => eq(users.id, id),
      with: {
        user_role: true,
      },
    });
  }

  findUserInfo(userId: number) {
    return this.db.conn.query.userInfo.findFirst({
      where: (userInfo) => eq(userInfo.userId, userId),
    });
  }

  async update(user: UpdateUserDto) {
    return (
      await this.db.conn
        .update(users)
        .set({
          email: user.email,
          fullName: user.fullName,
          password: user.password,
          verified: user.verified,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning()
    )[0];
  }

  async delete(id: number) {
    await this.db.conn.delete(users).where(eq(users.id, id)).execute();
  }

  async changePassword({ password, id }: { id: number; password: string }) {
    return (
      await this.db.conn
        .update(users)
        .set({
          password,
        })
        .where(eq(users.id, id))
        .returning()
    )[0];
  }

  async updateRole(updateUserRoleDto: UpdateUserRoleDto) {
    return (
      await this.db.conn
        .update(users)
        .set({
          roleId: updateUserRoleDto.roleId,
        })
        .where(eq(users.id, updateUserRoleDto.userId))
        .returning()
    )[0];
  }

  createPasswordCode({
    userId,
    code,
    expiresAt,
  }: {
    userId: number;
    code: string;
    expiresAt: Date;
  }) {
    return this.db.conn
      .insert(passwordCode)
      .values({
        code: code,
        expiresAt: expiresAt,
        userId: userId,
      })
      .returning();
  }

  findPasswordCode(userId: number) {
    return this.db.conn.query.passwordCode.findFirst({
      where: eq(passwordCode.userId, userId),
    });
  }

  async deletePasswordCode(userId: number) {
    await this.db.conn
      .delete(passwordCode)
      .where(eq(passwordCode.userId, userId))
      .execute();
  }

  createVerificationCode({
    userId,
    code,
    expiresAt,
  }: {
    userId: number;
    code: string;
    expiresAt: Date;
  }) {
    return this.db.conn
      .insert(verificationCode)
      .values({
        code: code,
        expiresAt: expiresAt,
        userId: userId,
      })
      .returning();
  }

  findVerificationCode(userId: number) {
    return this.db.conn.query.verificationCode.findFirst({
      where: eq(verificationCode.userId, userId),
    });
  }

  async deleteVerificationCode(userId: number) {
    await this.db.conn
      .delete(verificationCode)
      .where(eq(verificationCode.userId, userId))
      .execute();
  }

  async createUserInfo(data: {
    isOnboarded?: boolean;
    musicianLevel?: string;
    helpWith?: string[];
    feelAboutPractising?: string;
    planSkills?: string;
    userId: number;
  }) {
    return (await this.db.conn.insert(userInfo).values(data).returning())[0];
  }

  // New method for updating user information
  async updateUserInfo(userId: number, update: Partial<typeof userInfo.$inferInsert>) {
    return this.db.conn
      .update(userInfo)
      .set(update)
      .where(eq(userInfo.userId, userId));
  }
}
