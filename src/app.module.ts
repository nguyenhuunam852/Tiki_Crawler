import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { tikiMonitoringService } from './module/tiki_monitoring/tiki_monitoring.service';
import { Local_Storage_Management } from './utils/local_storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [tikiMonitoringService, Local_Storage_Management],
})
export class AppModule { }
