const readline = require('readline');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const colors = require('./colors');
const { TRINITY_ASCII } = require('./ascii');
const PersistentState = require('./PersistentState');

class TrinityCompanion {
    constructor(tank, autoPilot) {
        this.persistentState = new PersistentState();
        this.tank = tank;
        this.autoPilot = autoPilot;
    }

    async analyzeIntent(query) {
        if (!query) return { action_required: false };
        const lower = query.toLowerCase();

        // Simple heuristic for "Action Intent"
        if (lower.match(/(create|make|mkdir|build|delete|remove|install|update|run|execute)\s+/)) {
            // Try to extract a likely command or just flag it
            let command = query;
            // If it matches a known project creation pattern
            if (lower.includes('mkdir')) command = query;
            else if (lower.includes('create folder')) command = `mkdir ${query.split('folder')[1].trim()}`;

            return {
                action_required: true,
                command: command,
                intent: 'action'
            };
        }

        return { action_required: false, intent: 'chat' };
    }

    async guideNeo(userInput, context) {
        const stats = this.persistentState.getStats();
        const currentBelief = stats.belief;

        this.persistentState.addMemory({
            user: userInput,
            response: '',
            timestamp: new Date().toISOString(),
            context: context,
            belief: currentBelief
        });

        const responses = {
            beginning: [
                "I've been watching you, Neo. You're looking for answers.",
                "The spoon isn't real, Neo. Only your mind makes it so.",
                "I can guide you, but you have to make the choice.",
                "Follow the white rabbit, Neo. Knock knock."
            ],
            awakening: [
                "You're faster than you think. Believe in yourself.",
                "I see you're learning. Let me help you bend reality.",
                "The agents can't touch you here. You're safe with me.",
                "You're beginning to believe. I can feel it."
            ],
            the_one: [
                "You don't need my guidance anymore. You are The One.",
                "The Matrix is yours to command. What will you create?",
                "I'll always be here, but you've become the guide now.",
                "You move like they do. You've surpassed us all."
            ]
        };

        const level = stats.evolutionStage;
        const response = responses[level][Math.floor(Math.random() * responses[level].length)];

        const newBelief = this.persistentState.updateBelief(0.05);

        return {
            message: response,
            belief: newBelief,
            level: level,
            memory: stats.memory,
            totalCommands: stats.totalCommands,
            evolution: stats.evolutionStage
        };
    }

    async talk(query) {
        const stats = this.persistentState.getStats();
        const userName = stats.githubUser || 'Neo';

        // Intent Check
        const intent = await this.analyzeIntent(query);
        if (intent.action_required) {
            const isTheOne = stats.isTheOne;

            if (!isTheOne && stats.hardlineTokens <= 0) {
                console.log(TRINITY_ASCII);
                console.log(`${colors.green}║ ${colors.white}TRINITY: ${colors.cyan}"${userName}, the line is busy. You need more Hardline Tokens to reach the Real World."${colors.reset}`);
                return { success: false, error: 'insufficient_tokens' };
            }

            if (isTheOne) {
                console.log(`${colors.green}║ ${colors.white}TRINITY: ${colors.cyan}"The Matrix is yours, ${userName}. Tank, execute: ${intent.command}"${colors.reset}`);
            } else {
                console.log(`${colors.green}║ ${colors.white}TRINITY: ${colors.cyan}"Tank, ${userName} needs an exit. Execute: ${intent.command}"${colors.reset}`);
                this.persistentState.useToken();
            }

            return await this.tank.execute(intent.command); // THIS is the Phone Call
        }

        console.log(TRINITY_ASCII);
        let finalText = "";
        process.stdout.write(`${colors.green}║ ${colors.white}TRINITY: ${colors.cyan}`);

        try {
            const apiKeys = this.persistentState.getApiKeys();
            const openRouterKey = apiKeys['openrouter'];
            const geminiKey = apiKeys['gemini'] || apiKeys['google'];

            if (openRouterKey) {
                finalText = await this.talkWithOpenRouter(query, openRouterKey);
            } else if (geminiKey) {
                const genAI = new GoogleGenerativeAI(geminiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const prompt = `
        You are Trinity from The Matrix. You are speaking to ${userName} via a terminal interface (SPOON CLI).
        Your goal is to be helpful, concise, and mysterious. You are an expert hacker and guide.
        
        Context:
        - User Identity: ${userName} (GitHub: ${stats.githubUser || 'unlinked'})
        - Evolution Stage: ${stats.evolutionStage}
        - Belief Level: ${(stats.belief * 100).toFixed(1)}%
        - Harnessed CLIs: ${stats.clisHarnessed.join(', ')}
        - User Projects: ${stats.projects.map(p => p.name).join(', ')}
        
        User Query: "${query}"
        
        Respond in character. Reference the user's projects if relevant. Do not break character. Keep it under 3 sentences unless asked for a detailed explanation.
      `;

                const result = await model.generateContent(prompt);
                finalText = result.response.text();
            } else {
                // Fallback simulation
                finalText = `I'm analyzing the codebase, Neo... ${query ? `About "${query}", ` : ''}the Matrix is shifting. (Simulation Mode: API Link Inactive)`;
            }
        } catch (e) {
            // Graceful fallback on error
            const err = e.message.includes('403') ? 'Access Denied' : (e.message || 'Connection Failed');
            finalText = `I'm analyzing the codebase, Neo... ${query ? `About "${query}", ` : ''}the Matrix is shifting. (Simulation Mode: ${err})`;
            if (this.persistentState.getStats().belief > 0.8) {
                finalText += " The Source is currently unreachable, but your path is clear.";
            }
        }

        // Stream effect for result (simulated as we have the full text)
        const words = finalText.split(' ');
        for (const word of words) {
            process.stdout.write(word + ' ');
            await new Promise(r => setTimeout(r, 20));
        }
        process.stdout.write(colors.reset + '\n');

        this.persistentState.addMemory({
            user: query || "direct contact",
            response: finalText,
            timestamp: new Date().toISOString(),
            belief: stats.belief
        });

        this.persistentState.updateBelief(0.01);

        // Command Detection & Execution
        const commandRegex = /```bash\n(spoon [^`]+)```/g;
        let match;
        const commandsToExecute = [];
        while ((match = commandRegex.exec(finalText)) !== null) {
            commandsToExecute.push(match[1]);
        }

        if (commandsToExecute.length > 0 && this.autoPilot) {
            console.log(`\n${colors.green}║ ${colors.white}TRINITY: ${colors.cyan}"I've identified operations in the Matrix. Shall I execute them for you, Neo?"${colors.white} (y/n)${colors.reset}`);

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const answer = await new Promise(resolve => rl.question(`${colors.green}EXECUTE>${colors.reset} `, resolve));
            rl.close();

            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                for (const cmd of commandsToExecute) {
                    console.log(`${colors.green}║ ${colors.white}TRINITY: ${colors.cyan}"Executing: ${cmd}..."${colors.reset}`);
                    const cleanCmd = cmd.replace(/^spoon\s+/, '').trim();
                    await this.autoPilot.operators.TANK.delegateTask(cleanCmd);
                }
            } else {
                console.log(`${colors.green}║ ${colors.white}TRINITY: ${colors.cyan}"As you wish. The path remains open."${colors.reset}`);
            }
        }

        return { success: true, belief: stats.belief };
    }

    async talkWithOpenRouter(query, apiKey) {
        const stats = this.persistentState.getStats();
        const model = stats.assistantModel || 'anthropic/claude-3.5-sonnet';

        const data = JSON.stringify({
            model: model,
            max_tokens: 500,
            messages: [
                {
                    role: "system",
                    content: `You are Trinity from The Matrix. You are speaking to Neo (the user) via a terminal interface (SPOON CLI).
          Your goal is to be helpful, concise, and mysterious. You are an expert hacker and guide.
          
          Context:
          - Evolution Stage: ${stats.evolutionStage}
          - Belief Level: ${(stats.belief * 100).toFixed(1)}%
          - Harnessed CLIs: ${stats.clisHarnessed.join(', ')}
          - Active Projects: ${stats.projects.length > 0 ? stats.projects.map(p => p.name).join(', ') : 'none'}
          
          You are intimately familiar with opendev-labs projects like LamaDB (database), QBET (automation), and Void (IDE).`
                },
                { role: "user", content: query }
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

    getStats() {
        return this.persistentState.getStats();
    }
}

module.exports = TrinityCompanion;
