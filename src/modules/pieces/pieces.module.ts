import { Module } from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { PiecesController } from './pieces.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { PiecesRepository } from './pieces.repository';

@Module({
  imports: [DrizzleModule],
  controllers: [PiecesController],
  providers: [PiecesService, PiecesRepository],
})
export class PiecesModule {}
