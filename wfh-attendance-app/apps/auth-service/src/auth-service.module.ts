import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { AuthRepository } from 'apps/auth-service/src/auth-service.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      envFilePath: './.env', // <-- This tells it to load the .env file from the root
    }),
    JwtModule.register({
      secret: 'YOUR_SUPER_SECRET_KEY', // Use environment variables in production!
      signOptions: { expiresIn: '60m' },
    }),
    DatabaseModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthService, AuthRepository],
})
export class AuthServiceModule {}
