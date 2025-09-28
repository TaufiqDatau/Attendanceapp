import { MYSQL_CONNECTION } from '@app/database/constant';
import { Inject, Injectable } from '@nestjs/common';
import { Register } from 'apps/users-service/src/interface/register.interface';
import { UserRepository } from 'apps/users-service/src/users-service.repository';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class UsersServiceService {
  constructor(private readonly userRepository: UserRepository) {}
  getHello(): string {
    return 'Hello World!';
  }

  async createUser(registerData: Register) {
    try {
      await this.userRepository.registerUser(registerData);
      return { message: 'User created successfully' };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}
