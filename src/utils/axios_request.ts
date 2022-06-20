import * as parse from 'node-html-parser'
import * as wrapper from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import * as axios from 'axios'
import { tiki_config } from 'src/config/tiki_config';


export class AxiosRequest {
    private client: any;
    private jar: CookieJar;

    constructor() {

        this.jar = new CookieJar();
        this.client = wrapper.wrapper(axios.default.create({ jar: this.jar }));
    }

    async postRequest() {

    }

    async getRequest(url: string, config: {}, data: {}) {
        var response = await this.client.get(url, config, data)
        return await response.data;
    }


}