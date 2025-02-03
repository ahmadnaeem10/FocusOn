import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService], // Ensuring FilesService is exported for use in other modules
})
export class FilesModule {}
