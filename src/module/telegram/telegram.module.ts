import { Module } from '@nestjs/common';
import { Crawler } from 'src/utils/crawler';
import { DataSource, DataSourceOptions } from 'typeorm';
import { tikiBuyingService } from '../tiki_buying/tiki_buying.service';
import { tikiMonitoringService } from '../tiki_monitoring/tiki_monitoring.service';

@Module({
    imports: [],
    controllers: [],
    providers: [tikiMonitoringService, tikiBuyingService],
})
export class TelegramModule { }
