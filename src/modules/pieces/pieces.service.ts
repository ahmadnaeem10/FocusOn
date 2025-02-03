import { Injectable } from '@nestjs/common';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { PiecesRepository } from './pieces.repository';

@Injectable()
export class PiecesService {
  constructor(private readonly piecesRepository: PiecesRepository) {}
  create(createPieceDto: CreatePieceDto) {
    return this.piecesRepository.create(createPieceDto);
  }

  findAll() {
    return this.piecesRepository.findAll();
  }

  findByUserId(id: number) {
    return this.piecesRepository.findByUserId(id);
  }

  findOne(id: number) {
    return this.piecesRepository.findOne(id);
  }

  update(id: number, updatePieceDto: UpdatePieceDto) {
    return this.piecesRepository.update(id, updatePieceDto);
  }

  remove(id: number) {
    return this.piecesRepository.remove(id);
  }
}
