const colors = require('./colors');
const {
    NEO_ASCII,
    TANK_ASCII,
    MORPHEUS_ASCII,
    ORACLE_ASCII,
    MOUSE_ASCII,
    PYTHON_ASCII
} = require('./ascii');
const PersistentState = require('./PersistentState');
const TankOperator = require('./TankOperator');
const TrinityCompanion = require('./TrinityCompanion');
const SeraphProtector = require('./SeraphProtector');
const MorpheusGuide = require('./MorpheusGuide');
const OracleSystem = require('./OracleSystem');
const PythonIntegration = require('./PythonIntegration');
const MouseProgrammer = require('./MouseProgrammer');
const SmithAgent = require('./SmithAgent');
const MorpheusTrainer = require('./MorpheusTrainer');
const { extractProjectName } = require('./helpers');

class MatrixAutoPilot {
    constructor(options = {}) {
        const tank = new TankOperator(options);
        this.operators = {
            TANK: tank,
            TRINITY: new TrinityCompanion(tank, this),
            SERAPH: new SeraphProtector(),
            MORPHEUS: new MorpheusGuide(),
            ORACLE: new OracleSystem(),
            PYTHON: new PythonIntegration(),
            MOUSE: new MouseProgrammer(),
            SMITH: new SmithAgent(),
            TRAINER: new MorpheusTrainer()
        };
        this.persistentState = new PersistentState();
    }

    async initiateNeoProtocol() {
        console.log(NEO_ASCII);
        console.log(`${colors.white}║ ${colors.green}NEO: ${colors.white}"I know you're out there. I can feel you now."${colors.reset}`);

        const stats = this.persistentState.getStats();
        console.log(`${colors.green}║ ${colors.white}SYSTEM: ${colors.cyan}Analyzing reality constructs...${colors.reset}`);

        const projects = stats.projects || [];
        if (projects.length > 0) {
            console.log(`${colors.green}║ ${colors.white}NEO: ${colors.cyan}"I see the projects: ${projects.map(p => p.name).join(', ')}"${colors.reset}`);
        }

        this.persistentState.updateBelief(0.2);
        this.persistentState.state.evolutionStage = "the_one";
        this.persistentState.saveState();

        console.log(`${colors.green}║ ${colors.white}NEO: ${colors.cyan}"I'm going to show these people what you don't want them to see."${colors.reset}`);
        return { success: true, evolution: "the_one" };
    }

    async initiateAutoPilot(neoCommand) {
        console.log(TANK_ASCII);
        console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}"I've got you, Neo. Initiating sequence..."${colors.reset}`);

        const guidance = await this.operators.TRINITY.guideNeo(neoCommand, { command: neoCommand });
        console.log(`${colors.green}║ ${colors.white}TRINITY: ${colors.cyan}"${guidance.message}"${colors.reset}`);

        // Route to the appropriate operator
        const result = await this.operators.TANK.executeUniversal(neoCommand, guidance, this);

        await this.operators.SERAPH.scanReality();

        return {
            success: true,
            guidance: guidance,
            result: result,
            belief: guidance.belief,
            evolution: guidance.evolution,
            totalCommands: guidance.totalCommands
        };
    }

    async awakenUser(command) {
        console.log(MORPHEUS_ASCII);
        console.log(`${colors.green}║ ${colors.white}MORPHEUS: ${colors.cyan}"Welcome to the real world."${colors.reset}`);

        const guidance = await this.operators.MORPHEUS.provideGuidance(command, { type: "awakening" });
        console.log(`${colors.green}║ ${colors.white}MORPHEUS: ${colors.cyan}"${guidance.guidance}"${colors.reset}`);

        const result = await this.operators.TANK.executeUniversal(command, guidance);

        console.log(`${colors.green}║ ${colors.white}MORPHEUS: ${colors.cyan}"${guidance.nextStep}"${colors.reset}`);

        return {
            guidance: guidance,
            result: result,
            belief: guidance.belief,
            stage: guidance.stage
        };
    }

    async consultOracle(command, options = {}) {
        console.log(ORACLE_ASCII);
        console.log(`${colors.yellow}║ ${colors.white}ORACLE: ${colors.cyan}"I know everything you need to know..."${colors.reset}`);

        const insight = await this.operators.ORACLE.provideInsight(command, options);
        console.log(`${colors.yellow}║ ${colors.white}ORACLE: ${colors.cyan}"${insight.insight}"${colors.reset}`);

        if (options.deployOCI) {
            console.log(`${colors.yellow}║ ${colors.white}ORACLE: ${colors.cyan}"Deploying to OCI Cloud Infrastructure..."${colors.reset}`);
            const deployment = await this.operators.ORACLE.deployToOCI({
                name: extractProjectName(command),
                type: this.determineProjectType(command),
                ...options
            });

            return {
                insight: insight,
                deployment: deployment,
                belief: insight.belief,
                ociEnabled: insight.ociEnabled
            };
        }

        return {
            insight: insight,
            belief: insight.belief,
            ociEnabled: insight.ociEnabled,
            recommendations: insight.recommendations
        };
    }

    async executeMouseTask(command, options = {}) {
        console.log(MOUSE_ASCII);
        console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"The programmer who created the woman in the red dress is here..."${colors.reset}`);

        if (options.agent || command.toLowerCase().includes('agent')) {
            const task = command.replace(/agent|deploy|create/gi, '').trim();
            const agentResult = await this.operators.MOUSE.deployBrowserAgent(task);
            console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Agent ${agentResult.agent.id} is now active in the matrix."${colors.reset}`);
            return agentResult;
        }

        const insight = await this.operators.MOUSE.provideInsight(command);
        console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"${insight.insight}"${colors.reset}`);

        if (options.run || command.toLowerCase().includes('run') || command.toLowerCase().includes('explore')) {
            const task = options.task || command;
            const result = await this.operators.MOUSE.runPlaywrightTask(task);
            if (result.success) {
                console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Matrix bypass complete. Data harvested."${colors.reset}`);
            } else {
                console.log(`${colors.red}║ ${colors.white}MOUSE: ${colors.cyan}"Bypass failed: ${result.error}"${colors.reset}`);
            }
            return result;
        }

        if (options.system || command.toLowerCase().includes('system') || command.toLowerCase().includes('shell')) {
            // Don't strip too much, just markers
            const sysCmd = command.replace(/system|shell|execute/gi, '').trim();
            const result = await this.operators.MOUSE.executeSystemCommand(sysCmd || 'ls -la');
            if (result.success) {
                console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"System manipulated. Results captured."${colors.reset}`);
                if (result.output) {
                    console.log(`${colors.white}${result.output.split('\n').slice(0, 10).join('\n')}${colors.reset}`);
                }
            } else {
                console.log(`${colors.red}║ ${colors.white}MOUSE: ${colors.cyan}"System resistance: ${result.error}"${colors.reset}`);
            }
            return result;
        }

        return insight;
    }

    async executeSmithTask(command, options = {}) {
        if (options.harness || command.toLowerCase().includes('harness')) {
            return await this.operators.SMITH.harnessCLI(command);
        }
        if (options.infect || command.toLowerCase().includes('infect') || command.toLowerCase().includes('take over')) {
            return await this.operators.SMITH.executeDominance(command);
        }
        return await this.operators.SMITH.doAnything(command);
    }

    async createPythonAI(command, options = {}) {
        console.log(PYTHON_ASCII);
        console.log(`${colors.green}║ ${colors.white}PYTHON: ${colors.cyan}"Creating AI development environment..."${colors.reset}`);

        const projectConfig = {
            name: extractProjectName(command),
            type: this.determineAIType(command),
            ...options
        };

        const result = await this.operators.PYTHON.createPythonEnvironment(projectConfig);

        if (result.success) {
            console.log(`${colors.green}║ ${colors.white}PYTHON: ${colors.cyan}"AI environment '${projectConfig.name}' created successfully!"${colors.reset}`);
            console.log(`${colors.green}║ ${colors.white}Next steps:${colors.reset}`);
            result.nextSteps.forEach(step => {
                console.log(`${colors.green}║ ${colors.white}  • ${step}${colors.reset}`);
            });
        } else {
            console.log(`${colors.red}║ ${colors.white}PYTHON: ${colors.cyan}"Failed to create environment: ${result.error}"${colors.reset}`);
        }

        return result;
    }

    determineProjectType(command) {
        const lower = command.toLowerCase();
        if (lower.includes('container')) return 'container';
        if (lower.includes('serverless')) return 'serverless';
        if (lower.includes('database')) return 'database';
        if (lower.includes('ai') || lower.includes('machine learning')) return 'ai';
        if (lower.includes('full-stack')) return 'full-stack';
        return 'web';
    }

    determineAIType(command) {
        const lower = command.toLowerCase();
        if (lower.includes('deep learning') || lower.includes('neural network')) return 'deep-learning';
        if (lower.includes('nlp') || lower.includes('natural language')) return 'nlp';
        if (lower.includes('computer vision') || lower.includes('cv')) return 'computer-vision';
        if (lower.includes('reinforcement') || lower.includes('rl')) return 'reinforcement-learning';
        if (lower.includes('full ai') || lower.includes('complete ai')) return 'full-ai';
        if (lower.includes('tensorflow')) return 'tensorflow';
        if (lower.includes('pytorch') || lower.includes('torch')) return 'pytorch';
        if (lower.includes('django')) return 'django';
        if (lower.includes('flask')) return 'flask';
        if (lower.includes('fastapi')) return 'fastapi';
        return 'basic';
    }

    detectMouseCommand(command) {
        const lower = command.toLowerCase();
        const isMouse = lower.includes('mouse') || lower.includes('browser') || lower.includes('playwright') || lower.includes('agent');
        return {
            isMouse: isMouse,
            agent: lower.includes('agent'),
            run: lower.includes('run') || lower.includes('exploit') || lower.includes('bypass')
        };
    }

    detectSmithCommand(command) {
        const lower = command.toLowerCase();
        const isSmith = lower.includes('smith') || lower.includes('dominance') || lower.includes('infection') || lower.includes('harness') || lower.includes('clawdbot') || lower.includes('do anything');
        return {
            isSmith: isSmith,
            harness: lower.includes('harness') || lower.includes('clawdbot'),
            infect: lower.includes('infect') || lower.includes('take over'),
            doAnything: lower.includes('anything')
        };
    }
}

module.exports = MatrixAutoPilot;
