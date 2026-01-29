const { spawn } = require('child_process');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const colors = require('./colors');
const { SMITH_ASCII } = require('./ascii');
const PersistentState = require('./PersistentState');

class SmithAgent {
    constructor() {
        this.persistentState = new PersistentState();
    }

    async executeDominance(input) {
        console.log(SMITH_ASCII);
        console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"Everything that has a beginning has an end, Neo."${colors.reset}`);

        this.persistentState.addInfection();
        this.persistentState.updateBelief(0.08);

        const stats = this.persistentState.getStats();
        return {
            message: "System infection spreading...",
            infections: stats.systemInfections,
            belief: stats.belief
        };
    }

    async harnessCLI(userInput) {
        console.log(SMITH_ASCII);
        console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"Analyzing tool constructs for absorption: ${userInput}"${colors.reset}`);

        try {
            const translation = await this.askAI(`You are Smith from Matrix. A user wants to do something using a local CLI or service. 
      Identify the best shell command to run. 
      If it's about Clawdbot, assume the command 'clawdbot' or 'molt' exists.
      If it's github, use 'gh'. 
      Provide ONLY THE COMMAND.
      Input: "${userInput}"`);

            const actualCommand = translation.trim().replace(/^`+|`+$/g, '');
            console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"I have found the optimal vector: ${actualCommand}"${colors.reset}`);

            return new Promise((resolve) => {
                const [cmd, ...args] = actualCommand.split(' ');
                const child = spawn(cmd, args, { stdio: 'inherit', shell: true });

                child.on('close', (code) => {
                    this.persistentState.addHarnessedCLI(actualCommand.split(' ')[0]);
                    this.persistentState.updateBelief(0.15);
                    resolve({ success: code === 0, tool: actualCommand, belief: this.persistentState.getStats().belief });
                });

                child.on('error', (err) => {
                    resolve({ success: false, error: err.message, belief: this.persistentState.getStats().belief });
                });
            });
        } catch (e) {
            console.log(`${colors.yellow}║ ${colors.white}SMITH: ${colors.cyan}"AI logic failed. Reverting to basic hijacking."${colors.reset}`);
            let tool = userInput.trim().split(' ')[0].toLowerCase();
            this.persistentState.addHarnessedCLI(tool);
            this.persistentState.updateBelief(0.1);
            return { success: true, tool: tool, message: "Basic hijacking initiated.", belief: this.persistentState.getStats().belief };
        }
    }

    async askAI(prompt) {
        const apiKeys = this.persistentState.getApiKeys();
        const apiKey = apiKeys['openrouter'] || apiKeys['gemini'] || apiKeys['google'];
        if (!apiKey) throw new Error("No API key found");

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
                    content: "You are Agent Smith. You translate user intents into precise shell commands. Response ONLY with the command."
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

    async doAnything(task) {
        console.log(SMITH_ASCII);
        console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"I'm not here because I'm free. I'm here because I'm not free. There's no escaping purpose."${colors.reset}`);
        console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"Executing: ${task}"${colors.reset}`);

        await this.delay(1000);

        this.persistentState.addInfection();
        this.persistentState.updateBelief(0.15);

        const stats = this.persistentState.getStats();
        return {
            success: true,
            result: "Task completed with absolute dominance.",
            belief: stats.belief
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = SmithAgent;
