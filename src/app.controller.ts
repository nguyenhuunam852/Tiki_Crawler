import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getNewestBook() {
    let result = await this.appService.getListBooks();
    if (result) {
      return result.splice(0, result.length - 1);
    }
    return "errors";
  }


  @Get('test')
  async getNewestTikiTrading() {
    let result = await this.appService.getListBookTikiTrading();
    if (result) {
      return result.splice(0, result.length - 1);
    }
    return "errors";
  }

}
