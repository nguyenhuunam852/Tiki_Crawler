import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { Crawler } from './utils/crawler';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
    // DatabaseModule,
    // Crawler
  ],
  controllers: [AppController],
  providers: [AppService, Crawler],
})
export class AppModule { }
