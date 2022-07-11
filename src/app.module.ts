import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { tikiMonitoringService } from './module/tiki_monitoring/tiki_monitoring.service';
import { Local_Storage_Management } from './utils/local_storage';
import { TelegramService } from './module/telegram/telegram.service';
import { tikiBuyingService } from './module/tiki_buying/tiki_buying.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [tikiMonitoringService, tikiBuyingService, Local_Storage_Management, TelegramService],
})
export class AppModule { }
