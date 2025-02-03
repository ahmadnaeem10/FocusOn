import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Goals')
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new goal',
    description: 'Endpoint to create a new goal.',
  })
  @ApiResponse({
    status: 201,
    description: 'The goal was successfully created.',
    type: CreateGoalDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(createGoalDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all goals',
    description: 'Endpoint to retrieve a list of all goals.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateGoalDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.goalsService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Get goals by user ID',
    description: 'Endpoint to retrieve goals based on a specific user ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateGoalDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByUserId(@Param('id') id: string) {
    return this.goalsService.findByUserId(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific goal by ID',
    description: 'Endpoint to retrieve details of a specific goal by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateGoalDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific goal by ID',
    description: 'Endpoint to update details of a specific goal by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The issue was successfully updated.',
    type: UpdateGoalDto,
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
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific goal by ID',
    description: 'Endpoint to delete a specific goal by ID.',
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
    return this.goalsService.remove(+id);
  }
}
