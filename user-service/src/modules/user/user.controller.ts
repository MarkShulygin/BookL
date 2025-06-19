import { Logger, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UserService } from './user.service';
import { UserDTO } from './dto';
import { patterns } from '../patterns';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern(patterns.USER.CREATE)
  async createUser(dto: UserDTO) {
    console.log(dto);
    this.logger.log('Creating user');
    return this.userService.createUser(dto);
  }

  @MessagePattern(patterns.USER.FIND_ALL)
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @MessagePattern(patterns.USER.FIND_BY_ID)
  async findUserById(id: string) {
    return this.userService.findUserById(id);
  }

  @MessagePattern(patterns.USER.UPDATE)
  async updateUser(id: string, dto: UserDTO) {
    return this.userService.updateUser(id, dto);
  }

  @MessagePattern(patterns.USER.DELETE)
  async deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }

  @MessagePattern(patterns.USER.FIND_BY_EMAIL)
  async findUserByEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }

  @MessagePattern(patterns.USER.RESET_PASSWORD)
  async resetPassword(email: string) {
    return this.userService.resetPassword(email);
  }
}