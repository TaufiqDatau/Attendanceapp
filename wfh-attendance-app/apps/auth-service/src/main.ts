import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthServiceModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001, // Port for internal communication
    },
  });
  await app.listen();
  console.log('Authentication microservice is listening');
}
bootstrap();
