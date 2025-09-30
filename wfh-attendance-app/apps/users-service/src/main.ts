import { NestFactory } from '@nestjs/core';
import { UsersServiceModule } from './users-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext =
    await NestFactory.createApplicationContext(UsersServiceModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice(UsersServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Listen on all interfaces
      port: configService.get<number>('USERS_SERVICE_PORT'),
    },
  });
  await app.listen();
  console.log('Users microservice is listening');
}
bootstrap();
