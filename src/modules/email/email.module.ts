import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
