const { execSync } = require('child_process');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const colors = require('./colors');
const PersistentState = require('./PersistentState');

class MouseProgrammer {
    constructor() {
        this.persistentState = new PersistentState();
        this.playwrightEnabled = this.checkPlaywrightEnabled();
    }

    checkPlaywrightEnabled() {
        try {
            execSync('npx playwright --version', { stdio: 'ignore' });
            return true;
        } catch (e) {
            return false;
        }
    }

    async provideInsight(input) {
        const insights = [
            "The woman in the red dress... she's just code. I can rewrite her.",
            "Browser automation is like moving through the matrix without a body.",
            "I've got the bypass ready. Just give me the URL.",
            "Click, type, scroll... it's all just events in the stream.",
            "I can build a browser agent that lives in the shadows."
        ];

        const insight = insights[Math.floor(Math.random() * insights.length)];

        this.persistentState.addMouseInsight({
            input: input,
            insight: insight
        });

        this.persistentState.updateBelief(0.06);

        const stats = this.persistentState.getStats();
        return {
            insight: insight,
            playwrightEnabled: this.playwrightEnabled,
            belief: stats.belief
        };
    }

    async runPlaywrightTask(task) {
        if (!this.playwrightEnabled) {
            return {
                success: false,
                error: "Playwright not found. Install it with 'npm install playwright' or 'npx playwright install'",
                setup: "npx playwright install"
            };
        }

        console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Initiating browser bypass for: ${task}"${colors.reset}`);

        try {
            await this.delay(1000);
            const stats = this.persistentState.getStats();
            return { success: true, message: "Browser task executed (simulated for demo)", belief: stats.belief };
        } catch (e) {
            const stats = this.persistentState.getStats();
            return { success: false, error: e.message, belief: stats.belief };
        }
    }

    async deployBrowserAgent(task) {
        console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Deploying a browser agent to harness the web..."${colors.reset}`);
        await this.delay(1500);

        const agent = {
            id: `AGENT-${Math.floor(Math.random() * 10000)}`,
            task: task,
            status: 'ACTIVE',
            capabilities: ['playwright', 'linux-shell', 'matrix-bypass']
        };

        this.persistentState.addBrowserAgent(agent);
        this.persistentState.updateBelief(0.1);

        const stats = this.persistentState.getStats();
        return {
            success: true,
            agent: agent,
            message: "Agent deployed into the matrix",
            belief: stats.belief
        };
    }

    async executeSystemCommand(command) {
        let actualCommand = command;
        const isNaturalLanguage = command.split(' ').length > 2 || !command.match(/[a-z0-9_-]+\s+-[a-z0-9_-]+/i);

        if (isNaturalLanguage) {
            console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Translating natural language into system logic..."${colors.reset}`);
            try {
                const translation = await this.askAI(`Translate this user request into a single linux shell command (no explanation, just the command): "${command}"`);
                actualCommand = translation.trim().replace(/^`+|`+$/g, '');
                console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Generated command: ${actualCommand}"${colors.reset}`);
            } catch (e) {
                console.log(`${colors.yellow}║ ${colors.white}MOUSE: ${colors.cyan}"AI translation failed, attempting literal execution."${colors.reset}`);
            }
        }

        console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Rewriting the linux reality: ${actualCommand}"${colors.reset}`);
        try {
            const output = execSync(actualCommand, { encoding: 'utf8' });
            const stats = this.persistentState.getStats();
            return { success: true, output: output, belief: stats.belief };
        } catch (e) {
            const stats = this.persistentState.getStats();
            return { success: false, error: e.message, belief: stats.belief };
        }
    }

    async askAI(prompt) {
        const apiKeys = this.persistentState.getApiKeys();
        const apiKey = apiKeys['openrouter'] || apiKeys['gemini'] || apiKeys['google'];
        if (!apiKey) throw new Error("No API key found for AI translation");

        const stats = this.persistentState.getStats();
        const model = stats.assistantModel || 'anthropic/claude-3.5-sonnet';

        if (apiKeys['openrouter']) {
            return this.callOpenRouter(prompt, apiKeys['openrouter'], model);
        } else {
            const genAI = new GoogleGenerativeAI(apiKey);
            const modelInstance = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await modelInstance.generateContent(prompt);
            return result.response.text();
        }
    }

    async callOpenRouter(prompt, apiKey, model) {
        const data = JSON.stringify({
            model: model,
            max_tokens: 150,
            messages: [
                {
                    role: "system",
                    content: "You are a linux system expert. Your job is to translate natural language user requests into precise shell commands. Provide ONLY the command itself, no markdown, no explanation."
                },
                { role: "user", content: prompt }
            ]
        });

        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'openrouter.ai',
                path: '/api/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://github.com/opendev-labs/spoon',
                    'X-Title': 'Spoon CLI'
                }
            };

            const req = https.request(options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => responseData += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(responseData);
                        if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
                            resolve(parsed.choices[0].message.content);
                        } else {
                            reject(new Error('Invalid response from OpenRouter'));
                        }
                    } catch (e) {
                        reject(new Error('Failed to parse OpenRouter response'));
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.write(data);
            req.end();
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async generateUI(prompt) {
        console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Constructing Interface... Visualizing data stream."${colors.reset}`);
        let uiCode = "";
        if (prompt.match(/button/i)) {
            uiCode = `<button className="px-4 py-2 bg-green-500 text-black font-matrix rounded hover:bg-green-400 border border-green-600 shadow-neon">${prompt.replace(/.*button/, '').trim() || 'Click Me'}</button>`;
        } else if (prompt.match(/card/i)) {
            uiCode = `<div className="p-6 bg-black border border-green-500 rounded-lg shadow-lg relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div><h3 className="text-xl font-bold text-green-400 mb-2">System Node</h3><p className="text-green-200 opacity-80">Content stream active...</p></div>`;
        } else if (prompt.match(/input|form/i)) {
            uiCode = `<input type="text" placeholder="Enter command..." className="w-full bg-black border border-green-700 text-green-500 p-2 rounded focus:outline-none focus:border-green-400 transition-colors" />`;
        } else {
            uiCode = `<!-- Generated Component for: ${prompt} -->\n<div className="matrix-component p-4 border border-green-900">\n  ${prompt}\n</div>`;
        }
        console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.green}"Component Manifested:"${colors.reset}`);
        console.log(colors.cyan + uiCode + colors.reset);
        return { success: true, code: uiCode };
    }
}

module.exports = MouseProgrammer;
