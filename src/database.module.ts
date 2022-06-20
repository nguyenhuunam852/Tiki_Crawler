/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import DatabaseConfig from './config/database';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory() {
                const options = DatabaseConfig;
                return options as TypeOrmModuleAsyncOptions;
            },
        }),
    ],
})
export class DatabaseModule {}
