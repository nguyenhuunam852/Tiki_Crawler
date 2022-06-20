import { Inject, Injectable } from "@nestjs/common";
import { tiki_config } from "src/config/tiki_config";
import { AxiosRequest } from "./axios_request"
import { ConvertJSON } from "./converter";

@Injectable()
export class Crawler {
    public client: AxiosRequest;

    constructor(private readonly axiosRequest: AxiosRequest) { }

    async getListBook() {
        var response = await this.axiosRequest.getRequest(tiki_config.base_url_light_novel, {}, {});
        let tiki_book = response.data.map(item => {
            return ConvertJSON.convertTikiBooktoDto(item);
        })
        return tiki_book;
    }
}

