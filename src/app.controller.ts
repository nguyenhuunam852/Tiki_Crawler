import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getNewestBook() {
    return await this.appService.getListBooks();
  }

  @Get('local')
  async getNewestBookLocal() {
    return await this.appService.getListBooksLocal();
  }

}
