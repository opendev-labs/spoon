const colors = require('./colors');
const fs = require('fs');
const path = require('path');
const DiscordChannel = require('./channels/DiscordChannel');
const TelegramChannel = require('./channels/TelegramChannel');

class ChannelManager {
    constructor(tankOperator, options = {}) {
        this.tankOperator = tankOperator;
        this.options = options;
        this.channels = new Map();
        this.channelsDir = path.join(__dirname, 'channels');
        // Auto-load default channels
        this.registerChannel(new DiscordChannel());
        this.registerChannel(new TelegramChannel());
    }

    async loadChannels() {
        console.log(`${colors.cyan}║ ${colors.white}SCANNING FOR CARRIER SIGNALS...${colors.reset}`);
        // Future dynamic loading
    }

    registerChannel(channel) {
        if (this.channels.has(channel.id)) {
            console.log(`${colors.yellow}║ ${colors.white}WARNING: Channel ${channel.id} frequency already occupied.${colors.reset}`);
            return;
        }

        channel.setTankOperator(this.tankOperator);
        this.channels.set(channel.id, channel);
        console.log(`${colors.green}║ ${colors.white}CHANNEL REGISTERED: ${colors.cyan}${channel.name.toUpperCase()}${colors.reset}`);
    }

    async startAll() {
        console.log(`${colors.green}║ ${colors.white}OPENING ALL FREQUENCIES...${colors.reset}`);
        for (const [id, channel] of this.channels) {
            try {
                await channel.start();
            } catch (error) {
                console.log(`${colors.red}║ ${colors.white}FAILED TO OPEN CHANNEL ${channel.name}: ${error.message}${colors.reset}`);
            }
        }
    }

    async stopAll() {
        console.log(`${colors.yellow}║ ${colors.white}CLOSING ALL FREQUENCIES...${colors.reset}`);
        for (const [id, channel] of this.channels) {
            await channel.stop();
        }
    }

    async broadcast(message) {
        console.log(`${colors.cyan}║ ${colors.white}BROADCASTING TO ALL NODES: "${message}"${colors.reset}`);
        const promises = [];
        for (const [id, channel] of this.channels) {
            if (channel.active) {
                // Determine a default target or implement broadcast support in channels
                // For simplified spoon implementation, we might skip actual broadcast unless a 'default' target is known
                // Or we just log it for now
            }
        }
    }
}

module.exports = ChannelManager;
