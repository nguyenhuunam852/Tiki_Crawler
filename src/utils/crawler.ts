import { Injectable } from "@nestjs/common";
import { tiki_config } from "src/config/tiki_config";
import { TikiBooks, TikiBooksList, TikiBooksWithStock } from "src/dto/book";
import { enumProvider } from "src/enum/provider.enum";
import { AxiosRequest } from "./axios_request"
import { ConvertJSON } from "./converter";

@Injectable()
export class Crawler {
    public client: AxiosRequest;
    public eachPage: number;
    public listTrading: object[];

    constructor() {
        this.eachPage = 10;
        this.client = new AxiosRequest();
    }


    async getListBook(page: number): Promise<TikiBooks[]> {
        let numberPage: number = page * this.eachPage + this.eachPage;
        var response = await this.client.getRequest(TikiBooksList, tiki_config.base_url_light_novel.replace(':page', numberPage.toString()), {}, {});
        let tiki_book = response.data.splice(page * this.eachPage, numberPage).map(item => {
            return ConvertJSON.convertTikiBooktoDto(item);
        });
        return tiki_book;
    }

    async getDayAgo(Id: number): Promise<number> {
        var response = await this.client.getRequest(null, tiki_config.tiki_info.replace(':id', Id.toString()), {}, {});
        return + response.day_ago_created;
    }



    async getListBookTikiTrading(urlLink: string, provider: string): Promise<TikiBooks[]> {
        let numberPage: number = 10;
        var response = await this.client.getRequest(TikiBooksList, urlLink.replace(':page', numberPage.toString()), {
            headers: {
                "x-source": "local"
            }
        }, {});
        let tiki_book = response.data.splice(0, numberPage).map(item => {
            item.providers = enumProvider[provider];
            return ConvertJSON.convertTikiBooktoDto(item);
        });
        return tiki_book;
    }



    async getInfoOfBook(id: string, product_id: string): Promise<TikiBooksWithStock> {
        var response = await this.client.getRequest(null, tiki_config.tiki_info.replace(':id', id).replace(':spid', product_id), {}, {});
        console.log(response)
        return response;
    }


}

