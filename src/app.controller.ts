import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getNewestBook() {
    let result = await this.appService.getListBooks();
    return result.splice(0, result.length - 1);
  }

  // @Get('local')
  // async getNewestBookLocal() {
  //   return await this.appService.getListBooksLocal();
  // }

}
