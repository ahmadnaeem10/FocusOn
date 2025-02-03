import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { role } from '../drizzle/schema';

@Injectable()
export class RoleRepository {
  constructor(private readonly db: DrizzleService) {}

  findByName(roleName: string) {
    return this.db.conn.query.role.findFirst({
      where: (role) => eq(role.name, roleName),
    });
  }

  findById(roleId: number) {
    return this.db.conn.query.role.findFirst({
      where: (role) => eq(role.id, roleId),
    });
  }

  create(roleName: string) {
    return this.db.conn
      .insert(role)
      .values({
        name: roleName,
      })
      .returning();
  }

  getAll() {
    return this.db.conn.select().from(role);
  }
}
