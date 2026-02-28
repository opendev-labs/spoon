const { execSync } = require('child_process');
const fs = require('fs');
const EventEmitter = require('events');
const colors = require('./colors');

class Healer extends EventEmitter {
    constructor(autoPilot) {
        super();
        this.autoPilot = autoPilot;
        this.maxIterations = 3;
        this.currentIteration = 0;

        // Listen for RE-FIX events
        this.on('RE-FIX', async (data) => {
            await this.handleReFix(data);
        });
    }

    async heal(options = {}) {
        console.log(`${colors.cyan}🌀 SPOON SELF-HEALING PROTOCOL INITIATED...${colors.reset}`);

        if (options.nuclear) {
            console.log(`${colors.red}☢️ NUCLEAR CLEANSE INITIATED...${colors.reset}`);
            try {
                execSync('find . -name "*backup*" -delete 2>/dev/null');
                execSync('find . -name "*.backup" -delete 2>/dev/null');
                console.log(`${colors.green}🗑️ Removed backup files${colors.reset}`);
            } catch (e) { }
        }

        console.log(`${colors.green}🔍 Scanning for vulnerabilities...${colors.reset}`);

        // Initial Scan via TRINITY
        const scanResult = await this.autoPilot.operators.SERAPH.scanReality();

        // If Seraph or Trinity find issues, trigger repair loop
        // For now, let's simulate a check
        if (options.testIssue) {
            this.emit('RE-FIX', { issue: options.testIssue, file: options.targetFile });
        }

        return { success: true, message: "System scan complete." };
    }

    async handleReFix(data) {
        this.currentIteration++;
        if (this.currentIteration > this.maxIterations) {
            console.log(`${colors.red}❗ HEALING COLLAPSE: Maximum iterations reached.${colors.reset}`);
            // Alert via PhoneBooth (simulated here or via tank)
            console.log(`${colors.yellow}📞 Alerting NEO via PhoneBooth...${colors.reset}`);
            this.currentIteration = 0;
            return;
        }

        console.log(`${colors.yellow}🛠️ RECURSIVE HEALING [Attempt ${this.currentIteration}/${this.maxIterations}]: Fixing ${data.issue}${colors.reset}`);

        // Fix (via SMITH)
        const fixResult = await this.autoPilot.operators.SMITH.fix(data.issue);

        // Verify (via SERAPH)
        const verifyResult = await this.autoPilot.operators.SERAPH.verifyFix(data.issue, fixResult);

        if (!verifyResult.success) {
            console.log(`${colors.red}⚠ Verification failed: ${verifyResult.error}${colors.reset}`);
            this.emit('RE-FIX', { ...data, error: verifyResult.error });
        } else {
            console.log(`${colors.green}✅ Verification successful. System integrity restored.${colors.reset}`);
            this.currentIteration = 0;
        }
    }

    async dwell(path = process.cwd()) {
        console.log(`${colors.green}💓 SPOON HEARTBEAT: Dwell mode active on ${path}${colors.reset}`);

        // Using fs.watch for native file watching
        fs.watch(path, { recursive: true }, async (eventType, filename) => {
            if (filename && !filename.includes('.git') && !filename.includes('node_modules')) {
                console.log(`${colors.zinc}║ File change detected: ${filename} (${eventType})${colors.reset}`);

                // Broadcast to HUD
                if (this.autoPilot) this.autoPilot.broadcast('HEARTBEAT', { type: eventType, file: filename });

                // Trigger autonomous repair if change seems problematic or empty
                const fullPath = require('path').join(path, filename);
                if (fs.existsSync(fullPath) && fs.statSync(fullPath).size === 0) {
                    console.log(`${colors.yellow}║ Autonomous trigger: Empty file detected. Handing to SMITH...${colors.reset}`);
                    this.emit('RE-FIX', { issue: `Fix empty file at ${filename}`, file: fullPath });
                }
            }
        });

        // Keep process alive if called directly, but usually this is part of a long-running CLI
    }
}

module.exports = Healer;
