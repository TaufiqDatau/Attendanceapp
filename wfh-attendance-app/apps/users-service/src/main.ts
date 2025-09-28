import { NestFactory } from '@nestjs/core';
import { UsersServiceModule } from './users-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UsersServiceModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002, // Port for internal communication
    },
  });
  await app.listen();
  console.log('Users microservice is listening');
}
bootstrap();
