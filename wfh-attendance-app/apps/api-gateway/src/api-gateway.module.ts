import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // Register the microservice clients
    ClientsModule.register([
      {
        // This name is the injection token for the client
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          // These should match the host and port of your auth-service
          host: 'localhost',
          port: 3001, // A common port for a secondary service
        },
      },
      {
        // This name is the injection token for the client
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          // These should match the host and port of your auth-service
          host: 'localhost',
          port: 3002, // A common port for a secondary service
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
