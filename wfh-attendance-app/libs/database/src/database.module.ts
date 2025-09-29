// libs/database/src/database.module.ts

import { MYSQL_CONNECTION } from '@app/database/constant';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

// This is the custom provider for our MySQL connection pool
const dbProvider = {
  provide: MYSQL_CONNECTION, // The injection token
  inject: [ConfigService], // Inject ConfigService to get credentials
  useFactory: async (configService: ConfigService) => {
    // useFactory creates and returns the connection pool
    console.log('DB HOST', configService.get<string>('DB_HOST'));
    console.log('DB PORT', configService.get<string>('DB_PORT'));
    const pool = mysql.createPool({
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      user: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    return pool;
  },
};

@Module({
  providers: [dbProvider], // Add the provider to the module
  exports: [dbProvider], // Export the provider so other modules can use it
})
export class DatabaseModule {}
