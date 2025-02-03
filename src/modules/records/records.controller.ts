import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service'; // Added import
import { Request } from 'express';

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly filesService: FilesService, // Added this dependency
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('audio')) // Handling file upload under the 'audio' field
  @ApiOperation({
    summary: 'Upload a recording',
    description: 'Endpoint to upload a new recording with associated data.',
  })
  @ApiResponse({
    status: 201,
    description: 'The record was successfully created.',
    type: CreateRecordDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRecordDto: CreateRecordDto,
    @Req() req: Request,
  ) {
    // Upload file and get URL
    const audioUrl = await this.filesService.uploadFile(file);
    
    // Calculate take number based on userId and issueId
    const takeNumber = await this.recordsService.calculateTakeNumber(
      createRecordDto.userId,
      createRecordDto.issueId,
    );

    // Create record with audioUrl and takeNumber
    return this.recordsService.create({
      ...createRecordDto,
      audioUrl,
      takeNumber,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all records',
    description: 'Endpoint to retrieve a list of all records.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateRecordDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.recordsService.findAll();
  }

  @Get('issue/:id')
  @ApiOperation({
    summary: 'Get records related to a specific issue',
    description: 'Endpoint to retrieve records related to a specific issue.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateRecordDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByIssueId(@Param('id') id: string) {
    return this.recordsService.findByIssueId(+id);
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Get records related to a specific user',
    description: 'Endpoint to retrieve records related to a specific user.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateRecordDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByUserId(@Param('id') id: string) {
    return this.recordsService.findByUserId(+id);
  }

  @Get('user/:userId/issue/:issueId') // New endpoint to fetch recordings by userId and issueId
  @ApiOperation({
    summary: 'Get records related to a specific user and issue',
    description: 'Endpoint to retrieve records related to a specific user and issue.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateRecordDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  async findByUserAndIssue(
    @Param('userId') userId: string,
    @Param('issueId') issueId: string,
  ) {
    return this.recordsService.findByUserIdAndIssueId(+userId, +issueId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific record by ID',
    description: 'Endpoint to retrieve details of a specific record by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateRecordDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific record by ID',
    description: 'Endpoint to update details of a specific record by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The record was successfully updated.',
    type: UpdateRecordDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific record by ID',
    description: 'Endpoint to delete a specific record by ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'The record was successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }
}
