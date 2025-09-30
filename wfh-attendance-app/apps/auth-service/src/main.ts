import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext =
    await NestFactory.createApplicationContext(AuthServiceModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice(AuthServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Listen on all interfaces
      port: configService.get<number>('AUTH_SERVICE_PORT'),
    },
  });
  await app.listen();
  console.log('Authentication microservice is listening');
}
bootstrap();
