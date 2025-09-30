import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalRpcExceptionFilter } from 'apps/api-gateway/src/filters/rpc-exceptions.filters';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService); // Get ConfigService instance

  // Configure CORS from environment variables
  console.log(configService.get<string>('FRONTEND_URL'));
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'), // Use env var
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalRpcExceptionFilter());

  const port = configService.get<number>('API_GATEWAY_PORT') || 3000;
  await app.listen(port);
  console.log(`API Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
