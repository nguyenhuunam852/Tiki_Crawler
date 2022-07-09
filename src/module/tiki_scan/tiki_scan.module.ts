
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import DatabaseConfig from 'src/config/database';
import { Crawler } from 'src/utils/crawler';
import { DatabaseManager } from 'src/utils/database';
import { RenTrack } from 'src/utils/rentrack';
import { TelegramManager } from 'src/utils/telegram';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
    imports: [],
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
export class tikiScanModule { }
