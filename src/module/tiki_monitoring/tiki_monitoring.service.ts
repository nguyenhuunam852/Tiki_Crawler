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

        this.crawlByTime();
    }

    async Monitoring(spid: number, time: number) {
        let data = {
            spid: spid,
            time: + time,
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

        console.log(result)

        if (result.stock_item) {
            if (result.stock_item.qty) {
                console.log(result.stock_item.qty)
            }
        }

        return result.stock_item.qty;
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async crawlByTime() {
        while (true) {
            let monitoringList = this.excuteContext.data["monitoring"];
            console.log(monitoringList)
            for (let item of monitoringList) {
                await this.delay(1000);
                try {
                    let difTime = Math.abs((+new Date() - item.insertTime));
                    if (difTime > item.time) {
                        await this.checkStock(item.spid);
                        item.insertTime = + new Date();
                        this.excuteContext.updateData("monitoring", ["spid"], item, this.excuteContext, true);
                        this.excuteContext.saveFile("monitoring");
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
    }









}
