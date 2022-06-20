import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { Crawler } from './utils/crawler';
import { AxiosRequest } from './utils/axios_request';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './entities/tiki_books';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
    DatabaseModule,
  TypeOrmModule.forFeature([Books])
  ],
  controllers: [AppController],
  providers: [AppService, AxiosRequest, Crawler],
})
export class AppModule { }
