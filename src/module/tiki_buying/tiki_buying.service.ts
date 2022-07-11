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
            login: "api/v3/tokens",
            addCart: "api/v2/carts/mine/items",
            getCartInfo: "api/v2/intended_cart/items?reset=false&page=1&page_size=30",
            selectItem: "api/v2/intended_cart/items/update",
            checkout: "api/v2/intended_cart/checkout?reset=false",
            summary: "api/v2/intended_cart/summary?reset=false",
            shippingAddress: "api/v2/carts/mine/shippings_addresses/:id",
            codPaymentMethod: "api/v2/carts/mine/payment_methods/cod",
            checkoutPaymentDone: "api/v2/carts/mine/checkout"
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
            let body = {
                "grant_type": "password",
                "email": this.username,
                "password": password,
                "device_id": this.devide_id
            }
            let result = await this.client.postRequest(undefined, `${this.urlLink["base"]}${this.urlLink["login"]}`, {
                headers: this.headers
            }, body);
            if (result.access_token) {
                this.headers["x-access-token"] = result.access_token;
                return this;
            }
            return null;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    async addToCart(spid: number, amount: number) {
        try {
            let body = {
                "products": [
                    {
                        "product_id": spid,
                        "qty": amount
                    }
                ]
            }
            let result = await this.client.postRequest(undefined, `${this.urlLink["base"]}${this.urlLink["addCart"]}`, {
                headers: this.headers
            }, body);
            if (result.error) {
                if (result.error.code == 428) {
                    return this.addToCart(spid, amount)
                }
                throw "error"
            }
            return this;
        }
        catch (e) {
            return null;
        }
    }
    async getCartInfo(spid: number) {
        try {
            let result = await this.client.getRequest(undefined, `${this.urlLink["base"]}${this.urlLink["getCartInfo"]}`, {
                headers: this.headers
            }, {});
            let resultArray = []

            result.items.forEach(element => {
                if (+element.product_id == spid) {
                    resultArray.push({
                        seller_id: element.seller_id,
                        item_id: element.id,
                        product_id: element.product_id,
                        parent_item_id: element.parent_item_id,
                        selected: true
                    })
                }
            });

            return resultArray;
        }
        catch (e) {
            return null;
        }
    }
    async selectItem(body: any) {
        let result = await this.client.putRequest(undefined, `${this.urlLink["base"]}${this.urlLink["selectItem"]}`, {
            headers: this.headers
        }, body);
        return result;
    }
    async checkoutBuying() {
        let result = await this.client.getRequest(undefined, `${this.urlLink["base"]}${this.urlLink["checkout"]}`, {
            headers: this.headers
        }, {});
        return result;
    }
    async summaryBuying() {
        let result = await this.client.getRequest(undefined, `${this.urlLink["base"]}${this.urlLink["summary"]}`, {
            headers: this.headers
        }, {});
        return result;
    }
    async shippingAddress(id: string) {
        let result = await this.client.putRequest(undefined, `${this.urlLink["base"]}${this.urlLink["shippingAddress"].replace(":id", id)}`, {
            headers: this.headers
        }, {});
        return result;
    }
    async changePaymentMethod() {
        let result = await this.client.putRequest(undefined, `${this.urlLink["base"]}${this.urlLink["codPaymentMethod"]}`, {
            headers: this.headers
        }, {});
        return result;
    }
    async checkoutPayment() {
        let result = await this.client.putRequest(undefined, `${this.urlLink["base"]}${this.urlLink["codPaymentMethod"]}`, {
            headers: this.headers
        }, {});
        return result;
    }
    async checkoutPaymentDone() {
        let result = await this.client.postRequest(undefined, `${this.urlLink["base"]}${this.urlLink["checkoutPaymentDone"]}`, {
            headers: this.headers
        }, {
            "payment": {
                "method": "cod",
                "option_id": null
            },
            "tax_info": null,
            "cybersource_information": {},
            "customer_note": "",
            "delivery_option": null,
            "order_notes": ""
        });
        return result;
    }


    async buyProduct(username: string, password: string, spid: number, amount: number) {
        try {
            let result = (await (await (await this.Login(username, password)).addToCart(spid, amount)).getCartInfo(spid));
            if (result.length) {
                let body = {
                    items: result
                }
                await this.selectItem(body)
                await this.checkoutBuying();
                let summary = await this.summaryBuying();
                if (!summary.shipping_address) {
                    throw "errors"
                }
                let address_id = summary.shipping_address.address_id;
                await this.shippingAddress(address_id);
                await this.changePaymentMethod();
                let lastResult = await this.checkoutPaymentDone();
                console.log(lastResult)
            }
        }
        catch (e) {
            return false;
        }
    }

}
