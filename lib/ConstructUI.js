const express = require('express');
const path = require('path');
const colors = require('./colors');
const PersistentState = require('./PersistentState');

class ConstructUI {
    constructor(port = 4444) {
        this.app = express();
        this.port = port;
        this.state = new PersistentState();
        this.clients = [];
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.use(express.static(path.join(__dirname, '..')));

        // SSE for real-time updates
        this.app.get('/events', (req, res) => {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            const client = { res };
            this.clients.push(client);

            req.on('close', () => {
                this.clients = this.clients.filter(c => c !== client);
            });
        });

        this.app.get('/status', (req, res) => {
            res.json(this.state.getStats());
        });
    }

    broadcast(event, data) {
        const payload = `data: ${JSON.stringify({ event, data })}\n\n`;
        this.clients.forEach(client => client.res.write(payload));
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`${colors.green}╔══════════════════════════════════════════════════╗`);
            console.log(`║ ${colors.white}THE CONSTRUCT: Online at http://localhost:${this.port}${colors.green}    ║`);
            console.log(`╚══════════════════════════════════════════════════╝${colors.reset}`);
        });
    }

    stop() {
        if (this.server) this.server.close();
    }
}

module.exports = ConstructUI;
