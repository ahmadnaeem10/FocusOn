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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Endpoint to create a new category.',
  })
  @ApiResponse({
    status: 201,
    description: 'The category was successfully created.',
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Error,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all categories',
    description: 'Endpoint to retrieve a list of all categories.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateCategoryDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Get categories by user ID',
    description: 'Endpoint to retrieve categories based on a specific user ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateCategoryDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findByUserId(@Param('id') id: string) {
    return this.categoriesService.findByUserId(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific category by ID',
    description: 'Endpoint to retrieve details of a specific category by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The request was successful.',
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update details of a specific category by ID',
    description: 'Endpoint to update details of a specific category by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The category was successfully updated.',
    type: CreateCategoryDto,
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
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a specific category by ID',
    description: 'Endpoint to delete a specific category by ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'The category was successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: Error,
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
