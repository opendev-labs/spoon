const fs = require('fs');
const path = require('path');
const https = require('https');
const colors = require('./colors');

class PersistentState {
    constructor() {
        this.stateFile = path.join(process.cwd(), '.spoon-state.json');
        this.loadState();
    }

    loadState() {
        try {
            if (fs.existsSync(this.stateFile)) {
                const data = fs.readFileSync(this.stateFile, 'utf8');
                this.state = JSON.parse(data);
                // Ensure all required fields exist
                this.state.morpheusGuidance = this.state.morpheusGuidance || [];
                this.state.realityManipulationLevel = this.state.realityManipulationLevel || 'basic';
                this.state.agentEncounters = this.state.agentEncounters || 0;
                this.state.systemControl = this.state.systemControl || 0;
                this.state.oracleInsights = this.state.oracleInsights || [];
                this.state.ociDeployments = this.state.ociDeployments || [];
                this.state.pythonEnvironments = this.state.pythonEnvironments || [];
                this.state.aiModels = this.state.aiModels || [];
                this.state.mouseInsights = this.state.mouseInsights || [];
                this.state.browserAgents = this.state.browserAgents || [];
                this.state.systemInfections = this.state.systemInfections || 0;
                this.state.clisHarnessed = this.state.clisHarnessed || [];
                this.state.apiKeys = this.state.apiKeys || {};
                this.state.assistantModel = this.state.assistantModel || 'anthropic/claude-3.5-sonnet';
                this.state.hardlineTokens = this.state.hardlineTokens !== undefined ? this.state.hardlineTokens : 100;
                this.state.isPhoneBoothEnabled = this.state.isPhoneBoothEnabled !== undefined ? this.state.isPhoneBoothEnabled : false;
                this.state.isTheOne = this.state.isTheOne !== undefined ? this.state.isTheOne : false;
                this.state.githubUser = this.state.githubUser || null;
                this.state.githubToken = this.state.githubToken || null;
            } else {
                this.state = {
                    belief: 0.45,
                    evolutionStage: "awakening",
                    projects: [],
                    operations: [],
                    trinityMemory: [],
                    morpheusGuidance: [],
                    oracleInsights: [],
                    ociDeployments: [],
                    pythonEnvironments: [],
                    aiModels: [],
                    mouseInsights: [],
                    browserAgents: [],
                    systemInfections: 0,
                    clisHarnessed: [],
                    apiKeys: {},
                    assistantModel: 'anthropic/claude-3.5-sonnet',
                    totalCommands: 23,
                    realityManipulationLevel: "basic",
                    agentEncounters: 0,
                    systemControl: 0.45,
                    hardlineTokens: 100,
                    isPhoneBoothEnabled: false,
                    isTheOne: false,
                    githubUser: null,
                    githubToken: null,
                    lastAscension: new Date().toISOString()
                };
            }
        } catch (e) {
            this.state = {
                belief: 0.45,
                evolutionStage: "awakening",
                projects: [],
                operations: [],
                trinityMemory: [],
                morpheusGuidance: [],
                oracleInsights: [],
                ociDeployments: [],
                pythonEnvironments: [],
                aiModels: [],
                mouseInsights: [],
                browserAgents: [],
                totalCommands: 23,
                realityManipulationLevel: "basic",
                agentEncounters: 0,
                systemControl: 0.45,
                lastAscension: new Date().toISOString()
            };
        }
    }

    saveState(sync = true) {
        try {
            fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
            if (sync && this.state.githubUser && this.state.githubToken) {
                this.syncRemote().catch(e => {
                    // Silent fail for background sync to avoid disrupting user
                });
            }
        } catch (e) {
            console.log(`${colors.red}║ ${colors.white}Reality instability: ${e.message}${colors.reset}`);
        }
    }

    getEvolutionStage() {
        if (this.state.belief < 0.3) return "beginning";
        if (this.state.belief < 0.7) return "awakening";
        return "the_one";
    }

    updateBelief(increment = 0.05) {
        const oldStage = this.getEvolutionStage();
        this.state.belief = Math.min(1, this.state.belief + increment);
        this.state.totalCommands += 1;
        this.state.systemControl = Math.min(1, this.state.systemControl + (increment * 0.8));

        const newStage = this.getEvolutionStage();
        if (oldStage !== newStage) {
            this.state.evolutionStage = newStage;
            this.state.lastAscension = new Date().toISOString();
            console.log(`${colors.cyan}║ ${colors.white}EVOLUTION: ${oldStage.toUpperCase()} → ${newStage.toUpperCase()}${colors.reset}`);
        }

        // Update reality manipulation level
        if (this.state.belief >= 0.8) this.state.realityManipulationLevel = "neo";
        else if (this.state.belief >= 0.6) this.state.realityManipulationLevel = "system_rewriting";
        else if (this.state.belief >= 0.4) this.state.realityManipulationLevel = "advanced";

        this.saveState();
        return this.state.belief;
    }

    addProject(project) {
        this.state.projects.push({
            ...project,
            created: new Date().toISOString(),
            beliefLevel: this.state.belief
        });
        this.saveState();
    }

    setAssistantModel(model) {
        this.state.assistantModel = model;
        this.saveState();
    }

    addOperation(operation) {
        this.state.operations.push({
            ...operation,
            timestamp: new Date().toISOString(),
            beliefLevel: this.state.belief
        });
        if (this.state.operations.length > 50) {
            this.state.operations.shift();
        }
        this.saveState();
    }

    addMemory(exchange) {
        this.state.trinityMemory.push(exchange);
        if (this.state.trinityMemory.length > 20) {
            this.state.trinityMemory.shift();
        }
        this.saveState();
    }

    addMorpheusGuidance(guidance) {
        if (!this.state.morpheusGuidance) {
            this.state.morpheusGuidance = [];
        }
        this.state.morpheusGuidance.push({
            ...guidance,
            timestamp: new Date().toISOString()
        });
        if (this.state.morpheusGuidance.length > 10) {
            this.state.morpheusGuidance.shift();
        }
        this.saveState();
    }

    addOracleInsight(insight) {
        if (!this.state.oracleInsights) {
            this.state.oracleInsights = [];
        }
        this.state.oracleInsights.push({
            ...insight,
            timestamp: new Date().toISOString()
        });
        if (this.state.oracleInsights.length > 15) {
            this.state.oracleInsights.shift();
        }
        this.saveState();
    }

    addOCIDeployment(deployment) {
        if (!this.state.ociDeployments) {
            this.state.ociDeployments = [];
        }
        this.state.ociDeployments.push({
            ...deployment,
            timestamp: new Date().toISOString()
        });
        if (this.state.ociDeployments.length > 10) {
            this.state.ociDeployments.shift();
        }
        this.saveState();
    }

    addPythonEnvironment(env) {
        if (!this.state.pythonEnvironments) {
            this.state.pythonEnvironments = [];
        }
        this.state.pythonEnvironments.push({
            ...env,
            timestamp: new Date().toISOString()
        });
        if (this.state.pythonEnvironments.length > 10) {
            this.state.pythonEnvironments.shift();
        }
        this.saveState();
    }

    addAIModel(model) {
        if (!this.state.aiModels) {
            this.state.aiModels = [];
        }
        this.state.aiModels.push({
            ...model,
            timestamp: new Date().toISOString()
        });
        if (this.state.aiModels.length > 10) {
            this.state.aiModels.shift();
        }
        this.saveState();
    }

    addMouseInsight(insight) {
        if (!this.state.mouseInsights) {
            this.state.mouseInsights = [];
        }
        this.state.mouseInsights.push({
            ...insight,
            timestamp: new Date().toISOString()
        });
        if (this.state.mouseInsights.length > 15) {
            this.state.mouseInsights.shift();
        }
        this.saveState();
    }

    addBrowserAgent(agent) {
        if (!this.state.browserAgents) {
            this.state.browserAgents = [];
        }
        this.state.browserAgents.push({
            ...agent,
            timestamp: new Date().toISOString()
        });
        if (this.state.browserAgents.length > 10) {
            this.state.browserAgents.shift();
        }
        this.saveState();
    }

    addInfection() {
        this.state.systemInfections += 1;
        this.saveState();
    }

    addHarnessedCLI(cli) {
        if (!this.state.clisHarnessed) {
            this.state.clisHarnessed = [];
        }
        if (!this.state.clisHarnessed.includes(cli)) {
            this.state.clisHarnessed.push(cli);
        }
        this.saveState();
    }

    addApiKey(provider, key) {
        this.state.apiKeys = this.state.apiKeys || {};
        this.state.apiKeys[provider] = key;
        this.saveState();
    }

    useToken() {
        if (this.state.hardlineTokens > 0) {
            this.state.hardlineTokens -= 1;
            this.saveState();
            return true;
        }
        return false;
    }

    addTokens(amount) {
        this.state.hardlineTokens += amount;
        this.saveState();
    }

    setPhoneBoothStatus(enabled) {
        this.state.isPhoneBoothEnabled = enabled;
        this.saveState();
    }

    login(username) {
        // Recognition of the Creator
        if (username.toLowerCase() === 'cube' || username.toLowerCase() === 'creator' || username.toLowerCase() === 'opendev-labs') {
            this.state.isTheOne = true;
            this.state.githubUser = username.toLowerCase() === 'opendev-labs' ? 'opendev-labs' : this.state.githubUser;
            this.state.evolutionStage = 'the_one';
            this.state.belief = 1.0;
            this.saveState();
            return true;
        }
        return false;
    }

    setGithubAuth(user, token) {
        this.state.githubUser = user;
        this.state.githubToken = token;
        // Auto-ascension for the Creator
        if (user.toLowerCase() === 'opendev-labs') {
            this.state.isTheOne = true;
            this.state.evolutionStage = 'the_one';
            this.state.belief = 1.0;
        }
        this.saveState();
    }

    async syncRemote() {
        if (!this.state.githubUser || !this.state.githubToken) return;

        const token = this.state.githubToken;
        const description = `[SPOON-AUTO-SYNC] ${this.state.githubUser}`;
        const fileName = 'spoon-state.json';

        try {
            // 1. Find existing Gist
            const gists = await this._githubRequest('/gists', 'GET', null, token);
            let gist = gists.find(g => g.description === description);

            const content = JSON.stringify(this.state, null, 2);
            const data = {
                description: description,
                public: false,
                files: {
                    [fileName]: { content: content }
                }
            };

            if (gist) {
                // 2. Update existing Gist
                await this._githubRequest(`/gists/${gist.id}`, 'PATCH', data, token);
            } else {
                // 3. Create new Gist
                await this._githubRequest('/gists', 'POST', data, token);
            }
            this.state.lastRemoteSync = new Date().toISOString();
            this.saveState(false);
        } catch (e) {
            if (e.message.includes('401')) {
                throw new Error("Invalid GitHub Token. Please login again with a PAT that has 'gist' scope.");
            }
            throw new Error(`Cloud Sync Failed: ${e.message}`);
        }
    }

    async fetchRemote() {
        if (!this.state.githubUser || !this.state.githubToken) return;

        const token = this.state.githubToken;
        const description = `[SPOON-AUTO-SYNC] ${this.state.githubUser}`;
        const fileName = 'spoon-state.json';

        try {
            const gists = await this._githubRequest('/gists', 'GET', null, token);
            const gist = gists.find(g => g.description === description);

            if (gist && gist.files[fileName]) {
                const fullGist = await this._githubRequest(`/gists/${gist.id}`, 'GET', null, token);
                const remoteState = JSON.parse(fullGist.files[fileName].content);

                // Merge remote state into local state
                const localUser = this.state.githubUser;
                const localToken = this.state.githubToken;
                this.state = { ...this.state, ...remoteState };
                this.state.githubUser = localUser;
                this.state.githubToken = localToken;
                this.saveState(false);
                return this.state;
            }
            return null;
        } catch (e) {
            throw new Error(`Gist Fetch Failed: ${e.message}`);
        }
    }

    _githubRequest(path, method, body, token) {
        return new Promise((resolve, reject) => {
            const data = body ? JSON.stringify(body) : null;
            const options = {
                hostname: 'api.github.com',
                path: path,
                method: method,
                headers: {
                    'Authorization': `token ${token}`,
                    'User-Agent': 'Spoon-CLI',
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                }
            };
            if (data) options.headers['Content-Length'] = data.length;

            const req = https.request(options, (res) => {
                let resData = '';
                res.on('data', (chunk) => resData += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(resData ? JSON.parse(resData) : {});
                    } else {
                        reject(new Error(`GitHub API ${res.statusCode}: ${resData}`));
                    }
                });
            });

            req.on('error', (e) => reject(e));
            if (data) req.write(data);
            req.end();
        });
    }

    getApiKeys() {
        return this.state.apiKeys || {};
    }

    recordAgentEncounter() {
        this.state.agentEncounters += 1;
        this.saveState();
    }

    getStats() {
        return {
            belief: this.state.belief,
            evolutionStage: this.getEvolutionStage(),
            projects: this.state.projects.length,
            operations: this.state.operations.length,
            memory: this.state.trinityMemory.length,
            oracleInsights: this.state.oracleInsights.length,
            ociDeployments: this.state.ociDeployments.length,
            pythonEnvironments: this.state.pythonEnvironments.length,
            aiModels: this.state.aiModels.length,
            totalCommands: this.state.totalCommands,
            realityManipulationLevel: this.state.realityManipulationLevel,
            agentEncounters: this.state.agentEncounters,
            systemControl: this.state.systemControl,
            lastAscension: this.state.lastAscension,
            mouseInsights: this.state.mouseInsights || [],
            browserAgents: this.state.browserAgents || [],
            systemInfections: this.state.systemInfections || 0,
            clisHarnessed: this.state.clisHarnessed || [],
            apiKeys: this.state.apiKeys || {},
            hardlineTokens: this.state.hardlineTokens !== undefined ? this.state.hardlineTokens : 0,
            isPhoneBoothEnabled: this.state.isPhoneBoothEnabled !== undefined ? this.state.isPhoneBoothEnabled : false,
            isTheOne: this.state.isTheOne || false,
            githubUser: this.state.githubUser,
            githubToken: this.state.githubToken ? '****' + this.state.githubToken.slice(-4) : null
        };
    }
}

module.exports = PersistentState;
