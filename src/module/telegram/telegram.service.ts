import { Injectable } from "@nestjs/common";
import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class TelegramService {
    private buyer_token: string;
    private buyer_bot: TelegramBot

    constructor() {
        this.buyer_token = process.env.TELEGRAM_MONITORING;
        if (this.buyer_token) {
            this.buyer_bot = new TelegramBot(this.buyer_token, { polling: true });

            this.buyer_bot.on('message', async (msg) => {
                const command = msg;
                if (command) {
                    let add_command = command.text.split(' ');
                    if (add_command.length == 1) {
                        if (add_command[0] == "/help") { }
                    }
                    if (add_command.length == 2) {
                        if (add_command[0].indexOf("/") == 0) {
                            if (add_command[0] == "/buy") {
                            }
                        }
                    }
                }
            });
        }

    }




}