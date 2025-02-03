import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ALLOW_UNAUTHORIZED_REQUEST } from '../../../constant/allow-unauthorized-request';

@Injectable()
export class JwtAndRoleGuard implements CanActivate {
  private readonly jwtGuard = new JwtAuthGuard(this.reflector);
  private readonly rolesGuard = new RolesGuard(this.reflector);
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      ALLOW_UNAUTHORIZED_REQUEST,
      context.getHandler(),
    );
    if (allowUnauthorizedRequest) {
      return true;
    }
    const isJwt = await this.jwtGuard.canActivate(context);
    const isRole = await this.rolesGuard.canActivate(context);
    return isJwt && isRole;
  }
}
