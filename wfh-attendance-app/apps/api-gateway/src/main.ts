import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalRpcExceptionFilter } from 'apps/api-gateway/src/filters/rpc-exceptions.filters';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  // Configure CORS for a specific origin
  app.enableCors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
