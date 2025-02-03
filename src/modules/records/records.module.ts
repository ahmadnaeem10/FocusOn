import { Module } from '@nestjs/common';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { RecordsRepository } from './records.repository';
import { FilesModule } from '../files/files.module'; // Importing FilesModule
import { DrizzleModule } from '../drizzle/drizzle.module'; // Importing DrizzleModule to resolve DrizzleService

@Module({
  imports: [FilesModule, DrizzleModule], // Added DrizzleModule to make DrizzleService available
  controllers: [RecordsController],
  providers: [RecordsService, RecordsRepository], // Ensured RecordsRepository is provided
  exports: [RecordsService], // Exported RecordsService for external use
})
export class RecordsModule {}
