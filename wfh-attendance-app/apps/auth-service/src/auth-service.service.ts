import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'apps/auth-service/src/auth-service.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async validateToken(token: string) {
    try {
      const decodedUser = await this.jwtService.verifyAsync(token);
      console.log(decodedUser, 'this is the user');
      return decodedUser; // Return the user payload on success
    } catch (error) {
      // Return null or throw an RpcException for the gateway to handle
      console.error('Token validation failed:', error.message);
      return null;
    }
  }

  async validateRole(token: string, role: string) {
    try {
      const decodedUser = await this.jwtService.verifyAsync(token);
      return decodedUser.roles.some((r) => r.name === role); // Return the user payload on success
    } catch (error) {
      // Return null or throw an RpcException for the gateway to handle
      console.error('Token validation failed:', error.message);
      return null;
    }
  }

  async login(email: string, pass: string) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('email or password is wrong');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isPasswordValid) {
      await this.authRepository.updateUserLoginAttempts(
        user.id,
        user.failedLoginAttempts + 1,
      );
      throw new UnauthorizedException('email or password is wrong');
    }

    const payload = {
      name: user.name,
      email: user.email,
      id: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
