import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { PG_CONNECTION } from '../../constant/pg-connection';
export class DrizzleService {
  constructor(
    @Inject(PG_CONNECTION) readonly conn: NodePgDatabase<typeof schema>,
  ) {}
}
