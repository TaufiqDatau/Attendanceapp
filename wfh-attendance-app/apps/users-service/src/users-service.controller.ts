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
