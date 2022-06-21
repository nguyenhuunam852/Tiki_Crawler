import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  simpleStringify(object) {
    var simpleObject = {};
    for (var prop in object) {
      if (!object.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof (object[prop]) == 'object') {
        continue;
      }
      if (typeof (object[prop]) == 'function') {
        continue;
      }
      simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
  };

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
