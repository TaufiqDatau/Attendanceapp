import { Module } from '@nestjs/common';
import { AttendanceServiceController } from './attendance-service.controller';
import { AttendanceService } from './attendance-service.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { AttendanceServiceRepository } from 'apps/attendance-service/src/attendance-service.repository';
import { MinioService } from 'apps/attendance-service/src/module/minio-client.service';
import { MinioClientModule } from 'apps/attendance-service/src/module/minio-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      envFilePath: './.env', // <-- This tells it to load the .env file from the root
    }),
    DatabaseModule,
    MinioClientModule,
  ],
  controllers: [AttendanceServiceController],
  providers: [AttendanceService, AttendanceServiceRepository, MinioService],
})
export class AttendanceServiceModule {}
