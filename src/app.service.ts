import { Injectable } from '@nestjs/common';
import { Crawler } from './utils/crawler';

@Injectable()
export class AppService {
  constructor(private readonly crawler: Crawler) { }

  async getHello() {
    var reponse = await this.crawler.getListBook();
    return reponse.data;
  }
}
