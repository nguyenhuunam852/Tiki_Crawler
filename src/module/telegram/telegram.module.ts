import { Module } from '@nestjs/common';
import { Crawler } from 'src/utils/crawler';
import { DataSource, DataSourceOptions } from 'typeorm';
import { tikiMonitoringService } from '../tiki_monitoring/tiki_monitoring.service';

@Module({
    imports: [],
    controllers: [],
    providers: [tikiMonitoringService],
})
export class TelegramModule { }
