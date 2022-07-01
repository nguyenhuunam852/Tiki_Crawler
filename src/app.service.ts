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
  constructor(
    // @InjectRepository(Books)
    // private readonly bookRepo: Repository<Books>
    private readonly crawler: Crawler
    , private readonly rentrack: RenTrack
    , private readonly telegram: TelegramManager
    , private readonly database: DatabaseManager
  ) {

    // this.crawlByTime()

  }
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getListBooks(page: number = 0): Promise<Books[]> {
    let lastestBook = [];
    let convertLink = [];
    let data = await this.crawler.getListBook(page);
    let getLastestBook = await this.database.query(this.database.getMaxByType(enumProvider.tiki_light_novel));

    if (!getLastestBook.length) {
      data[0]["book_id"] = data[0].id;
      data[0]["book_name"] = data[0].name;
      data[0]["book_url"] = data[0].url_path;
      data[0]["id"] = null;

      // data[0].providers = book.providers;
      lastestBook.push(await this.database.saveEntities(Books, data[0]));
    }
    else {
      var getLastestId = getLastestBook[0].book_id;
      let keepCrawling = true;
      for (var book of data) {
        if (book.id == getLastestId) {
          keepCrawling = false;
          break;
        }
        book["book_id"] = book.id;
        book["book_name"] = book.name;
        book["book_url"] = book.url_path;
        book["id"] = null;

        book.providers = enumProvider.tiki_light_novel;
        lastestBook.push(await this.database.saveEntities(Books, book));
      }
      if (keepCrawling) {
        lastestBook.concat(this.getListBooks(page += 1));
        return lastestBook;
      }
    }
    // if (lastestBook.length > 0) {
    //   let urlList = lastestBook.map(item => tiki_config.redirect_link.replace(':url', item.book_url));
    //   convertLink = await this.rentrack.requestRenTrackConvert(urlList);
    //   lastestBook.forEach((item, index) => {
    //     item.book_short_link = convertLink['data'][urlList[index]].shortlink
    //   })
    //   lastestBook.push(await this.database.saveEntities(Books, lastestBook));
    // }

    return lastestBook;
  }

  // async getListBooksLocal() {
  //   let getListBook = await this.bookRepo.find();
  //   return getListBook;
  // }

  async crawlByTime() {
    while (true) {
      await this.delay(180000);
      let listBooks = await this.getListBooks();
      if (listBooks.length > 0) {
        for (let book of listBooks) {
          await this.telegram.onText(+ process.env.GROUP_ID, `Sách mới ${book.book_name} \n link: ${book.book_short_link}`);
          await this.delay(1000);
        }
        // await TelegramManager.ontext(+ process.env.GROUP_ID, "new book " + book.book_name);
        // await this.delay(1000);

      }
    }
  }
}
