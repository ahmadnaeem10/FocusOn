import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { CreateFullIssueDto } from './dto/create-full-issue.dto';

@ApiTags('Issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new issue',
    description: 'Endpoint to create a new issue.',
  })
  @ApiResponse({
    status: 201,
    description: 'The issue was successfully created.',
    type: CreateIssueDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all issues',
    description: 'Endpoint to retrieve a list of all issues.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateIssueDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.issuesService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Get issues by user ID',
    description: 'Endpoint to retrieve issues based on a specific user ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateIssueDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByUserId(@Param('id') id: string) {
    return this.issuesService.findByUserId(+id);
  }

  @Get('user/:id/solution')
  @ApiOperation({
    summary: 'Get issues by user ID with solution description',
    description:
      'Endpoint to retrieve issues based on a specific user ID with solution description.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateIssueDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByUserIdWithSolutionDescription(@Param('id') id: string) {
    return this.issuesService.findByUserIdWithSolutionDescription(+id);
  }

  @Get('category/:id')
  @ApiOperation({
    summary: 'Get issues by user ID and category ID',
    description:
      'Endpoint to retrieve issues based on a specific user ID  and category ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateIssueDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByUserIdAndCategory(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.issuesService.findByUserIdAndCategory(+id, +userId);
  }

  @Get('piece/:id')
  @ApiOperation({
    summary: 'Get issues by user ID and piece ID',
    description:
      'Endpoint to retrieve issues based on a specific user ID  and piece ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateIssueDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByUserIdAndPiece(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.issuesService.findByUserIdAndPiece(+id, +userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific issue by ID',
    description: 'Endpoint to retrieve details of a specific issue by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateIssueDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific issue by ID',
    description: 'Endpoint to update details of a specific issue by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The issue was successfully updated.',
    type: UpdateIssueDto,
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
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issuesService.update(+id, updateIssueDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific issue by ID',
    description: 'Endpoint to delete a specific issue by ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'The issue was successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  remove(@Param('id') id: string) {
    return this.issuesService.remove(+id);
  }

  @Post('create/full')
  @ApiOperation({
    summary: 'Create a new issue with all related data',
    description: 'Endpoint to create a new issue with all related data.',
  })
  createFull(@Body() createIssueDto: CreateFullIssueDto) {
    return this.issuesService.createFullIssue(createIssueDto);
  }
}
