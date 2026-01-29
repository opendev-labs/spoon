const fs = require('fs');
const path = require('path');
const colors = require('./colors');
const { SERAPH_ASCII } = require('./ascii');
const PersistentState = require('./PersistentState');

class SeraphProtector {
    constructor() {
        this.persistentState = new PersistentState();
    }

    async scanReality() {
        console.log(SERAPH_ASCII);
        console.log(`${colors.green}║ ${colors.white}SERAPH: "Initializing deep reality audit..."${colors.reset}`);

        const findings = [];
        const cwd = process.cwd();

        try {
            // Check for .git
            if (fs.existsSync(path.join(cwd, '.git'))) {
                findings.push("Git repository detected. Source control: ACTIVE.");
            } else {
                findings.push("⚠ No source control found. Reality is untracked.");
            }

            // Check for .env files
            const envFiles = fs.readdirSync(cwd).filter(f => f.startsWith('.env'));
            if (envFiles.length > 0) {
                findings.push(`⚠ Secret layers detected: ${envFiles.join(', ')}. Ensure they are encrypted.`);
            }

            // Check for package.json
            if (fs.existsSync(path.join(cwd, 'package.json'))) {
                const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
                findings.push(`${pkg.name} v${pkg.version} detected. Node.js runtime: STABLE.`);
            }

            // Check for python env
            const hasPythonEnv = fs.readdirSync(cwd).some(f => f.includes('env') || f.includes('venv'));
            if (hasPythonEnv) {
                findings.push("Python AI environment detected. Neural pathways: READY.");
            }

        } catch (e) {
            findings.push(`⚠ Reality distortion: ${e.message}`);
        }

        const scans = [
            "Scanning for Agents... CLEAR",
            "Monitoring system integrity... STABLE",
            ...findings,
            "Reality firewall... ENGAGED",
            "Quantum encryption... ACTIVE"
        ];

        for (const scan of scans) {
            const color = scan.includes('⚠') ? colors.yellow : colors.green;
            console.log(`${color}║ ${colors.white}${scan}${colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 400));
        }

        console.log(`${colors.green}║ ${colors.white}SERAPH: "The path is clear, Neo. You are protected."${colors.reset}`);
    }
}

module.exports = SeraphProtector;
