import * as wrapper from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import * as axios from 'axios'
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AxiosRequest {
    private client: any;
    private jar: CookieJar;

    constructor() {

        this.jar = new CookieJar();
        this.client = wrapper.wrapper(axios.default.create({ jar: this.jar }));
    }

    async postRequest<T>(args: new () => T, url: string, config: {}, data: {}) {
        var response = await this.client.post(url, config, data)
        if (args) {
            return plainToClass(args, response.data);
        }
        return response.data;
        // return await response.data;
    }

    async getRequest<T>(args: new () => T, url: string, config: {}, data: {}) {
        var response = await this.client.get(url, config, data);
        if (args) {
            return plainToClass(args, response.data);
        }
        return response.data;
    }


}