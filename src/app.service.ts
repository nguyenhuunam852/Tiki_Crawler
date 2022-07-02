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
  public listTrading: object[];

  constructor(
    // @InjectRepository(Books)
    // private readonly bookRepo: Repository<Books>
    private readonly crawler: Crawler
    , private readonly rentrack: RenTrack
    , private readonly telegram: TelegramManager
    , private readonly database: DatabaseManager
  ) {
    this.listTrading = [
      {
        provider: "tiki_trading_dong_tinh",
        url: tiki_config.tiki_trading_dong_tinh
      },
      {
        provider: "tiki_trading_tranh_truyen",
        url: tiki_config.tiki_trading_tranh_truyen
      },
      {
        provider: "tiki_trading_light_novel",
        url: tiki_config.tiki_trading_light_novel
      },
      {
        provider: "tiki_trading_ngon_tinh",
        url: tiki_config.tiki_trading_ngon_tinh
      },
      {
        provider: "tiki_trading_manga",
        url: tiki_config.tiki_trading_manga
      }
    ]


    this.crawlByTime()

  }
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getListBooks(page: number = 0): Promise<Books[]> {
    try {
      let lastestBook = [];
      let convertLink = [];
      let data = await this.crawler.getListBook(page);
      let getLastestBook = await this.database.query(this.database.getMaxByType(enumProvider.tiki_light_novel));
      if (!getLastestBook.length) {
        data[0]["book_id"] = data[0].id;
        data[0]["book_name"] = data[0].name;
        data[0]["book_url"] = data[0].url_path;

        let checkObject = await this.database.findOne(Books, { book_id: data[0].id });
        if (checkObject) {
          data[0]["id"] = checkObject.id.toString()
        }
        else {
          data[0]["id"] = null;
        }
        lastestBook.push(data[0]);
        // data[0].providers = book.providers;
      }
      else {
        var getLastestId = getLastestBook[0].book_id;
        let keepCrawling = true;

        for (var book of data) {

          if (+book.id == + getLastestId || page == 10) {
            keepCrawling = false;
            break;
          }

          book["book_id"] = book.id;
          book["book_name"] = book.name;
          book["book_url"] = book.url_path;
          let checkObject = await this.database.findOne(Books, { book_id: book.id });
          if (checkObject) {
            book["id"] = checkObject.id.toString()
          }
          else {
            book["id"] = null;
          }

          book.providers = enumProvider.tiki_light_novel;
          lastestBook.push(book);
        }
        if (keepCrawling) {
          lastestBook.concat(this.getListBooks(page += 1));
          return lastestBook;
        }
      }
      if (lastestBook.length > 0) {
        let urlList = lastestBook.map(item => tiki_config.redirect_link.replace(':url', item.book_url));
        convertLink = await this.rentrack.requestRenTrackConvert(urlList);
        lastestBook.forEach((item, index) => {
          item.book_short_link = convertLink['data'][urlList[index]].shortlink
        })

        await this.database.saveEntities(Books, lastestBook)

        for (let book of lastestBook) {
          await this.telegram.onText(+ process.env.GROUP_ID, `Sách mới ${book.book_name} \n link: ${book.book_short_link}`);
          await this.delay(1000);
        }
      }

      return lastestBook;
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }


  async getListBookTikiTrading() {
    let lastestBookTrading = [];
    let convertLink = [];

    for (let url of this.listTrading) {
      let lastestBook = [];

      var data = await this.crawler.getListBookTikiTrading(url["url"], url["provider"]);
      let getLastestBook = await this.database.query(this.database.getMaxByType(enumProvider[url["provider"]]));
      console.log(getLastestBook)
      if (!getLastestBook.length) {
        data[0]["book_id"] = data[0].id;
        data[0]["book_name"] = data[0].name;
        data[0]["book_url"] = data[0].url_path;
        data[0]["day_ago"] = await this.crawler.getDayAgo(+ data[0]["book_id"]);

        let checkObject = await this.database.findOne(Books, { book_id: data[0].id });
        if (checkObject) {
          data[0]["id"] = checkObject.id.toString()
        }
        else {
          data[0]["id"] = null;
        }
        lastestBook.push(data[0]);
      }
      else {
        var getLastestDay = getLastestBook[0].day_ago;
        console.log("Last:" + getLastestBook[0].book_id)

        for (var book of data) {
          book["book_id"] = book.id;
          book["book_name"] = book.name;
          book["book_url"] = book.url_path;
          book["day_ago"] = await this.crawler.getDayAgo(+ data[0]["book_id"]);
          console.log(book["book_id"])

          if (book["day_ago"] >= getLastestDay || book["book_id"] == getLastestBook[0].book_id) {
            break;
          }
          let checkObject = await this.database.findOne(Books, { book_id: book.id });
          if (checkObject) {
            book["id"] = checkObject.id.toString()
          }
          else {
            book["id"] = null;
          }
          lastestBook.push(book);
        }
      }
      if (lastestBook.length > 0) {
        let urlList = lastestBook.map(item => tiki_config.redirect_link.replace(':url', item.book_url));
        convertLink = await this.rentrack.requestRenTrackConvert(urlList);
        lastestBook.forEach((item, index) => {
          item.book_short_link = convertLink['data'][urlList[index]].shortlink
        })

        await this.database.saveEntities(Books, lastestBook);
      }

      lastestBookTrading = lastestBookTrading.concat(lastestBook);
    }
    console.log(lastestBookTrading)
    // if (lastestBookTrading.length) {
    //   for (let book of lastestBookTrading) {
    //     await this.telegram.onText(+ process.env.GROUP_ID, `Sách mới ${book.book_name} \n link: ${book.book_short_link} \n thể loại: ${book.providers}`);
    //     await this.delay(1000);
    //   }
    // }

    return lastestBookTrading;
  }

  async crawlByTime() {
    while (true) {
      await this.delay(180000);
      try {
        await this.getListBooks();
        await this.delay(2000);
        await this.getListBookTikiTrading();
      }
      catch (e) {
        console.log(e);
      }
    }
  }
}
