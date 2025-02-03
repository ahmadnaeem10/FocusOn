import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GoalRecordsService } from './goal-records.service';
import { CreateGoalRecordDto } from './dto/create-goal-record.dto';
import { UpdateGoalRecordDto } from './dto/update-goal-record.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Goal records')
@Controller('goal-records')
export class GoalRecordsController {
  constructor(private readonly goalRecordsService: GoalRecordsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new goal record',
    description: 'Endpoint to create a new goal record.',
  })
  @ApiResponse({
    status: 201,
    description: 'The goal record was successfully created.',
    type: CreateGoalRecordDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  create(@Body() createGoalRecordDto: CreateGoalRecordDto) {
    return this.goalRecordsService.create(createGoalRecordDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all goal records',
    description: 'Endpoint to retrieve a list of all goal records.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateGoalRecordDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.goalRecordsService.findAll();
  }

  @Get('issue/:id')
  @ApiOperation({
    summary: 'Get records related to a specific goal',
    description: 'Endpoint to retrieve records related to a specific goal.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateGoalRecordDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByGoalId(@Param('id') id: string) {
    return this.goalRecordsService.findByGoalId(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific goal record by ID',
    description: 'Endpoint to retrieve details of a specific goal record by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateGoalRecordDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.goalRecordsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific goal record by ID',
    description: 'Endpoint to update details of a specific goal record by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The goal record was successfully updated.',
    type: UpdateGoalRecordDto,
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
  update(
    @Param('id') id: string,
    @Body() updateGoalRecordDto: UpdateGoalRecordDto,
  ) {
    return this.goalRecordsService.update(+id, updateGoalRecordDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific goal record by ID',
    description: 'Endpoint to delete a specific goal record by ID.',
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
    return this.goalRecordsService.remove(+id);
  }
}
