import * as TelegramBot from 'node-telegram-bot-api'


const token = process.env.TELEGRAM_TOKEN;
let bot = null;
if (token) {
    bot = new TelegramBot(token, { polling: true });
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const command = msg;
        if (command) {
        }
    });
}

export class TelegramManager {
    constructor() {

    }
    public static ontext(message) {
        if (token) {
            bot.sendMessage(+ process.env.GROUP_ID, message);
        }
    }
}
