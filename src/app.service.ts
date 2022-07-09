import { Injectable } from '@nestjs/common';
import { Crawler } from './utils/crawler';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from './entities/tiki_books';
import { Repository } from 'typeorm';
import { enumProvider } from "src/enum/provider.enum";
import { listenerCount } from 'process';
import { TelegramManager } from './utils/telegram';
import { RenTrack } from './utils/rentrack';
import { tiki_config } from './config/tiki_config';
import { DatabaseManager } from './utils/database';


@Injectable()
export class AppService {
  constructor() { }

}
