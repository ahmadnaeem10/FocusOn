import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistException } from '../../exception/user-already-exist.exception';
import { UserDto } from './dto/user.dto';
import { UserRole } from '../../enum/user-role';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RoleUtil } from '../../utils/role.util';
import { CategoriesService } from '../categories/categories.service';
import { OnboardUserRequestDto } from './dto/request/onboard-user-request.dto';

@Injectable()
export class UsersService {
  private readonly passwordEncoder = bcrypt;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly roleService: RoleService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const isEmailExists = await this.existsByEmail(createUserDto.email);
    if (isEmailExists) {
      throw new UserAlreadyExistException(
        `User with such email ${createUserDto.email} already exist`,
      );
    }

    const role = await this.roleService.findByName(UserRole.USER);
    let hashedPassword = null;
    if (createUserDto.password) {
      hashedPassword = await this.hashPassword(createUserDto.password);
    }
    const savedUser = (
      await this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        roleId: role.id,
      })
    )[0];

    await this.categoriesService.createDefaultCategories(savedUser.id);

    return new UserDto({
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      role: RoleUtil.normalizeRole(role.name),
      password: savedUser.password,
    });
  }

  async createProviderUser(createUserDto: {
    email: string;
    fullName: string;
  }) {
    const isEmailExists = await this.existsByEmail(createUserDto.email);
    if (isEmailExists) {
      throw new UserAlreadyExistException(
        `User with such email ${createUserDto.email} already exist`,
      );
    }

    const role = await this.roleService.findByName(UserRole.USER);
    const savedUser = (
      await this.usersRepository.create({
        email: createUserDto.email,
        fullName: createUserDto.fullName,
        roleId: role.id,
      })
    )[0];

    return new UserDto({
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      role: RoleUtil.normalizeRole(role.name),
    });
  }

  hashPassword(password: string) {
    return this.passwordEncoder.hash(password, 10);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async existsByEmail(email: string): Promise<boolean> {
    return Boolean(await this.usersRepository.findByEmail(email));
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      return new UserDto({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: RoleUtil.normalizeRole(
          Array.isArray(user.user_role)
            ? user.user_role[0].name
            : user.user_role.name,
        ),
        password: user.password,
        verified: user.verified,
      });
    } else {
      return null;
    }
  }

  async findById(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findById(id);
    const userInfo = await this.usersRepository.findUserInfo(id);
    const isOnboardingCompleted = userInfo ? userInfo.isOnboarded : false;
    return new UserDto({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: RoleUtil.normalizeRole(
        Array.isArray(user.user_role)
          ? user.user_role[0].name
          : user.user_role.name,
      ),
      password: user.password,
      verified: user.verified,
      isOnboardingCompleted,
    });
  }

  async update(user: UpdateUserDto): Promise<UserDto> {
    const savedUser = await this.usersRepository.update(user);

    return new UserDto({
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      password: savedUser.password,
      verified: savedUser.verified,
    });
  }

  delete(userId: number) {
    return this.usersRepository.delete(userId);
  }

  async updateRole(updateUserRoleDto: UpdateUserRoleDto) {
    return this.usersRepository.updateRole(updateUserRoleDto);
  }

  async findPasswordCode(userId: number) {
    return await this.usersRepository.findPasswordCode(userId);
  }

  async deletePasswordCode(userId: number) {
    return await this.usersRepository.deletePasswordCode(userId);
  }

  async changePassword({ password, id }: { password: string; id: number }) {
    return await this.usersRepository.changePassword({
      password: password,
      id: id,
    });
  }

  createPasswordCode({
    userId,
    code,
    expiresAt,
  }: {
    userId: number;
    code: string;
    expiresAt: Date;
  }) {
    return this.usersRepository.createPasswordCode({
      userId: userId,
      code: code,
      expiresAt: expiresAt,
    });
  }

  createVerificationCode({
    userId,
    code,
    expiresAt,
  }: {
    userId: number;
    code: string;
    expiresAt: Date;
  }) {
    return this.usersRepository.createVerificationCode({
      userId: userId,
      code: code,
      expiresAt: expiresAt,
    });
  }

  async findVerificationCode(userId: number) {
    return await this.usersRepository.findVerificationCode(userId);
  }

  async deleteVerificationCode(userId: number) {
    return await this.usersRepository.deleteVerificationCode(userId);
  }

  async completeOnboarding({
    userId,
    onboard,
  }: {
    userId: number;
    onboard: OnboardUserRequestDto;
  }) {
    await this.usersRepository.createUserInfo({
      userId: userId,
      isOnboarded: true,
      feelAboutPractising: onboard.feelAboutPractising,
      helpWith: onboard.helpWith,
      musicianLevel: onboard.musicianLevel,
      planSkills: onboard.planSkills,
    });
  }

  // New method to get settings links
  getSettingsLinks() {
    return {
      about: 'https://focusonapp.com/about',
      help: 'https://focusonapp.com/#faq',
      privacy: 'https://focusonapp.com/privacy-policy.pdf',
      terms: 'https://focusonapp.com/terms-of-use.pdf',
    };
  }

  // New method to handle app launch
  async handleAppLaunch(userId: number) {
    const userInfo = await this.usersRepository.findUserInfo(userId);

    const newCount = (userInfo?.appLaunchCount || 0) + 1;

    await this.usersRepository.updateUserInfo(userId, {
      appLaunchCount: newCount,
      // Create user_info if it doesn't exist
      ...(!userInfo && { 
        isOnboarded: true,
        musicianLevel: '',
        helpWith: [],
        feelAboutPractising: '',
        planSkills: ''
      })
    });
  }

  // New method to check if rating prompt should be shown
  async shouldShowRatingPrompt(userId: number) {
    const userInfo = await this.usersRepository.findUserInfo(userId);

    return {
      shouldShow: userInfo?.appLaunchCount >= 3 && 
        (!userInfo.lastRatingPrompt || 
        new Date().getTime() - userInfo.lastRatingPrompt.getTime() > 30 * 24 * 60 * 60 * 1000) // 30-day cooldown
    };
  }

  // New method to handle rating response
  async handleRatingResponse(userId: number, accepted: boolean) {
    await this.usersRepository.updateUserInfo(userId, {
      appLaunchCount: accepted ? 0 : 0, // Reset counter regardless of response
      lastRatingPrompt: new Date()
    });
  }
}
