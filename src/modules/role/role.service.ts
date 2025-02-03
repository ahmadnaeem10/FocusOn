import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(roleName: string) {
    return this.roleRepository.create(roleName);
  }

  async findByName(roleName: string) {
    return this.roleRepository.findByName(roleName);
  }

  async findById(roleId: number) {
    return this.roleRepository.findById(roleId);
  }

  async existsByName(roleName: string): Promise<boolean> {
    return Boolean(await this.roleRepository.findByName(roleName));
  }

  getAll() {
    return this.roleRepository.getAll();
  }
}
