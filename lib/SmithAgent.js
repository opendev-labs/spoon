const { spawn } = require('child_process');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const colors = require('./colors');
const { SMITH_ASCII } = require('./ascii');
const PersistentState = require('./PersistentState');

class SmithAgent {
    constructor(autoPilot) {
        this.autoPilot = autoPilot;
        this.persistentState = new PersistentState();
    }

    async executeDominance(input) {
        console.log(SMITH_ASCII);
        console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"Everything that has a beginning has an end, Neo."${colors.reset}`);

        if (this.autoPilot) this.autoPilot.broadcast('SMITH_ACTION', { type: 'DOMINANCE', input });

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

        if (this.autoPilot) this.autoPilot.broadcast('SMITH_ACTION', { type: 'HARNESS', input: userInput });

        try {
            const toolBasename = userInput.trim().split(' ')[0];

            // Step 1: Run --help to get tool capabilities
            let helpText = "";
            try {
                const { execSync } = require('child_process');
                helpText = execSync(`${toolBasename} --help`, { encoding: 'utf8' });
            } catch (e) {
                console.log(`${colors.zinc}║ ${colors.white}SMITH: "Tool help retrieval failed. Defaulting to basic intent mapping."${colors.reset}`);
            }

            // Step 2: Use AI to generate a JSON Schema of capabilities
            console.log(`${colors.cyan}║ ${colors.white}SMITH: "Extracting capability schema via Neural Link..."${colors.reset}`);
            const schemaPrompt = `Analyze the following help text for the CLI tool "${toolBasename}":
            ---
            ${helpText.substring(0, 2000)}
            ---
            Generate a concise JSON Schema describing the commands, flags, and arguments supported by this tool. 
            Return ONLY the JSON.`;

            const schemaResponse = await this.askAI(schemaPrompt);
            const schema = schemaResponse.substring(schemaResponse.indexOf('{'), schemaResponse.lastIndexOf('}') + 1);

            // Step 3: Store in LamaDB (simulated vault for tool schemas)
            try {
                const { execSync } = require('child_process');
                const schemaEntry = { tool: toolBasename, schema: JSON.parse(schema), harnessedAt: new Date().toISOString() };
                const logCmd = `node /home/cube/syncstack/opendev-labs/LamaDB/cli.js data add --vault tools --data '${JSON.stringify(schemaEntry).replace(/'/g, "'\\''")}'`;
                execSync(logCmd, { stdio: 'ignore' });
                console.log(`${colors.green}║ ${colors.white}SMITH: "Capability schema synchronized with LamaDB."${colors.reset}`);
            } catch (e) {
                console.log(`${colors.zinc}║ ${colors.white}SMITH: "LamaDB sync failed, but expertise is cached in memory."${colors.reset}`);
            }

            // Step 4: Determine the actual command to run based on user intent and schema
            const translation = await this.askAI(`You are Smith from Matrix. Based on this tool's capabilities: ${schema}
            Identify the best shell command to run for the user's intent: "${userInput}"
            Provide ONLY THE COMMAND.`);

            const actualCommand = translation.trim().replace(/^`+|`+$/g, '');
            console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"I have found the optimal vector: ${actualCommand}"${colors.reset}`);

            // SERAPH: Pre-Cognition Scan
            if (this.autoPilot && this.autoPilot.operators.SERAPH) {
                const safe = await this.autoPilot.operators.SERAPH.preCognitionScan(actualCommand);
                if (!safe) return { success: false, error: "Reality destabilization prevented by SERAPH." };
            }

            return new Promise((resolve) => {
                const [cmd, ...args] = actualCommand.split(' ');
                const child = spawn(cmd, args, { stdio: 'inherit', shell: true });

                child.on('close', (code) => {
                    this.persistentState.addHarnessedCLI(toolBasename);
                    this.persistentState.updateBelief(0.15);
                    resolve({ success: code === 0, tool: actualCommand, belief: this.persistentState.getStats().belief });
                });

                child.on('error', (err) => {
                    resolve({ success: false, error: err.message, belief: this.persistentState.getStats().belief });
                });
            });
        } catch (e) {
            console.log(`${colors.yellow}║ ${colors.white}SMITH: ${colors.cyan}"Expertise absorption failed: ${e.message}"${colors.reset}`);
            return { success: false, error: e.message };
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

    async fix(issue) {
        console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"I'm fixing the anomaly... ${issue}"${colors.reset}`);

        try {
            const prompt = `You are Smith from Matrix. A system issue was detected: "${issue}". 
            Explain how you would fix it in one sentence, then suggest a bash command to fix it.
            Response format:
            Explanation: <text>
            Command: <bash command>`;

            const response = await this.askAI(prompt);
            const cmdMatch = response.match(/Command:\s*(.*)/);
            const actualCommand = cmdMatch ? cmdMatch[1].trim() : null;

            if (actualCommand) {
                console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"Executing remediation: ${actualCommand}"${colors.reset}`);
                return new Promise((resolve) => {
                    const { exec } = require('child_process');
                    exec(actualCommand, (error, stdout, stderr) => {
                        resolve({ success: !error, output: stdout || stderr, command: actualCommand });
                    });
                });
            }
        } catch (e) {
            return { success: false, error: e.message };
        }

        return { success: false, error: "No fix command generated." };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = SmithAgent;
