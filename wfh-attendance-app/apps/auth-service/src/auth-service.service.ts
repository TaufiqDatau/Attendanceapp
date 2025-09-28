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
      return this.jwtService.verify(token);
    } catch (e) {
      return null; // Or throw an error
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

    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
