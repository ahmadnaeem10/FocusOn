import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new question',
    description: 'Endpoint to create a new question.',
  })
  @ApiResponse({
    status: 201,
    description: 'The question was successfully created.',
    type: CreateQuestionDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all questions',
    description: 'Endpoint to retrieve a list of all questions.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateQuestionDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.questionsService.findAll();
  }

  @Get('category/:id')
  @ApiOperation({
    summary: 'Get questions related to a specific category',
    description:
      'Endpoint to retrieve questions related to a specific category.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateQuestionDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByCategoryId(@Param('id') id: string) {
    return this.questionsService.findByCategoryId(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific question by ID',
    description: 'Endpoint to retrieve details of a specific question by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateQuestionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific question by ID',
    description: 'Endpoint to update details of a specific question by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The question was successfully updated.',
    type: UpdateQuestionDto,
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
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific question by ID',
    description: 'Endpoint to delete a specific question by ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'The question was successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }
}
