const BaseChannel = require('./BaseChannel');
const colors = require('../colors');

class TelegramChannel extends BaseChannel {
    constructor(options = {}) {
        super('telegram', 'Telegram', options);
    }

    async sendMessage(to, content, options = {}) {
        this.log(`${colors.green}ROUTING TELEGRAM FOR ${to}${colors.reset}`);
        // Stub
        this.log(`${colors.white}SENT VIA SECURE LINE: "${content}"${colors.reset}`);
        return true;
    }
}

module.exports = TelegramChannel;
