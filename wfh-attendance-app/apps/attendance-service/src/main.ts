// wfh-attendance-app/apps/attendance-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AttendanceServiceModule } from './attendance-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    AttendanceServiceModule,
  );
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice(AttendanceServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Listen on all interfaces
      port: configService.get<number>('ATTENDANCE_SERVICE_PORT'),
    },
  });
  await app.listen();
  console.log('Attendance microservice is listening');
}
bootstrap();
