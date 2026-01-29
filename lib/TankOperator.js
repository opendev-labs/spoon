const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn, exec } = require('child_process');
const colors = require('./colors');
const { TANK_ASCII, SPOON_ASCII } = require('./ascii');
const PersistentState = require('./PersistentState');
const ErrorHandler = require('./ErrorHandler');
const AIEngine = require('./AIEngine');
const { extractProjectName } = require('./helpers');

class TankOperator {
    constructor(options = {}) {
        this.verbose = options.verbose || false;
        this.quantum = options.quantum || false;
        this.architect = options.architect || false;
        this.context = [];
        this.cliRegistry = new Map();
        this.persistentState = new PersistentState();
        this.aiEngine = new AIEngine();
        this.registerAllCLIs();
    }

    registerAllCLIs() {
        // WEB DEVELOPMENT TOOLS
        this.cliRegistry.set('react', {
            name: 'React CLI',
            commands: {
                'create': 'npx create-react-app {name}',
                'start': 'cd {name} && npm start',
                'build': 'cd {name} && npm run build'
            },
            description: 'React application development'
        });

        this.cliRegistry.set('next', {
            name: 'Next.js CLI',
            commands: {
                'create': 'npx create-next-app@latest {name}',
                'dev': 'cd {name} && npm run dev',
                'build': 'cd {name} && npm run build'
            },
            description: 'Next.js framework'
        });

        this.cliRegistry.set('vue', {
            name: 'Vue CLI',
            commands: {
                'create': 'npm create vue@latest {name}',
                'dev': 'cd {name} && npm run dev'
            },
            description: 'Vue.js framework'
        });

        this.cliRegistry.set('node', {
            name: 'Node.js',
            commands: {
                'create': 'mkdir {name} && cd {name} && npm init -y',
                'api': 'cd {name} && npm install express cors'
            },
            description: 'Node.js backend development'
        });

        // PYTHON & AI TOOLS
        this.cliRegistry.set('python', {
            name: 'Python Environment',
            commands: {
                'create-venv': 'python3 -m venv {name}_env',
                'activate': process.platform === 'win32' ? '{name}_env\\Scripts\\activate' : 'source {name}_env/bin/activate',
                'install-deps': 'pip install -r requirements.txt',
                'freeze': 'pip freeze > requirements.txt',
                'run-server': 'python app.py',
                'jupyter': 'jupyter notebook',
                'notebook': 'jupyter lab'
            },
            description: 'Python virtual environments and AI development'
        });

        this.cliRegistry.set('django', {
            name: 'Django CLI',
            commands: {
                'create': 'django-admin startproject {name}',
                'startapp': 'python manage.py startapp {app}',
                'migrate': 'python manage.py migrate',
                'runserver': 'python manage.py runserver',
                'createsuperuser': 'python manage.py createsuperuser'
            },
            description: 'Django web framework'
        });

        this.cliRegistry.set('flask', {
            name: 'Flask',
            commands: {
                'create': 'mkdir {name} && cd {name} && touch app.py requirements.txt',
                'run': 'python app.py',
                'install': 'pip install flask python-dotenv',
                'env-setup': 'echo "FLASK_ENV=development" > .env'
            },
            description: 'Flask microframework'
        });

        this.cliRegistry.set('fastapi', {
            name: 'FastAPI',
            commands: {
                'create': 'mkdir {name} && cd {name} && touch main.py requirements.txt',
                'install': 'pip install fastapi uvicorn',
                'run': 'uvicorn main:app --reload',
                'create-full': 'pip install fastapi uvicorn sqlalchemy alembic'
            },
            description: 'FastAPI modern Python web framework'
        });

        // AI/ML SPECIFIC
        this.cliRegistry.set('tensorflow', {
            name: 'TensorFlow',
            commands: {
                'install': 'pip install tensorflow',
                'install-gpu': 'pip install tensorflow-gpu',
                'verify': 'python -c "import tensorflow as tf; print(tf.__version__)"'
            },
            description: 'TensorFlow machine learning framework'
        });

        this.cliRegistry.set('pytorch', {
            name: 'PyTorch',
            commands: {
                'install': 'pip install torch torchvision',
                'install-gpu': 'pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118',
                'verify': 'python -c "import torch; print(torch.__version__)"'
            },
            description: 'PyTorch deep learning framework'
        });

        this.cliRegistry.set('transformers', {
            name: 'Hugging Face',
            commands: {
                'install': 'pip install transformers datasets',
                'install-all': 'pip install transformers datasets accelerate',
                'test': 'python -c "from transformers import pipeline; print(pipeline(\"sentiment-analysis\")(\"I love AI!\"))"'
            },
            description: 'Hugging Face Transformers library'
        });

        // DEPLOYMENT TOOLS
        this.cliRegistry.set('vercel', {
            name: 'Vercel CLI',
            commands: {
                'deploy': 'vercel --prod --yes',
                'preview': 'vercel',
                'login': 'vercel login',
                'projects': 'vercel projects'
            },
            description: 'Vercel deployment platform'
        });

        this.cliRegistry.set('docker', {
            name: 'Docker CLI',
            commands: {
                'build': 'docker build -t {name} .',
                'run': 'docker run -p 3000:3000 {name}',
                'compose': 'docker-compose up'
            },
            description: 'Container management'
        });

        this.cliRegistry.set('aws', {
            name: 'AWS CLI',
            commands: {
                's3-list': 'aws s3 ls',
                'ec2-list': 'aws ec2 describe-instances',
                'deploy': 'aws deploy create-deployment'
            },
            description: 'Amazon Web Services'
        });

        this.cliRegistry.set('netlify', {
            name: 'Netlify CLI',
            commands: {
                'deploy': 'netlify deploy --prod',
                'init': 'netlify init',
                'sites': 'netlify sites:list'
            },
            description: 'Netlify deployment'
        });

        // OCI CLI
        this.cliRegistry.set('oci', {
            name: 'Oracle Cloud CLI',
            commands: {
                'deploy': 'oci compute instance launch --config-file {config}',
                'list-instances': 'oci compute instance list --compartment-id {compartment}',
                'create-bucket': 'oci os bucket create --name {name} --compartment-id {compartment}',
                'deploy-function': 'oci fn application deploy --config-file {config}'
            },
            description: 'Oracle Cloud Infrastructure'
        });
    }

    async executeCommand(command, options = {}) {
        console.log(`\n${colors.green}║ ${colors.white}EXECUTING: ${command}${colors.reset}`);
        console.log(`${colors.green}║ ${colors.white}${'─'.repeat(60)}${colors.reset}`);

        try {
            const child = spawn(command.split(' ')[0], command.split(' ').slice(1), {
                stdio: 'inherit',
                shell: true
            });

            return await new Promise((resolve, reject) => {
                child.on('close', (code) => {
                    console.log(`${colors.green}║ ${colors.white}${'─'.repeat(60)}${colors.reset}`);
                    if (code === 0) {
                        console.log(`${colors.green}║ ${colors.white}COMMAND COMPLETED SUCCESSFULLY${colors.reset}`);
                        resolve({ success: true, code });
                    } else {
                        console.log(`${colors.red}║ ${colors.white}COMMAND FAILED WITH CODE ${code}${colors.reset}`);
                        reject(new Error(`Command failed with code ${code}`));
                    }
                });

                child.on('error', (error) => {
                    console.log(`${colors.green}║ ${colors.white}${'─'.repeat(60)}${colors.reset}`);
                    console.log(`${colors.red}║ ${colors.white}PROCESS ERROR: ${error.message}${colors.reset}`);
                    reject(error);
                });
            });

        } catch (error) {
            const errorMsg = error.message;
            console.log(`${colors.green}║ ${colors.white}${'─'.repeat(60)}${colors.reset}`);
            console.log(`${colors.red}║ ${colors.white}MATRIX INSTABILITY: ${errorMsg}${colors.reset}`);
            console.log(`${colors.green}║ ${colors.white}${ErrorHandler.getSuggestion(errorMsg, command)}${colors.reset}`);
            return { success: false, error: errorMsg };
        }
    }

    async executeCommandWithChecks(command, projectName) {
        if ((command.includes('create') || command.includes('mkdir')) && projectName && fs.existsSync(projectName)) {
            const error = `Directory ${projectName} already exists`;
            console.log(`${colors.red}║ ${colors.white}${error}${colors.reset}`);
            console.log(`${colors.green}║ ${colors.white}Suggestion: Try "spoon create react ${projectName}-v2"${colors.reset}`);

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            return new Promise((resolve) => {
                rl.question(`${colors.green}║ ${colors.white}Continue anyway? (y/N): ${colors.reset}`, (answer) => {
                    rl.close();
                    if (answer.toLowerCase() === 'y') {
                        console.log(`${colors.green}║ ${colors.white}Proceeding with existing directory...${colors.reset}`);
                        return this.executeCommand(command);
                    } else {
                        resolve({ success: false, error: 'User cancelled due to existing directory' });
                    }
                });
            });
        }

        return await this.executeCommand(command);
    }

    extractProjectName(input) {
        return extractProjectName(input);
    }

    detectFullStackCommand(input) {
        const lower = input.toLowerCase();
        const hasReact = lower.includes('react') || lower.includes('frontend');
        const hasNode = lower.includes('node') || lower.includes('backend') || lower.includes('api');
        const hasNext = lower.includes('next');
        const hasPython = lower.includes('python') || lower.includes('django') || lower.includes('flask');

        if (lower.includes('full-stack') || (hasReact && hasNode) || (hasNext && hasNode) || (hasReact && hasPython)) {
            return {
                isFullStack: true,
                frontend: hasNext ? 'next' : 'react',
                backend: hasPython ? 'python' : (hasNode ? 'node' : 'express'),
                projectName: this.extractProjectName(input)
            };
        }
        return { isFullStack: false };
    }

    detectPythonAICommand(input) {
        const lower = input.toLowerCase();
        const hasPython = lower.includes('python') || lower.includes('ai') || lower.includes('machine learning') ||
            lower.includes('tensorflow') || lower.includes('pytorch') || lower.includes('django') ||
            lower.includes('flask') || lower.includes('fastapi');

        if (hasPython) {
            return {
                isPythonAI: true,
                projectName: this.extractProjectName(input),
                type: this.determinePythonType(lower)
            };
        }
        return { isPythonAI: false };
    }

    determinePythonType(input) {
        if (input.includes('django')) return 'django';
        if (input.includes('flask')) return 'flask';
        if (input.includes('fastapi')) return 'fastapi';
        if (input.includes('tensorflow') || input.includes('deep learning')) return 'tensorflow';
        if (input.includes('pytorch')) return 'pytorch';
        if (input.includes('ai') || input.includes('machine learning')) return 'ai';
        return 'python';
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

    async executeUniversal(command, guidance, autoPilot) {
        const fullStackInfo = this.detectFullStackCommand(command);
        const pythonAIInfo = this.detectPythonAICommand(command);

        if (fullStackInfo.isFullStack) {
            return await this.executeFullStackCreation(fullStackInfo, command, guidance);
        }

        if (pythonAIInfo.isPythonAI) {
            return await this.executePythonAICreation(pythonAIInfo, command, guidance);
        }

        const mouseInfo = this.detectMouseCommand(command);
        if (mouseInfo.isMouse) {
            // If we have autoPilot reference, use its executeMouseTask
            if (autoPilot) {
                return await autoPilot.executeMouseTask(command, { task: command, ...mouseInfo });
            }
            return { success: false, error: "Matrix bypass required. (AutoPilot context missing)" };
        }

        const smithInfo = this.detectSmithCommand(command);
        if (smithInfo.isSmith) {
            if (autoPilot) {
                return await autoPilot.executeSmithTask(command, { task: command, ...smithInfo });
            }
            return { success: false, error: "System Dominance protocol requires Smith agent access." };
        }

        const contexts = {
            "create": "scaffolding reality...",
            "deploy": "bending deployment vectors...",
            "build": "constructing digital matter...",
            "setup": "configuring reality parameters...",
            "python": "weaving python magic...",
            "ai": "activating neural networks..."
        };

        const context = Object.entries(contexts).find(([key]) =>
            command.toLowerCase().includes(key)
        )?.[1] || "manipulating code reality...";

        console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}${context}${colors.reset}`);

        await this.simulateRealityBending();

        // 1. Try AIEngine for refined weaponized execution first
        const aiAnalysis = this.aiEngine.analyzeIntent(command);
        const aiPlan = this.aiEngine.createExecutionPlan(aiAnalysis);

        if (aiPlan.length > 0) {
            console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}AIEngine identified weapons for intent: ${aiAnalysis.intent}${colors.reset}`);
            for (const weapon of aiPlan) {
                console.log(`${colors.green}║ ${colors.white}LOADING: ${weapon.name}...${colors.reset}`);
                await this.executeCommandWithChecks(weapon.command, aiAnalysis.projectName);
            }

            this.persistentState.addProject({
                name: aiAnalysis.projectName,
                type: aiAnalysis.intent,
                command: command
            });

            return {
                status: "REALITY_BENT_BY_AI",
                command: command,
                timestamp: new Date().toISOString(),
                belief: guidance.belief,
                success: true
            };
        }

        // 2. Fallback to standard intent analysis
        const analysis = this.analyzeIntent(command);
        const executionPlan = this.createExecutionPlan(analysis);

        if (executionPlan.length > 0) {
            const result = await this.executePlan(executionPlan, analysis.target);

            if (result.success) {
                this.persistentState.addOperation({
                    command: command,
                    type: analysis.cliTool || 'general',
                    project: analysis.target,
                    success: true
                });

                this.persistentState.addProject({
                    name: analysis.target,
                    type: analysis.cliTool || 'custom',
                    command: command
                });
            }

            return {
                status: result.success ? "REALITY_BENT" : "MATRIX_GLITCH",
                command: command,
                timestamp: new Date().toISOString(),
                belief: guidance.belief,
                success: result.success
            };
        }

        return {
            status: "NO_OPERATION",
            command: command,
            timestamp: new Date().toISOString(),
            belief: guidance.belief,
            success: false
        };
    }

    async executeFullStackCreation(fullStackInfo, command, guidance) {
        console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Constructing full-stack reality...${colors.reset}`);

        const projectName = fullStackInfo.projectName;

        await this.simulateRealityBending();

        let frontendSuccess = true;
        let backendSuccess = true;

        console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Building ${fullStackInfo.frontend} frontend...${colors.reset}`);
        const frontendCmd = fullStackInfo.frontend === 'react'
            ? `npx create-react-app ${projectName}-frontend`
            : `npx create-next-app@latest ${projectName}-frontend`;

        const frontendResult = await this.executeCommandWithChecks(frontendCmd, projectName + '-frontend');
        frontendSuccess = frontendResult.success;

        console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Building ${fullStackInfo.backend} backend...${colors.reset}`);
        let backendCmd;
        if (fullStackInfo.backend === 'python') {
            backendCmd = `mkdir ${projectName}-backend && cd ${projectName}-backend && python3 -m venv env && source env/bin/activate && pip install flask flask-cors`;
        } else {
            backendCmd = `mkdir ${projectName}-backend && cd ${projectName}-backend && npm init -y && npm install express cors`;
        }

        const backendResult = await this.executeCommandWithChecks(backendCmd, projectName + '-backend');
        backendSuccess = backendResult.success;

        if (frontendSuccess && backendSuccess) {
            console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Full-stack architecture established${colors.reset}`);

            this.persistentState.addProject({
                name: projectName,
                type: 'full-stack',
                frontend: fullStackInfo.frontend,
                backend: fullStackInfo.backend,
                command: command
            });
        } else {
            console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Partial success - check components${colors.reset}`);
        }

        return {
            status: frontendSuccess && backendSuccess ? "FULL_STACK_CREATED" : "PARTIAL_SUCCESS",
            project: projectName,
            frontend: fullStackInfo.frontend,
            backend: fullStackInfo.backend,
            frontendSuccess,
            backendSuccess,
            belief: guidance.belief
        };
    }

    async executePythonAICreation(pythonAIInfo, command, guidance) {
        console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Weaving Python AI reality...${colors.reset}`);

        const projectName = pythonAIInfo.projectName;
        const projectType = pythonAIInfo.type;

        await this.simulateRealityBending();

        let success = true;

        console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Creating ${projectType} environment...${colors.reset}`);

        let creationCmd;
        switch (projectType) {
            case 'django':
                creationCmd = `django-admin startproject ${projectName} && cd ${projectName} && python manage.py startapp api`;
                break;
            case 'flask':
                creationCmd = `mkdir ${projectName} && cd ${projectName} && touch app.py requirements.txt && echo "from flask import Flask\n\napp = Flask(__name__)\n\n@app.route('/')\ndef hello():\n    return 'Hello, AI World!'\n\nif __name__ == '__main__':\n    app.run(debug=True)" > app.py`;
                break;
            case 'fastapi':
                creationCmd = `mkdir ${projectName} && cd ${projectName} && touch main.py requirements.txt && echo "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/')\ndef read_root():\n    return {'message': 'Hello, FastAPI World!'}" > main.py`;
                break;
            case 'tensorflow':
                creationCmd = `mkdir ${projectName} && cd ${projectName} && python3 -m venv tf_env && source tf_env/bin/activate && pip install tensorflow numpy matplotlib`;
                break;
            case 'pytorch':
                creationCmd = `mkdir ${projectName} && cd ${projectName} && python3 -m venv torch_env && source torch_env/bin/activate && pip install torch torchvision numpy`;
                break;
            default:
                creationCmd = `mkdir ${projectName} && cd ${projectName} && python3 -m venv ai_env && source ai_env/bin/activate && pip install numpy pandas matplotlib scikit-learn jupyter`;
        }

        const result = await this.executeCommandWithChecks(creationCmd, projectName);
        success = result.success;

        if (success) {
            console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Python ${projectType} environment created${colors.reset}`);

            this.persistentState.addProject({
                name: projectName,
                type: projectType,
                language: 'python',
                command: command
            });

            this.persistentState.addPythonEnvironment({
                name: projectName,
                type: projectType,
                status: 'CREATED'
            });
        } else {
            console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}Python environment creation had issues${colors.reset}`);
        }

        return {
            status: success ? "PYTHON_AI_CREATED" : "PYTHON_CREATION_FAILED",
            project: projectName,
            type: projectType,
            success: success,
            belief: guidance.belief
        };
    }

    async executePlan(plan, target) {
        console.log(`\n${colors.green}║ ${colors.white}TANK: ${colors.cyan}EXECUTING REALITY MANIPULATION...${colors.reset}`);
        console.log(`${colors.green}║ ${colors.white}PLAN: ${plan.length} STEP(S)${colors.reset}`);

        let allSuccess = true;
        let currentStep = 1;

        for (const step of plan) {
            console.log(`\n${colors.green}║ ${colors.white}STEP ${currentStep}/${plan.length}: ${step.description}${colors.reset}`);
            console.log(`${colors.green}║ ${colors.white}COMMAND: ${step.command}${colors.reset}`);

            try {
                const result = await this.executeCommandWithChecks(step.command, target);
                if (result.success) {
                    console.log(`${colors.green}║ ${colors.white}STEP ${currentStep} COMPLETED${colors.reset}`);
                } else {
                    console.log(`${colors.red}║ ${colors.white}STEP ${currentStep} FAILED${colors.reset}`);
                    allSuccess = false;

                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

                    const continueAnswer = await new Promise((resolve) => {
                        rl.question(`${colors.green}║ ${colors.white}CONTINUE WITH REMAINING STEPS? (y/N): ${colors.reset}`, (answer) => {
                            rl.close();
                            resolve(answer.toLowerCase() === 'y');
                        });
                    });

                    if (!continueAnswer) {
                        console.log(`${colors.green}║ ${colors.white}OPERATION CANCELLED BY USER${colors.reset}`);
                        return { success: false, cancelled: true };
                    }
                }
            } catch (error) {
                console.log(`${colors.red}║ ${colors.white}STEP ${currentStep} FAILED: ${error.message}${colors.reset}`);
                allSuccess = false;
            }

            currentStep++;
            await this.delay(500);
        }

        if (allSuccess) {
            console.log(`\n${colors.green}║ ${colors.white}REALITY STABILIZED. ${target} IS NOW OPERATIONAL.${colors.reset}`);
        } else {
            console.log(`\n${colors.green}║ ${colors.white}REALITY PARTIALLY STABILIZED. SOME ANOMALIES DETECTED.${colors.reset}`);
        }

        return { success: allSuccess };
    }

    async simulateRealityBending() {
        const bends = [
            "Recalibrating quantum states...",
            "Rewriting terminal physics...",
            "Injecting AI consciousness...",
            "Bypassing normal CLI constraints...",
            "Accessing deeper matrix layers...",
            "Bending code reality streams..."
        ];

        for (const bend of bends) {
            console.log(`${colors.green}║ ${colors.white}${bend}${colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }

    analyzeIntent(input) {
        const lower = input.toLowerCase();

        let cliTool = '';
        let action = '';
        let target = this.extractProjectName(input);

        const cliPatterns = {
            'react': ['react', 'frontend', 'ui'],
            'next': ['next', 'nextjs'],
            'vue': ['vue', 'vuejs'],
            'node': ['node', 'backend', 'api', 'server'],
            'python': ['python', 'py', 'ai', 'machine learning', 'ml'],
            'django': ['django'],
            'flask': ['flask'],
            'fastapi': ['fastapi'],
            'tensorflow': ['tensorflow', 'tf'],
            'pytorch': ['pytorch', 'torch'],
            'transformers': ['transformers', 'huggingface'],
            'vercel': ['vercel', 'deploy', 'host'],
            'docker': ['docker', 'container'],
            'aws': ['aws', 'amazon'],
            'netlify': ['netlify'],
            'oci': ['oci', 'oracle', 'oracle cloud']
        };

        for (const [tool, patterns] of Object.entries(cliPatterns)) {
            if (patterns.some(pattern => lower.includes(pattern))) {
                cliTool = tool;
                break;
            }
        }

        const actionPatterns = {
            'create': ['create', 'make', 'build', 'generate', 'new'],
            'deploy': ['deploy', 'publish', 'release', 'host'],
            'start': ['start', 'run', 'begin', 'launch'],
            'build': ['build', 'compile'],
            'install': ['install', 'setup', 'configure']
        };

        for (const [act, patterns] of Object.entries(actionPatterns)) {
            if (patterns.some(pattern => lower.includes(pattern))) {
                action = act;
                break;
            }
        }

        return {
            cliTool,
            action,
            target,
            rawInput: input
        };
    }

    createExecutionPlan(analysis) {
        const { cliTool, action, target } = analysis;
        const plan = [];

        if (cliTool && this.cliRegistry.has(cliTool)) {
            const cli = this.cliRegistry.get(cliTool);
            const command = cli.commands[action] || cli.commands['create'];

            if (command) {
                const finalCommand = command.replace(/{name}/g, target);

                plan.push({
                    tool: cliTool,
                    action,
                    command: finalCommand,
                    description: `${cli.name}: ${action} ${target}`
                });
            }
        }

        return plan;
    }

    async startInteractiveMode() {
        const TrinityCompanion = require('./TrinityCompanion');
        const OracleSystem = require('./OracleSystem');
        const PythonIntegration = require('./PythonIntegration');
        const MatrixAutoPilot = require('./MatrixAutoPilot');

        const trinity = new TrinityCompanion();
        const oracle = new OracleSystem();
        const python = new PythonIntegration();
        const stats = trinity.getStats();

        console.log(`\n${colors.green}TANK Universal CLI Operator Activated${colors.reset}`);
        console.log(`${colors.cyan}Natural language commands for CLI tools${colors.reset}`);
        console.log(`${colors.green}Trinity is watching over you, Neo${colors.reset}`);
        console.log(`${colors.cyan}Your evolution: ${stats.evolutionStage} | Belief: ${(stats.belief * 100).toFixed(1)}%${colors.reset}`);
        console.log(`${colors.yellow}Oracle Insights: ${stats.oracleInsights} | OCI Deployments: ${stats.ociDeployments}${colors.reset}`);
        console.log(`${colors.green}Python Environments: ${stats.pythonEnvironments} | AI Models: ${stats.aiModels}${colors.reset}`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `${colors.green}TANK>${colors.reset} `
        });

        rl.prompt();

        rl.on('line', async (input) => {
            const command = input.trim();

            if (command === 'exit') {
                console.log(`${colors.green}Returning to mainframe...${colors.reset}`);
                console.log(`${colors.green}Trinity: "I'll be here when you need me, Neo."${colors.reset}`);
                rl.close();
                return;
            }

            switch (command) {
                case 'clis':
                    this.showAvailableCLIs();
                    break;
                case 'status':
                    this.showStatus();
                    break;
                case 'verbose':
                    this.verbose = !this.verbose;
                    console.log(`${colors.green}Verbose mode: ${this.verbose ? 'ON' : 'OFF'}${colors.reset}`);
                    break;
                case 'help':
                    this.showHelp();
                    break;
                case 'clear':
                    console.clear();
                    console.log(TANK_ASCII);
                    break;
                case 'belief':
                    const currentStats = trinity.getStats();
                    console.log(`${colors.green}Trinity: "Your belief level is ${(currentStats.belief * 100).toFixed(1)}% after ${currentStats.totalCommands} commands"${colors.reset}`);
                    break;
                case 'oracle-status':
                    console.log(`${colors.yellow}Oracle System: ${oracle.ociEnabled ? 'OCI READY' : 'OCI NOT CONFIGURED'}${colors.reset}`);
                    if (!oracle.ociEnabled) {
                        console.log(`${colors.yellow}Setup OCI:${colors.reset}`);
                        oracle.getOCISetupInstructions().forEach(instruction => {
                            console.log(`  ${colors.white}${instruction}${colors.reset}`);
                        });
                    }
                    break;
                case 'python-status':
                    console.log(`${colors.green}Python Integration: ${python.pythonEnabled ? 'PYTHON READY' : 'PYTHON NOT FOUND'}${colors.reset}`);
                    if (!python.pythonEnabled) {
                        console.log(`${colors.green}Setup Python:${colors.reset}`);
                        python.getPythonSetupInstructions().forEach(instruction => {
                            console.log(`  ${colors.white}${instruction}${colors.reset}`);
                        });
                    }
                    break;
                case 'reset':
                    try {
                        const stateFile = path.join(process.cwd(), '.spoon-state.json');
                        if (fs.existsSync(stateFile)) {
                            fs.unlinkSync(stateFile);
                        }
                        console.log(`${colors.green}Matrix reset. Your journey begins anew.${colors.reset}`);
                    } catch (e) {
                        console.log(`${colors.red}Could not reset matrix: ${e.message}${colors.reset}`);
                    }
                    break;
                default:
                    const autoPilot = new MatrixAutoPilot({ verbose: this.verbose });
                    await autoPilot.initiateAutoPilot(command);
            }

            if (!rl.closed) rl.prompt();
        });
    }

    async startPythonMode() {
        const PythonIntegration = require('./PythonIntegration');
        const MatrixAutoPilot = require('./MatrixAutoPilot');

        const python = new PythonIntegration();
        const stats = this.persistentState.getStats();

        console.log(`\n${colors.green}PYTHON AI DEVELOPMENT MODE${colors.reset}`);
        console.log(`${colors.cyan}Python: ${python.pythonEnabled ? 'READY' : 'NOT FOUND'}${colors.reset}`);
        console.log(`${colors.cyan}Python Environments: ${stats.pythonEnvironments}${colors.reset}`);
        console.log(`${colors.cyan}AI Models: ${stats.aiModels}${colors.reset}`);

        if (!python.pythonEnabled) {
            console.log(`${colors.red}Python not found. Please install Python 3.7+${colors.reset}`);
            python.getPythonSetupInstructions().forEach(instruction => {
                console.log(`  ${colors.white}${instruction}${colors.reset}`);
            });
            return;
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `${colors.green}PYTHON>${colors.reset} `
        });

        rl.prompt();

        const autoPilot = new MatrixAutoPilot({ verbose: this.verbose });

        rl.on('line', async (input) => {
            const command = input.trim();

            if (command === 'exit') {
                console.log(`${colors.green}Returning to main operator...${colors.reset}`);
                rl.close();
                return;
            }

            if (command.startsWith('create')) {
                await autoPilot.createPythonAI(command);
            } else {
                await autoPilot.initiateAutoPilot(command);
            }

            if (!rl.closed) rl.prompt();
        });
    }

    async delegateTask(input) {
        const MatrixAutoPilot = require('./MatrixAutoPilot');
        const normalized = input.toLowerCase();
        const autoPilot = new MatrixAutoPilot({ verbose: this.verbose });

        // Routing Logic
        // 1. TRINITY: Questions, status, info, help
        if (normalized.match(/^(who|what|where|when|why|how|explain|analyze|status|help|trinity)/)) {
            console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Routing query to Trinity..."${colors.reset}`);
            return await autoPilot.operators.TRINITY.talk(input);
        }

        // 2. MOUSE: Browser automation and UI design specifically
        if (normalized.match(/^(mouse\s+|browser\s+|playwright\s+|agent\s+)/) || (normalized.match(/(ui|component|button|card|form|page)/) && !normalized.match(/(create|make|build|generate)/))) {
            console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Tasking Mouse with construction..."${colors.reset}`);
            // Check for UI generation specific keywords
            if (normalized.match(/(ui|component|button|toggle|card|form|page)/)) {
                return await autoPilot.operators.MOUSE.generateUI(input);
            }
            return await autoPilot.executeMouseTask(input, autoPilot.detectMouseCommand(input));
        }

        // 3. SMITH: Hack, harness, infect, control, cli
        if (normalized.match(/(smith|hack|harness|infect|take over|control|cli|terminal|command)/)) {
            console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Agent Smith deployed for system dominance."${colors.reset}`);
            // Extract potential CLI name if "harness <name>" pattern exists
            const harnessMatch = normalized.match(/harness\s+(\w+)/);
            if (harnessMatch) {
                return await autoPilot.operators.SMITH.harnessCLI(harnessMatch[1]);
            }
            return await autoPilot.operators.SMITH.executeDominance(input);
        }

        // 4. SERAPH: Security, scan, protect, audit
        if (normalized.match(/(scan|protect|audit|check|security|safe|seraph)/)) {
            console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Seraph validation protocols engaged."${colors.reset}`);
            return await autoPilot.operators.SERAPH.scanReality();
        }

        // 5. MORPHEUS: Train, learn, guide, teach
        if (normalized.match(/(train|learn|guide|teach|morpheus|tutorial)/)) {
            console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Morpheus will show you the way."${colors.reset}`);
            // Extract project if present
            const projectMatch = normalized.match(/(lamadb|qbet|void|transcenders)/);
            if (projectMatch) {
                const MorpheusTrainer = require('./MorpheusTrainer');
                const trainer = new MorpheusTrainer();
                return await trainer.train(projectMatch[1]);
            }
            const MorpheusTrainer = require('./MorpheusTrainer');
            const trainer = new MorpheusTrainer();
            return await trainer.train('spoon'); // Default training
        }

        // Default: Treat as a general command for AutoPilot to figure out or pass to Trinity
        console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Unclear target. Constructing solution..."${colors.reset}`);
        return await autoPilot.initiateAutoPilot(input);
    }

    async showWelcomeAndExit() {
        console.log(colors.cyan + `
    ███████╗██████╗  ██████╗  ██████╗ ███╗   ██╗
    ██╔════╝██╔══██╗██╔═══██╗██╔═══██╗████╗  ██║
    ███████╗██████╔╝██║   ██║██║   ██║██╔██╗ ██║
    ╚════██║██╔═══╝ ██║   ██║██║   ██║██║╚██╗██║
    ███████║██║     ╚██████╔╝╚██████╔╝██║ ╚████║
    ╚══════╝╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝
                    there is no spoon
    ` + colors.reset);

        console.log(`
${colors.white}Welcome to SPOON - Your Personal Coding Assistant.${colors.reset}

${colors.green}Spoon is here to help you build software without the headache. It is a smart tool that
understands simple English commands. You don't need to memorize complex code or
commands.

What Spoon can do for you:
• Create Websites: Just ask "make a portfolio" or "build a landing page".
• Build Apps: Ask for "react app" or "python project" and it happens.
• Fix Code: If something breaks, Spoon can help find the error.
• Teach You: It can explain how things work in simple terms.

Spoon connects to powerful AI to turn your ideas into working code. It handles the
boring setup parts so you can focus on building something amazing.

${colors.green}Spoon is an intelligent operator that understands natural language.
Here is how to use it:${colors.reset}

${colors.cyan}1. FIRST COMMAND:${colors.reset}
   Type ${colors.green}help${colors.reset} to see all available tools and system status.

${colors.cyan}2. TRINITY (Information & Intelligence):${colors.reset}
   Use for questions, analysis, or status checks.
   • ${colors.white}spoon explain how this works${colors.reset}
   • ${colors.white}spoon status${colors.reset}

${colors.cyan}3. MOUSE (Creation & Building):${colors.reset}
   Use for creating apps, websites, or UI components.
   • ${colors.white}spoon create react app my-portfolio${colors.reset}
   • ${colors.white}spoon build a landing page${colors.reset}
   • ${colors.white}spoon make a python script${colors.reset}

${colors.cyan}4. SMITH (System & Control):${colors.reset}
   Use for terminal commands, CLI hacking, or system control.
   • ${colors.white}spoon harness vercel${colors.reset}
   • ${colors.white}spoon run command ls -la${colors.reset}

${colors.cyan}5. SERAPH (Security & Auditing):${colors.reset}
   Use for scanning projects and security checks.
   • ${colors.white}spoon scan this directory${colors.reset}
   • ${colors.white}spoon audit security${colors.reset}

${colors.cyan}6. MORPHEUS (Training & Guidance):${colors.reset}
   Use for learning new systems or getting guided help.
   • ${colors.white}spoon train on lamadb${colors.reset}
   • ${colors.white}spoon guide me${colors.reset}
`);
    }

    showAvailableCLIs() {
        console.log(`\n${colors.green}Available Reality Manipulation Tools:${colors.reset}`);

        const categories = {
            'Web Development': ['react', 'next', 'vue', 'node'],
            'Python & AI': ['python', 'django', 'flask', 'fastapi', 'tensorflow', 'pytorch', 'transformers'],
            'Deployment': ['vercel', 'docker', 'aws', 'netlify', 'oci']
        };

        Object.entries(categories).forEach(([category, tools]) => {
            console.log(`\n${colors.cyan}${category}:${colors.reset}`);
            tools.forEach(tool => {
                if (this.cliRegistry.has(tool)) {
                    const cli = this.cliRegistry.get(tool);
                    console.log(`  ${colors.green}${tool}${colors.reset}: ${cli.description}`);
                }
            });
        });
    }

    showStatus() {
        const TrinityCompanion = require('./TrinityCompanion');
        const OracleSystem = require('./OracleSystem');
        const PythonIntegration = require('./PythonIntegration');

        const trinity = new TrinityCompanion();
        const oracle = new OracleSystem();
        const python = new PythonIntegration();
        const stats = trinity.getStats();

        console.log(`\n${colors.green}TANK Operator Status:${colors.reset}`);
        console.log(`  ${colors.cyan}Evolution Stage:${colors.reset} ${stats.evolutionStage}`);
        console.log(`  ${colors.cyan}Belief Level:${colors.reset} ${(stats.belief * 100).toFixed(1)}%`);
        console.log(`  ${colors.cyan}System Control:${colors.reset} ${(stats.systemControl * 100).toFixed(1)}%`);
        console.log(`  ${colors.cyan}Reality Manipulation:${colors.reset} ${stats.realityManipulationLevel}`);
        console.log(`  ${colors.cyan}CLI Tools:${colors.reset} ${this.cliRegistry.size} registered`);
        console.log(`  ${colors.cyan}Projects:${colors.reset} ${stats.projects.length} managed`);
        console.log(`  ${colors.cyan}Total Commands:${colors.reset} ${stats.totalCommands}`);
        console.log(`  ${colors.cyan}Oracle Insights:${colors.reset} ${stats.oracleInsights}`);
        console.log(`  ${colors.cyan}OCI Deployments:${colors.reset} ${stats.ociDeployments}`);
        console.log(`  ${colors.cyan}Python Environments:${colors.reset} ${stats.pythonEnvironments}`);
        console.log(`  ${colors.cyan}AI Models:${colors.reset} ${stats.aiModels}`);
        console.log(`  ${colors.cyan}OCI Ready:${colors.reset} ${oracle.ociEnabled ? 'YES' : 'NO'}`);
        console.log(`  ${colors.cyan}Python Ready:${colors.reset} ${python.pythonEnabled ? 'YES' : 'NO'}`);
    }

    showHelp() {
        console.log(`\n${colors.green}SPOON Universal CLI Commands:${colors.reset}`);
        console.log(`  ${colors.cyan}Reality Manipulation Examples:${colors.reset}`);
        console.log(`    create react app my-app`);
        console.log(`    deploy to vercel`);
        console.log(`    create full-stack app with react and node`);
        console.log(`    deploy to oci with auto-scaling`);
        console.log(`  ${colors.cyan}Python AI Examples:${colors.reset}`);
        console.log(`    create python ai environment my-ai`);
        console.log(`    create django project my-api`);
        console.log(`    create tensorflow deep learning project`);
        console.log(`    deploy python flask app to oci`);
        console.log(`  ${colors.cyan}Oracle Commands:${colors.reset}`);
        console.log(`    oracle "predict my infrastructure costs" --cost-analysis`);
        console.log(`    oracle "deploy ai microservice" --deploy-oci`);
        console.log(`  ${colors.cyan}System Commands:${colors.reset}`);
        console.log(`    clis - Show available reality tools`);
        console.log(`    status - System evolution status`);
        console.log(`    verbose - Toggle detailed vision`);
        console.log(`    belief - Show current belief level`);
        console.log(`    oracle-status - Check Oracle system status`);
        console.log(`    python-status - Check Python integration status`);
        console.log(`    reset - Reset matrix state`);
        console.log(`    help - This message`);
        console.log(`    mouse - Invoke MOUSE for browser tasks`);
        console.log(`    smith - Invoke SMITH for system dominance`);
        console.log(`    exit - End session`);
    }

    execute(task) {
        return new Promise((resolve) => {
            console.log(`${colors.green}║ ${colors.white}TANK: ${colors.cyan}"Direct line established. Executing: ${task}"${colors.reset}`);
            exec(task, (error, stdout, stderr) => {
                if (stdout) console.log(`${colors.white}${stdout}${colors.reset}`);
                if (stderr) console.error(`${colors.red}${stderr}${colors.reset}`);
                if (error) {
                    console.log(`${colors.red}║ ${colors.white}TANK: "The line went dead: ${error.message}"${colors.reset}`);
                }
                resolve({ success: !error, stdout, stderr }); // Crucial: This closes the "Phone Call"
            });
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = TankOperator;
