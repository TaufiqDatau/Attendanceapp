import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { Register } from 'apps/users-service/src/interface/register.interface';
import type { getAllUserRequest } from 'apps/users-service/src/interface/users.interface';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  @Get()
  getHello(): string {
    return this.usersServiceService.getHello();
  }

  @MessagePattern('register_user')
  async createUser(@Payload() registerData: Register) {
    try {
      await this.usersServiceService.createUser(registerData);
      return { message: 'User created successfully' };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  @MessagePattern('get_all_users')
  async getAllUsers(@Payload() body: getAllUserRequest) {
    try {
      const response = await this.usersServiceService.getAllUsers(body);
      return response;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get all users');
    }
  }

  @MessagePattern('get_user_home_location')
  async getUserHomeLocation(@Payload() userId: number) {
    try {
      const response =
        await this.usersServiceService.getUserHomeLocation(userId);
      return response;
    } catch (error) {
      console.error('Error getting user home location:', error);
      throw new Error('Failed to get user home location');
    }
  }

  @MessagePattern('update_user_home_location')
  async updateUserHomeLocation(@Payload() payload: any) {
    const { userId, latitude, longitude } = payload;
    try {
      await this.usersServiceService.updateUserHomeLocation(
        userId,
        latitude,
        longitude,
      );
      return {
        message: 'User location updated successfully',
        data: {
          latitude,
          longitude,
        },
      };
    } catch (error) {
      console.error('Error updating user location:', error);
      throw new Error('Failed to update user location');
    }
  }
}
