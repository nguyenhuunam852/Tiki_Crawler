import { Injectable } from '@nestjs/common';
import { Crawler } from './utils/crawler';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from './entities/tiki_books';
import { Repository } from 'typeorm';
import { enumProvider } from "src/enum/provider.enum";
import { listenerCount } from 'process';
import { TelegramManager } from './utils/telegram';


@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Books)
    private readonly bookRepo: Repository<Books>
    , private readonly crawler: Crawler) {

    this.crawlByTime()

  }
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  getMaxByType(types) {
    return `select * from books having id in (select Max(id) from books where providers = '${types}')`
  }

  async createNewObject(data, type) {
    var newObject = new Books();
    newObject.book_id = data.id;
    newObject.book_name = data.name;
    newObject.providers = type;
    return await this.bookRepo.save(newObject);
  }

  async getListBooks(page: number = 0) {
    let lastestBook = [];
    let data = await this.crawler.getListBook(page);
    let getLastestBook = await this.bookRepo.query(this.getMaxByType(enumProvider.tiki_light_novel));

    if (!getLastestBook.length) {
      lastestBook.push(await this.createNewObject(data[0], enumProvider.tiki_light_novel));
    }
    else {
      var getLastestId = getLastestBook[0].book_id;
      let keepCrawling = true;
      for (var book of data) {
        if (book.id == getLastestId) {
          keepCrawling = false;
          break;
        }
        lastestBook.push(await this.createNewObject(book, enumProvider.tiki_light_novel));
      }
      if (keepCrawling) {
        lastestBook.concat(this.getListBooks(page += 1));
      }
    }

    console.log(lastestBook)

    return lastestBook;
  }

  async getListBooksLocal() {
    let getListBook = await this.bookRepo.find();
    return getListBook;
  }

  async crawlByTime() {
    while (true) {
      await this.delay(180000);
      let listBooks = await this.getListBooks();
      if (listBooks.length > 0) {
        for (let book of listBooks) {
          await TelegramManager.ontext(+ process.env.GROUP_ID, "new book " + book.book_name);
          await this.delay(1000);
        }
      }
    }
  }
}
