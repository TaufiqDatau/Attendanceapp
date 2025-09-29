import { NestFactory } from '@nestjs/core';
import { AttendanceServiceModule } from './attendance-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AttendanceServiceModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3003,
    },
  });
  await app.listen();
  console.log('Attendance microservice is listening');
}
bootstrap();
