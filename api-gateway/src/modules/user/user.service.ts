import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, throwError, firstValueFrom } from 'rxjs';

import { User } from './dto';
import { patterns } from '../patterns';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private send(pattern: any, data: any): Promise<unknown> {
    const res$ = this.userClient.send(pattern, data).pipe(
      timeout(30000),
      catchError((e: Error) => {
        this.logger.error(e);
        return throwError(() => e);
      }),
    );
    return firstValueFrom(res$);
  }

  async createUser(dto: User) {
    this.logger.log('Creating user');
    return this.send(patterns.USER.CREATE, dto);
  }

  async findAllUsers() {
    this.logger.log('Finding all users');
    return this.send(patterns.USER.FIND_ALL, {});
  }

  async findUserById(id: string) {
    this.logger.log(`Finding user by id: ${id}`);
    return this.send(patterns.USER.FIND_BY_ID, { id });
  }

  async updateUser(id: string, dto: User) {
    this.logger.log(`Updating user by id: ${id}`);
    return this.send(patterns.USER.UPDATE, { id, dto });
  }

  async deleteUser(id: string) {
    this.logger.log(`Deleting user by id: ${id}`);
    return this.send(patterns.USER.DELETE, { id });
  }

  async findUserByEmail(email: string) {
    this.logger.log(`Finding user by email: ${email}`);
    return this.send(patterns.USER.FIND_BY_EMAIL, { email });
  }

  async resetPassword(email: string) {
    this.logger.log(`Resetting password for user by email: ${email}`);
    return this.send(patterns.USER.RESET_PASSWORD, { email });
  }
}