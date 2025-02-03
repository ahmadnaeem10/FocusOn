import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

@ApiTags('Solutions')
@Controller('solutions')
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new solution',
    description: 'Endpoint to create a new solution.',
  })
  @ApiResponse({
    status: 201,
    description: 'The solution was successfully created.',
    type: CreateSolutionDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  create(@Body() createSolutionDto: CreateSolutionDto) {
    return this.solutionsService.create(createSolutionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all solutions',
    description: 'Endpoint to retrieve a list of all solutions.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateSolutionDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.solutionsService.findAll();
  }

  @Get('issue/:id')
  @ApiOperation({
    summary: 'Get solutions related to a specific issue',
    description: 'Endpoint to retrieve solutions related to a specific issue.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateSolutionDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByIssueId(@Param('id') id: string) {
    return this.solutionsService.findByIssueId(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific solution by ID',
    description: 'Endpoint to retrieve details of a specific solution by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateSolutionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.solutionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific solution by ID',
    description: 'Endpoint to update details of a specific solution by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The solution was successfully updated.',
    type: UpdateSolutionDto,
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
  update(@Param('id') id: string, @Body() updateSolutionDto: UpdateSolutionDto) {
    return this.solutionsService.update(+id, updateSolutionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific solution by ID',
    description: 'Endpoint to delete a specific solution by ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'The solution was successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  remove(@Param('id') id: string) {
    return this.solutionsService.remove(+id);
  }
}
