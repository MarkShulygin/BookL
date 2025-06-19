import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { AuthService } from '../auth/auth.service';

import { UserDTO } from './dto';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(dto: UserDTO) {
    this.logger.log(`Creating user: ${JSON.stringify(dto)}`);
    const { email, username, role } = dto;
    const userPassword = uuidv4().slice(0, 8);

    const roleEntity = await this.roleRepository.findOneBy({ name: role });
    if (!roleEntity) {
      throw new RpcException(`Role ${role} not found`);
    }

    // Remove role from userData and only use role_id
    const userData = {
      email,
      username,
      password: userPassword,
    };

    const $user = this.userRepository.create({
      ...userData,
      role_id: roleEntity.id,
    });

    const user = await this.userRepository.save($user);

    return this.authService.generateTokens({
      member_id: user.id,
      role_id: user.role_id,
    });
  }

  async findAllUsers() {
    return this.userRepository.find();
  }

  async findUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: string, dto: UserDTO) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new RpcException('User not found');
    }

    const roleEntity = await this.roleRepository.findOneBy({ name: dto.role });
    if (!roleEntity) {
      throw new NotFoundException(`Role ${dto.role} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role: _, ...updateData } = dto;
    return this.userRepository.save({
      ...user,
      ...updateData,
      role_id: roleEntity.id,
    });
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new RpcException('User not found');
    }
    return this.userRepository.delete(id);
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async resetPassword(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new RpcException('User not found');
    }
    return this.userRepository.save({ ...user, password: '123456' });
  }
}