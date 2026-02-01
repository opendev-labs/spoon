const colors = require('../colors');

class BaseChannel {
    constructor(id, name, options = {}) {
        this.id = id;
        this.name = name;
        this.options = options;
        this.active = false;
        this.tankOperator = null; // Will be injected by ChannelManager
    }

    setTankOperator(operator) {
        this.tankOperator = operator;
    }

    async start() {
        this.active = true;
        this.log(`${colors.green}SIGNAL LINK ESTABLISHED${colors.reset}`);
    }

    async stop() {
        this.active = false;
        this.log(`${colors.yellow}SIGNAL LINK TERMINATED${colors.reset}`);
    }

    async sendMessage(to, content, options = {}) {
        throw new Error("sendMessage must be implemented by concrete channel");
    }

    // Standardized Matrix-themed logging
    log(message) {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        console.log(`${colors.zinc}[${timestamp}]${colors.reset} ${colors.cyan}<${this.name.toUpperCase()}>${colors.reset} ${message}`);
    }

    async receiveMessage(from, content, metadata = {}) {
        this.log(`${colors.green}INCOMING TRANSMISSION FROM ${from}${colors.reset}`);

        if (!this.tankOperator) {
            this.log(`${colors.red}ERROR: NO OPERATOR LINKED. DROPPING PACKET.${colors.reset}`);
            return;
        }

        try {
            // Forward to Tank/Trinity
            // We simulate a command execution through the operator
            this.log(`${colors.white}DECODING: "${content}"${colors.reset}`);

            // For now, simple echo/execution mock
            // In a real implementation, we would route this to MatrixAutoPilot

            // We need a way to get the response back. 
            // The TankOperator.delegateTask returns a result.
            // If the content is a command, we execute it.

            let result;
            // Basic heuristic: is it a command?
            if (content.startsWith('/') || content.startsWith('spoon ')) {
                const command = content.startsWith('/') ? content.substring(1) : content;
                result = await this.tankOperator.delegateTask(command);
                // Format result for response
                const responseText = this.formatResult(result);
                await this.sendMessage(from, responseText);
            } else {
                // Just chat? Maybe later send to LLM (Trinity)
                // For now, auto-response
                await this.sendMessage(from, `[AUTO-REPLY] Signal received. Matrix systems operational.`);
            }

        } catch (error) {
            this.log(`${colors.red}PROCESSING ERROR: ${error.message}${colors.reset}`);
            await this.sendMessage(from, `[SYSTEM ERROR] Neural link unstable: ${error.message}`);
        }
    }

    formatResult(result) {
        if (typeof result === 'string') return result;
        if (result && result.message) return result.message;
        return JSON.stringify(result);
    }
}

module.exports = BaseChannel;
