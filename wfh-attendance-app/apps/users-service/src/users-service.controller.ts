import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { Register } from 'apps/users-service/src/interface/register.interface';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  @Get()
  getHello(): string {
    return this.usersServiceService.getHello();
  }

  @MessagePattern('register_user')
  async createUser(@Payload() registerData: any) {
    try {
      await this.usersServiceService.createUser(registerData);
      return { message: 'User created successfully' };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}
