import { tiki_config } from "src/config/tiki_config";
import { AxiosRequest } from "./axios_request"

export class Crawler {
    public client: AxiosRequest;

    constructor() {
        this.client = new AxiosRequest();
    }

    async getListBook() {
        var response = await this.client.getRequest(tiki_config.base_url_light_novel, {}, {});
        return response;
    }
}

