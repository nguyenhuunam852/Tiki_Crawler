import { Injectable } from "@nestjs/common";
import { AxiosRequest } from "./axios_request"
import * as qs from "querystring"
import { rentrack_config } from "src/config/rentrack";

@Injectable()
export class RenTrack {
	public client: AxiosRequest;
	public eachPage: number;

	constructor() {
		this.client = new AxiosRequest();
	}
	getToken(response: any) {
		var start_position = response.indexOf('window.rtConvertLinkInit = function() {\r\n        return {\r\n            token: ');
		var sub_string_1 = response.substring(start_position, start_position + 200);
		var start_string = "token: ";
		var start_of_token = sub_string_1.indexOf('token: "');

		var token = sub_string_1.substring(start_of_token + start_string.length + 1, start_of_token + 55);
		return token;
	}

	async requestRenTrackConvert(urlList: string[]) {
		var data = {
			"idMailaddress": process.env.idMailaddress,
			"idLoginPassword": process.env.idLoginPassword,
			"idButton": process.env.idButton
		}
		await this.client.postRequest(rentrack_config.login_link, qs.stringify(data), {})

		var response = await this.client.getRequest(rentrack_config.smart_convert, {}, {});
		// console.log(response);

		let token = this.getToken(response);
		let t = (+ new Date()).toString();

		console.log(token)

		let convertData = {
			"site_id": "10335",
			"url": urlList,
			"shortlink": 1
		}

		console.log(convertData)

		var response = await this.client.postRequest(rentrack_config.convert_link.replace(':token', token).replace(':t', t), convertData, {})
		return response;

	}

}

