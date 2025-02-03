import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordsRepository } from './records.repository';
import { FilesService } from '../files/files.service'; // Added import

@Injectable()
export class RecordsService {
  constructor(
    private readonly recordsRepository: RecordsRepository,
    private readonly filesService: FilesService, // Added this dependency
  ) {}

  // Method to calculate the next take number based on userId and issueId
  async calculateTakeNumber(userId: number, issueId: number): Promise<number> {
    // Retrieve all records for the specific user and issue
    const existingRecords = await this.recordsRepository.findByUserIdAndIssueId(
      userId,
      issueId,
    );

    // Return the next take number (current length + 1)
    return existingRecords.length + 1;
  }

  // Updated create method to include timestamps
  async create(createRecordDto: CreateRecordDto) {
    // Create database payload with server-generated fields
    const dbPayload = {
      ...createRecordDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.recordsRepository.create(dbPayload);
  }

  // Retrieve all records
  findAll() {
    return this.recordsRepository.findAll();
  }

  // Retrieve records related to a specific issue by id
  findByIssueId(id: number) {
    return this.recordsRepository.findByIssueId(id);
  }

  // Retrieve records related to a specific user by id
  findByUserId(id: number) {
    return this.recordsRepository.findByUserId(id);
  }

  // Retrieve a single record by id
  findOne(id: number) {
    return this.recordsRepository.findOne(id);
  }

  // Update a specific record by id and update timestamp
  update(id: number, updateRecordDto: UpdateRecordDto) {
    return this.recordsRepository.update(id, {
      ...updateRecordDto,
      updatedAt: new Date(), // Add updatedAt timestamp
    });
  }

  // Delete a specific record by id
  remove(id: number) {
    return this.recordsRepository.remove(id);
  }

  // Find records by both userId and issueId
  async findByUserIdAndIssueId(userId: number, issueId: number) {
    return this.recordsRepository.findByUserIdAndIssueId(userId, issueId);
  }
}
