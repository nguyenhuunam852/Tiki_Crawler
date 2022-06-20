import { Injectable } from "@nestjs/common";
import { tiki_config } from "src/config/tiki_config";
import { TikiBooks } from "src/dto/book";
import { AxiosRequest } from "./axios_request"
import { ConvertJSON } from "./converter";

@Injectable()
export class Crawler {
    public client: AxiosRequest;
    public eachPage: number;

    constructor() {
        this.eachPage = 10;
        this.client = new AxiosRequest();
    }


    async getListBook(page: number): Promise<TikiBooks[]> {
        let numberPage: number = page * this.eachPage + this.eachPage;
        var response = await this.client.getRequest(tiki_config.base_url_light_novel.replace(':page', numberPage.toString()), {}, {});
        let tiki_book = response.data.splice(page * this.eachPage, numberPage).map(item => {
            return ConvertJSON.convertTikiBooktoDto(item);
        });
        return tiki_book;
    }


}

