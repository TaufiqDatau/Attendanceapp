import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'validate_token' })
  validateToken(@Payload() data: { jwt: string }) {
    return this.authService.validateToken(data.jwt);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() credentials: any) {
    return this.authService.login(credentials.email, credentials.password);
  }
}
