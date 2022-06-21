import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { Crawler } from './utils/crawler';
import { AxiosRequest } from './utils/axios_request';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './entities/tiki_books';
import { RenTrack } from './utils/rentrack';
import { TelegramManager } from './utils/telegram';
import { DatabaseManager } from './utils/database';
import DatabaseConfig from './config/database';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
    // TypeOrmModule.forFeature([Books])
  ],
  controllers: [AppController],
  providers: [AppService, Crawler, RenTrack, DatabaseManager,
    {
      useFactory: async (crawler: Crawler) => {
        return new TelegramManager(crawler);
      },
      provide: TelegramManager,
      inject: [Crawler]
    },
    {
      provide: 'DATA_SOURCE',
      useFactory: async () => {
        const dataSource = new DataSource(DatabaseConfig as DataSourceOptions);
        return dataSource.initialize();
      },
    }
  ],
})
export class AppModule { }
