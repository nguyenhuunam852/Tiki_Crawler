import * as TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
let bot = null;
console.log(token)
if (token) {
    bot = new TelegramBot(token, { polling: true });
    // bot.on('message', async (msg) => {
    //     const chatId = msg.chat.id;
    //     const command = msg;
    //     if (command) {
    //         console.log(command)
    //     }
    // });
}

export class TelegramManager {
    constructor() {

    }
    public static async ontext(group, message) {
        if (token) {
            try {
                bot.sendMessage(group, message);
            }
            catch (e) {
                console.log(e)
            }
        }
    }
}
