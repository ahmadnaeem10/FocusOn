import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { CreatePieceDto } from './dto/create-piece.dto';
import { UpdatePieceDto } from './dto/update-piece.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateIssueDto } from '../issues/dto/update-issue.dto';

@ApiTags('Pieces')
@Controller('pieces')
export class PiecesController {
  constructor(private readonly piecesService: PiecesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new piece',
    description: 'Endpoint to create a new piece.',
  })
  @ApiResponse({
    status: 201,
    description: 'The piece was successfully created.',
    type: CreatePieceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  create(@Body() createPieceDto: CreatePieceDto) {
    return this.piecesService.create(createPieceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all pieces',
    description: 'Endpoint to retrieve a list of all pieces.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdatePieceDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.piecesService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Get issues by user ID',
    description: 'Endpoint to retrieve pieces based on a specific user ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdatePieceDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByUserId(@Param('id') id: string) {
    return this.piecesService.findByUserId(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific piece by ID',
    description: 'Endpoint to retrieve details of a specific piece by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdatePieceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.piecesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific piece by ID',
    description: 'Endpoint to update details of a specific piece by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The issue was successfully updated.',
    type: UpdatePieceDto,
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
  update(@Param('id') id: string, @Body() updatePieceDto: UpdatePieceDto) {
    return this.piecesService.update(+id, updatePieceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific piece by ID',
    description: 'Endpoint to delete a specific piece by ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'The piece was successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  remove(@Param('id') id: string) {
    return this.piecesService.remove(+id);
  }
}
