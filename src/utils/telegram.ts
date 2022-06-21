import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv';
import { Crawler } from './crawler';
import { DatabaseManager } from './database';
dotenv.config();


@Injectable()
export class TelegramManager {

    public token = process.env.TELEGRAM_TOKEN;
    public slave_token = process.env.TELEGRAM_SLAVER;
    public bot = null;
    public slave_bot = null;

    constructor(crawler: Crawler) {
        if (this.token) {
            this.bot = new TelegramBot(this.token, { polling: true });
        }
        if (this.slave_token) {
            this.slave_bot = new TelegramBot(this.slave_token, { polling: true });

            this.slave_bot.on('message', async (msg) => {
                // const chatId = msg.chat.id;
                const command = msg;
                if (command) {
                    let add_command = command.text.split(' ');
                    if (add_command.length == 1) {
                        if (add_command[0] == "/help") {
                            await this.slaveOnText(-614444961, `
                            /add id product_id
                            `)
                        }
                    }
                    if (add_command.length == 2) {
                        if (add_command[0].indexOf("/") == 0) {
                            if (add_command[0] == "/add") {
                                // await appService.test()
                            }
                        }
                    }
                }
            });
        }
    }
    public async onText(group, message) {
        if (this.token) {
            this.bot.sendMessage(group, message);
        }
    }
    public async slaveOnText(group, message) {
        if (this.slave_token) {
            this.slave_bot.sendMessage(group, message);
        }
    }
}
