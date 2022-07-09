import { Injectable } from "@nestjs/common";
import { AxiosRequest } from "src/utils/axios_request";
import * as uuid from "uuid";
import * as randomUseragent from "random-useragent";
import { Local_Storage_Management } from "src/utils/local_storage";

@Injectable()
export class tikiBuyingService {
    public client: AxiosRequest;
    public urlLink: {};
    public headers: {};
    public devide_id = "";
    public username = "";
    public agent = "";
    constructor(private readonly excuteContext: Local_Storage_Management) {
        this.urlLink = {
            base: "https://tiki.vn/",
            login: "api/v3/tokens"
        };
        this.client = new AxiosRequest();
        this.devide_id = uuid.v4();
        this.headers = {
            "User-Agent": randomUseragent.getRandom()
        }
    }

    async Login(username: string, password: string) {
        try {
            this.username = username;
            let data = {
                username: this.username
            }
            let callback = this.excuteContext.insertData;
            let checkExist = this.excuteContext.checkExisted("user_account", ["username"], data, callback);
            if (checkExist) {
                this.excuteContext.saveFile("user_account");
            }
            if (!checkExist.headers) {
                let body = {
                    "grant_type": "password",
                    "email": username,
                    "password": password,
                    "device_id": this.devide_id
                }
                let result = await this.client.postRequest(undefined, `${this.urlLink["base"]}${this.urlLink["login"]}`, {
                    headers: this.headers
                }, body);

                if (result.access_token) {
                    this.headers["x-access-token"] = result.access_token;
                    let data = {
                        username: this.username,
                        headers: this.headers
                    }
                    this.excuteContext.updateData("user_account", ["username"], data, this.excuteContext, true);
                }
            }
            else {
                this.headers = checkExist.headers;
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }

    async buyProduct(spid: number) {
        try {

        }
        catch (e) {
            return false;
        }
    }

}
