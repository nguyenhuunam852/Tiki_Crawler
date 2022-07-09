import { Injectable } from "@nestjs/common";
import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { tikiMonitoringService } from "../tiki_monitoring/tiki_monitoring.service";
dotenv.config();

@Injectable()
export class TelegramService {
    private buyer_token: string;
    private buyer_bot: TelegramBot

    constructor(private readonly tikiMonitoringService: tikiMonitoringService) {
        this.buyer_token = process.env.TELEGRAM_MONITORING;
        console.log(this.buyer_token)
        if (this.buyer_token) {
            this.buyer_bot = new TelegramBot(this.buyer_token, { polling: true });

            this.buyer_bot.on('message', async (msg) => {
                const command = msg;
                if (command) {
                    try {
                        let add_command = command.text.split(' ');
                        console.log(add_command)
                        if (add_command.length == 1) {
                            if (add_command[0] == "/help") { }
                        }
                        if (add_command.length == 2) {
                            if (add_command[0].indexOf("/") == 0) {
                                if (add_command[0] == "/huy") {
                                    let spid = + add_command[1];
                                    this.tikiMonitoringService.removeMonitoring(spid);
                                }
                            }
                        }
                        if (add_command.length == 4) {
                            if (add_command[0].indexOf("/") == 0) {
                                if (add_command[0] == "/buy") {
                                    let id = + add_command[1];
                                    let spid = + add_command[2];
                                    let time = + add_command[3];
                                    this.tikiMonitoringService.Monitoring(id, spid, time);
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            });
        }

    }




}