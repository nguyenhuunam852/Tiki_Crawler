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
        try {
            var response = await this.client.post(url, data, config)
            if (args) {
                return plainToClass(args, response.data);
            }
            return response.data;
        }
        catch (e) {
            console.log(e.response.data)
            if (!e.response.data) {
                return e;
            }
            return e.response.data;
        }
    }

    async getRequest<T>(args: new () => T, url: string, config: {}, data: {}) {
        try {
            var response = await this.client.get(url, config);
            if (args) {
                return plainToClass(args, response.data);
            }
            return response.data;
        }
        catch (e) {
            console.log(e.response.data)
            if (e.response.data) {
                return e;
            }
            return e.response.data;
        }
    }

    async putRequest<T>(args: new () => T, url: string, config: {}, data: {}) {
        try {
            var response = await this.client.put(url, data, config);
            if (args) {
                return plainToClass(args, response.data);
            }
            return response.data;
        }
        catch (e) {

            console.log(e.response.data)
            if (e.response.data) {
                return e;
            }
            return e.response.data;
        }
    }



}