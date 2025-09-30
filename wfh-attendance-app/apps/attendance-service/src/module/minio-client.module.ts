import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'minio';

export const MINIO_CLIENT = 'MINIO_CLIENT';

@Module({
  providers: [
    {
      provide: MINIO_CLIENT,

      // The useFactory allows us to inject the ConfigService to read from .env
      useFactory: (configService: ConfigService) => {
        const minioEndpoint = configService.get('MINIO_ENDPOINT');
        console.log(
          `Attempting to connect to Minio endpoint: ${minioEndpoint}`,
        );
        console.log(configService.get('MINIO_USE_SSL'));
        console.log(configService.get('MINIO_ACCESS_KEY'));
        console.log(configService.get('MINIO_SECRET_KEY'));
        return new Client({
          endPoint: configService.get('MINIO_ENDPOINT')!,
          useSSL: configService.get('MINIO_USE_SSL') === 'true',
          accessKey: configService.get('MINIO_ACCESS_KEY'),
          secretKey: configService.get('MINIO_SECRET_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
  // Export the provider so it can be used in other modules
  exports: [MINIO_CLIENT],
})
export class MinioClientModule { }
