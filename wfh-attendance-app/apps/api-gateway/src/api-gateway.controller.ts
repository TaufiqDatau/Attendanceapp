import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from 'apps/api-gateway/src/dto/login.dto';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from 'apps/api-gateway/src/dto/register.dto';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly apiGatewayService: ApiGatewayService,
  ) {}

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    const response = this.authClient.send({ cmd: 'login' }, loginDto);
    return await firstValueFrom(response);
  }

  @Post('auth/register')
  async register(@Body() registerDTO: RegisterDto) {
    console.log(registerDTO);
    const response = this.userClient.send('register_user', registerDTO);
    return await firstValueFrom(response);
  }
}
