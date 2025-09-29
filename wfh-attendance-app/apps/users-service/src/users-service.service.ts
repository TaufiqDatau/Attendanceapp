import { MYSQL_CONNECTION } from '@app/database/constant';
import { Inject, Injectable } from '@nestjs/common';
import { Register } from 'apps/users-service/src/interface/register.interface';
import { getAllUserRequest } from 'apps/users-service/src/interface/users.interface';
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

  async getAllUsers(body: getAllUserRequest) {
    try {
      return await this.userRepository.getAllUsers(body);
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get all users');
    }
  }

  async updateUserHomeLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ) {
    try {
      await this.userRepository.updateUserLocation(userId, latitude, longitude);
      return { message: 'User location updated successfully' };
    } catch (error) {
      console.error('Error updating user location:', error);
      throw new Error('Failed to update user location');
    }
  }

  async getUserHomeLocation(userId: number) {
    try {
      return await this.userRepository.getUserLocation(userId);
    } catch (error) {
      console.error('Error getting user home location:', error);
      throw new Error('Failed to get user home location');
    }
  }
}
