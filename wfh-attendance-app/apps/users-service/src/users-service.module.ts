import { Module } from '@nestjs/common';
import { UsersServiceController } from './users-service.controller';
import { UsersServiceService } from './users-service.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from 'apps/users-service/src/users-service.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      envFilePath: './.env', // <-- This tells it to load the .env file from the root
    }),
    DatabaseModule,
  ],
  controllers: [UsersServiceController],
  providers: [UsersServiceService, UserRepository],
})
export class UsersServiceModule {}
