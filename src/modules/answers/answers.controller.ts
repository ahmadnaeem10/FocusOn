import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Answers')
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new answer',
    description: 'Endpoint to create a new answer.',
  })
  @ApiResponse({
    status: 201,
    description: 'The answer was successfully created.',
    type: CreateAnswerDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersService.create(createAnswerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all answers',
    description: 'Endpoint to retrieve a list of all answers.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateAnswerDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.answersService.findAll();
  }

  @Get('question/:id')
  @ApiOperation({
    summary: 'Get answers related to a specific question',
    description: 'Endpoint to retrieve answers related to a specific question.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateAnswerDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByQuestionId(@Param('id') id: string) {
    return this.answersService.findByQuestionId(+id);
  }

  @Get('issue/:id')
  @ApiOperation({
    summary: 'Get answers related to a specific issue',
    description: 'Endpoint to retrieve answers related to a specific issue.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateAnswerDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByIssueId(@Param('id') id: string) {
    return this.answersService.findByIssueId(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific answer by ID',
    description: 'Endpoint to retrieve details of a specific answer by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateAnswerDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.answersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific answer by ID',
    description: 'Endpoint to update details of a specific answer by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The answer was successfully updated.',
    type: UpdateAnswerDto,
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
  update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answersService.update(+id, updateAnswerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific answer by ID',
    description: 'Endpoint to delete a specific answer by ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'The answer was successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  remove(@Param('id') id: string) {
    return this.answersService.remove(+id);
  }
}
