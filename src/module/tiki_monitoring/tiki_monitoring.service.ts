import { Injectable } from "@nestjs/common";
import { AxiosRequest } from "src/utils/axios_request";
import * as uuid from "uuid";
import * as randomUseragent from "random-useragent";
import { Local_Storage_Management } from "src/utils/local_storage";
import { tikiBuyingService } from "../tiki_buying/tiki_buying.service";
import { tiki_config } from "src/config/tiki_config";
import { identity } from "rxjs";

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

        // this.crawlByTime();
    }

    Monitoring(id: number, spid: number, time: number) {
        let data = {
            origin_id: id,
            spid: spid,
            time: + time,
            insertTime: + new Date()
        }
        console.log(data);

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

    removeMonitoring(spid: number) {
        console.log("Destroy:" + spid.toString())
        let index = this.excuteContext.data["monitoring"].map(item => item.spid).indexOf(spid);
        console.log("Index:" + index)
        if (index > -1) {
            this.excuteContext.data["monitoring"].splice(index, 1);
            this.excuteContext.saveFile("monitoring");
        }
    }


    async checkStock(origin_id: number, spid: number) {
        let result = await this.client.getRequest(undefined, tiki_config.tiki_info.replace(":id", "" + origin_id).replace(":spid", "" + spid), {
            headers: this.headers
        }, {})
        if (result.stock_item) {
            if (result.stock_item.qty) {
                console.log(result.stock_item.qty)
            }
            return result.stock_item.qty;
        }
        else {
            let index = this.excuteContext.data["monitoring"].indexOf(item => item.spid == spid);
            if (index > -1) {
                this.excuteContext.data["monitoring"] = this.excuteContext.data["monitoring"].splice(index, 1);
                this.excuteContext.saveFile("monitoring");
            }
            return null;
        }
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async crawlByTime() {
        while (true) {
            let monitoringList = this.excuteContext.data["monitoring"];
            for (let item of monitoringList) {
                await this.delay(1000);
                try {
                    let difTime = Math.abs((+new Date() - item.insertTime));
                    if (difTime > item.time) {
                        console.log("Scanning:" + item.spid)
                        await this.checkStock(+ item.origin_id, + item.spid);
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
