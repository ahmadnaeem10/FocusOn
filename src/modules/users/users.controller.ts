import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/guards/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../../enum/user-role';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { AllowUnauthorizedRequest } from '../auth/allow-unauthorized-request';
import { exampleOnboardUserRequestDto, OnboardUserRequestDto } from './dto/request/onboard-user-request.dto';
import { Request } from 'express'; // Make sure this import exists

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User Creation' })
  @ApiBody({
    type: () => CreateUserDto,
    examples: {
      example: {
        value: {
          email: 'user@example.com',
          password: 'password123',
          fullName: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully created',
    type: () => UserDto,
  })
  @Post()
  @Roles(UserRole.ADMIN)
  @AllowUnauthorizedRequest()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users',
    type: UpdateUserDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'User',
    type: UpdateUserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCurrentUser(@Param('id') id: string) {
    return await this.usersService.findById(+id);
  }

  @ApiOperation({ summary: 'User updating' })
  @ApiBody({
    type: () => UpdateUserDto,
    examples: {
      example: {
        value: {
          email: 'user@example.com',
          password: 'password123',
          fullName: 'John Doe',
          verified: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: () => UserDto,
  })
  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @ApiOperation({ summary: 'User deletion' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @Delete(':userId')
  @Roles(UserRole.ADMIN)
  delete(@Param() param: DeleteUserDto) {
    return this.usersService.delete(param.userId);
  }

  @ApiOperation({ summary: 'Updating user role' })
  @ApiBody({
    type: () => UpdateUserRoleDto,
    examples: {
      example: {
        value: {
          userId: 1,
          roleId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User role successfully updated',
  })
  @Put('role')
  @Roles(UserRole.ADMIN)
  updateRole(@Body() body: UpdateUserRoleDto) {
    return this.usersService.updateRole(body);
  }

  @ApiOperation({ summary: 'Complete onboarding' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding completed',
  })
  @ApiBody({
    type: () => OnboardUserRequestDto,
    examples: {
      example: {
        value: exampleOnboardUserRequestDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Onboarding completed',
  })
  @Put(':userId/onboarding')
  completeOnboarding(
    @Body() body: OnboardUserRequestDto,
    @Param('userId') userId: string,
  ) {
    return this.usersService.completeOnboarding({
      userId: +userId,
      onboard: body,
    });
  }

  // New endpoint to get settings links
  @ApiOperation({
    summary: 'Get settings links',
    description: 'Returns static URLs for Settings page navigation',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns predefined settings links',
    schema: {
      example: {
        about: 'https://focusonapp.com/about',
        help: 'https://focusonapp.com/#faq',
        privacy: 'https://focusonapp.com/privacy-policy.pdf',
        terms: 'https://focusonapp.com/terms-of-use.pdf',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('settings/links')
  getSettingsLinks() {
    return this.usersService.getSettingsLinks();
  }

  // New endpoint to track app launch
  @Post('track-launch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Track app launch' })
  @ApiResponse({ status: 200, description: 'Launch tracked successfully' })
  async trackAppLaunch(@Req() req: Request) {
    return this.usersService.handleAppLaunch(req.user?.id);
  }

  // New endpoint to check if rating prompt should be shown
  @Get('should-show-rating')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if rating prompt should be shown' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns boolean for rating prompt',
    schema: { example: { shouldShow: true } }
  })
  async shouldShowRating(@Req() req: Request) {
    return this.usersService.shouldShowRatingPrompt(req.user?.id);
  }

  // New endpoint to handle rating response
  @Post('rating-response')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Handle user rating response' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accepted: { type: 'boolean' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Response recorded' })
  async handleRatingResponse(
    @Req() req: Request,
    @Body() body: { accepted: boolean }
  ) {
    return this.usersService.handleRatingResponse(req.user?.id, body.accepted);
  }
}
