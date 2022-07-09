import { Injectable } from "@nestjs/common";
import { AxiosRequest } from "src/utils/axios_request";
import * as uuid from "uuid";
import * as randomUseragent from "random-useragent";
import { Local_Storage_Management } from "src/utils/local_storage";
import { tikiBuyingService } from "../tiki_buying/tiki_buying.service";
import { tiki_config } from "src/config/tiki_config";

@Injectable()
export class tikiMonitoringService {
    public listTikiBuyer: Array<tikiBuyingService>;
    public client: AxiosRequest;
    public headers: {};

    constructor(private readonly excuteContext: Local_Storage_Management) {
        this.listTikiBuyer = new Array<tikiBuyingService>();
        this.client = new AxiosRequest();
        this.headers = {
            "User-Agent": randomUseragent.getRandom()
        }
    }

    async Monitoring(spid: number, time: number) {
        let data = {
            spid: spid,
            time: time,
            insertTime: + new Date()
        }

        let callback = this.excuteContext.insertData;
        let newData = this.excuteContext.checkExisted("monitoring", ["spid"], data, callback);
        if (newData) {
            console.log("Add new Monitoring :" + spid.toString())
            this.excuteContext.saveFile("monitoring")
        }
        else {
            console.log("Add Monitoring :" + spid.toString())
            this.excuteContext.updateData("monitoring", ["spid"], data, this.excuteContext, true);
        }
    }

    async checkStock(spid: number) {
        let result = await this.client.getRequest(undefined, tiki_config.tiki_info, {
            headers: this.headers
        }, {})
    }









}
