const express = require('express');
const bodyParser = require('body-parser');
const colors = require('./colors');
const PersistentState = require('./PersistentState');
const TankOperator = require('./TankOperator');

class PhoneBooth {
    constructor(options = {}) {
        this.port = options.port || 3333;
        this.app = express();
        this.persistentState = new PersistentState();
        this.operator = new TankOperator(options);

        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(bodyParser.json());
    }

    setupRoutes() {
        // Health check
        this.app.get('/status', (req, res) => {
            const stats = this.persistentState.getStats();
            res.json({
                status: 'online',
                system: 'SPOON_OMEGA_PHONE_BOOTH',
                tokens: stats.hardlineTokens,
                evolution: stats.evolutionStage
            });
        });

        // The Phone Call Endpoint
        this.app.post('/call', async (req, res) => {
            const { command, token, identity } = req.body;

            console.log(`\n${colors.cyan}║ ☎️ INCOMING PHONE CALL FROM: ${identity || 'UNKNOWN SOURCE'}${colors.reset}`);

            // Verification logic (placeholder for more complex token/identity check)
            if (!command) {
                return res.status(400).json({ error: 'No command transmitted over the hardline.' });
            }

            const hasToken = this.persistentState.useToken();

            if (!hasToken) {
                console.log(`${colors.red}║ 🛑 DISCONNECT: No Hardline Tokens remaining.${colors.reset}`);
                return res.status(402).json({
                    error: 'Payment Required',
                    message: 'Zero Hardline Tokens. Buy tokens to place more calls.'
                });
            }

            console.log(`${colors.green}║ ⚡ CONNECTED: Executing mission...${colors.reset}`);
            console.log(`${colors.white}║ COMMAND: ${command}${colors.reset}`);

            try {
                // Execute the command via Tank
                const result = await this.operator.delegateTask(command);

                console.log(`${colors.green}║ ✅ MISSION COMPLETE: Hanging up.${colors.reset}`);

                res.json({
                    success: true,
                    result: result,
                    tokensRemaining: this.persistentState.state.hardlineTokens
                });
            } catch (error) {
                console.log(`${colors.red}║ ❌ LINE GLITCH: ${error.message}${colors.reset}`);
                res.status(500).json({ error: 'Matrix Glitch', message: error.message });
            }
        });
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`\n${colors.green}┌─────────────────────────────────────────────────────────────┐`);
            console.log(`│               SPOON OMEGA PHONE BOOTH v1.0                  │`);
            console.log(`│               THE HARDLINE IS NOW OPEN                      │`);
            console.log(`│               PORT: ${this.port}                                    │`);
            console.log(`└─────────────────────────────────────────────────────────────┘${colors.reset}\n`);

            this.persistentState.setPhoneBoothStatus(true);
        });
    }

    stop() {
        if (this.server) {
            this.server.close();
            this.persistentState.setPhoneBoothStatus(false);
            console.log(`${colors.yellow}║ 🔌 HARDLINE DISCONNECTED.${colors.reset}`);
        }
    }
}

module.exports = PhoneBooth;
