import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import '../utils/polyfill';

dotenv.config();

const DatabaseConfig = {
  name: 'default',
  type: process.env.DB_CLIENT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  extra: {
    charset: "utf8mb4_unicode_ci"
  },
  synchronize: process.env.SYNC === 'true' ? true : false,
  entities: [join(__dirname, '..', 'entities', '**', '*.{ts,js}')],
} as TypeOrmModuleAsyncOptions;

export default DatabaseConfig;
