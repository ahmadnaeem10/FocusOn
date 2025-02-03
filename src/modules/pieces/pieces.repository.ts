import { DrizzleService } from '../drizzle/drizzle.service';
import { pieces } from '../drizzle/schema';
import { and, eq, ilike, not } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';

@Injectable()
export class PiecesRepository {
  constructor(private readonly db: DrizzleService) {}

  findPieceByNameAndUserId({ name, userId }: { name: string; userId: number }) {
    return this.db.conn
      .select()
      .from(pieces)
      .where(and(ilike(pieces.name, name), eq(pieces.userId, userId)))
      .limit(1);
  }

  async create(createPieceDto: CreatePieceDto): Promise<
    {
      id: number;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      userId: number;
    }[]
  > {
    const trimmedPieceName = createPieceDto.name.trim();

    const existingPiece = await this.findPieceByNameAndUserId({
      name: trimmedPieceName,
      userId: createPieceDto.userId,
    });
    if (existingPiece.length) {
      return existingPiece;
    }
    return this.db.conn
      .insert(pieces)
      .values({
        ...createPieceDto,
        name: trimmedPieceName,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  }

  findAll() {
    return this.db.conn.select().from(pieces);
  }

  findByUserId(id: number) {
    return this.db.conn.query.pieces.findMany({
      where: (pieces) => and(eq(pieces.userId, id), not(eq(pieces.name, ''))),
      orderBy: (pieces, { asc }) => [asc(pieces.name)],
    });
  }

  findOne(id: number) {
    return this.db.conn.query.issues.findFirst({
      where: (issues) => eq(issues.id, id),
    });
  }

  async update(id: number, updatePieceDto: UpdatePieceDto) {
    return (
      await this.db.conn
        .update(pieces)
        .set({ ...updatePieceDto, updatedAt: new Date() })
        .where(eq(pieces.id, id))
        .returning()
    )[0];
  }

  async remove(id: number) {
    await this.db.conn.delete(pieces).where(eq(pieces.id, id)).execute();
  }
}
