const { execSync } = require('child_process');
const colors = require('./colors');
const PersistentState = require('./PersistentState');

class PythonIntegration {
    constructor() {
        this.persistentState = new PersistentState();
        this.pythonEnabled = this.checkPythonEnabled();
        this.isWindows = process.platform === 'win32';
    }

    checkPythonEnabled() {
        try {
            execSync('which python3', { stdio: 'ignore' });
            return true;
        } catch (e) {
            try {
                execSync('which python', { stdio: 'ignore' });
                return true;
            } catch (e) {
                return false;
            }
        }
    }

    async createPythonEnvironment(projectConfig) {
        if (!this.pythonEnabled) {
            return {
                success: false,
                error: "Python not found. Install Python 3.7+ first.",
                setupInstructions: this.getPythonSetupInstructions()
            };
        }

        console.log(`${colors.green}║ ${colors.white}PYTHON: ${colors.cyan}"Creating AI development environment..."${colors.reset}`);

        try {
            const envSteps = [
                "Creating virtual environment...",
                "Installing core dependencies...",
                "Setting up AI/ML frameworks...",
                "Configuring development tools...",
                "Initializing project structure..."
            ];

            for (const step of envSteps) {
                console.log(`${colors.green}║ ${colors.white}${step}${colors.reset}`);
                await this.delay(600);
            }

            // FIXED: Platform-independent commands
            const commands = [
                `python3 -m venv ${projectConfig.name}_env`,
                `cd ${projectConfig.name}_env && ${this.isWindows ? 'Scripts\\pip' : 'bin/pip'} install --upgrade pip`,
                `cd ${projectConfig.name}_env && ${this.isWindows ? 'Scripts\\pip' : 'bin/pip'} install numpy pandas matplotlib`,
                `mkdir -p ${projectConfig.name}/src ${projectConfig.name}/models ${projectConfig.name}/data`
            ];

            for (const cmd of commands) {
                try {
                    execSync(cmd, { stdio: 'pipe', shell: true });
                    console.log(`${colors.green}║ ${colors.white}✓ ${cmd.split('&&')[0].trim()}${colors.reset}`);
                } catch (e) {
                    console.log(`${colors.yellow}║ ${colors.white}⚠ ${e.message}${colors.reset}`);
                }
            }

            // Install AI/ML packages based on project type
            await this.installAIPackages(projectConfig);

            const environment = {
                name: projectConfig.name,
                type: projectConfig.type,
                pythonVersion: this.getPythonVersion(),
                status: 'CREATED',
                location: `${projectConfig.name}_env`,
                packages: this.getDefaultPackages(projectConfig.type)
            };

            this.persistentState.addPythonEnvironment(environment);
            this.persistentState.updateBelief(0.07);

            return {
                success: true,
                environment: environment,
                belief: this.persistentState.getStats().belief,
                message: "Python AI environment created successfully",
                nextSteps: this.getNextSteps(projectConfig.type, projectConfig.name)
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                belief: this.persistentState.getStats().belief
            };
        }
    }

    async installAIPackages(projectConfig) {
        const packageSets = {
            'basic': ['numpy', 'pandas', 'matplotlib', 'scikit-learn'],
            'deep-learning': ['tensorflow', 'keras', 'torch', 'torchvision'],
            'nlp': ['transformers', 'nltk', 'spacy', 'gensim'],
            'computer-vision': ['opencv-python', 'pillow', 'scikit-image'],
            'reinforcement-learning': ['gym', 'stable-baselines3'],
            'full-ai': ['tensorflow', 'torch', 'transformers', 'opencv-python', 'gym'],
            'tensorflow': ['tensorflow', 'numpy', 'matplotlib'],
            'pytorch': ['torch', 'torchvision', 'numpy'],
            'django': ['django', 'django-rest-framework'],
            'flask': ['flask', 'flask-cors'],
            'fastapi': ['fastapi', 'uvicorn']
        };

        const packages = packageSets[projectConfig.type] || packageSets.basic;

        console.log(`${colors.green}║ ${colors.white}Installing AI packages: ${packages.join(', ')}${colors.reset}`);

        for (const pkg of packages) {
            try {
                // FIXED: Platform-independent pip path
                const pipCmd = this.isWindows ? 'Scripts\\pip' : 'bin/pip';
                const cmd = `cd ${projectConfig.name}_env && ${pipCmd} install ${pkg}`;
                execSync(cmd, { stdio: 'pipe', shell: true });
                console.log(`${colors.green}║ ${colors.white}✓ ${pkg}${colors.reset}`);
            } catch (e) {
                console.log(`${colors.yellow}║ ${colors.white}⚠ ${pkg} - ${e.message.split('\n')[0]}${colors.reset}`);
            }
            await this.delay(200);
        }
    }

    getNextSteps(projectType, projectName) {
        const activateCmd = this.isWindows ?
            `${projectName}_env\\Scripts\\activate` :
            `source ${projectName}_env/bin/activate`;

        const steps = {
            'basic': [
                `Activate: ${activateCmd}`,
                `Start coding: python ${projectName}/main.py`,
                `Install more packages: pip install package_name`
            ],
            'deep-learning': [
                `Activate: ${activateCmd}`,
                `Start with tensorflow.keras or torch.nn`,
                `Use GPU if available for faster training`
            ],
            'tensorflow': [
                `Activate: ${activateCmd}`,
                `Test: python -c "import tensorflow as tf; print(tf.__version__)"`,
                `Start coding deep learning models`
            ],
            'pytorch': [
                `Activate: ${activateCmd}`,
                `Test: python -c "import torch; print(torch.__version__)"`,
                `Begin with torch.nn neural networks`
            ],
            'django': [
                `Activate: ${activateCmd}`,
                `Start: cd ${projectName} && python manage.py runserver`,
                `Create apps: python manage.py startapp myapp`
            ],
            'flask': [
                `Activate: ${activateCmd}`,
                `Run: cd ${projectName} && python app.py`,
                `Access: http://localhost:5000`
            ],
            'fastapi': [
                `Activate: ${activateCmd}`,
                `Run: cd ${projectName} && uvicorn main:app --reload`,
                `Docs: http://localhost:8000/docs`
            ]
        };

        return steps[projectType] || steps.basic;
    }

    getPythonVersion() {
        try {
            const version = execSync('python3 --version', { encoding: 'utf8' });
            return version.trim();
        } catch (e) {
            return 'Unknown';
        }
    }

    getDefaultPackages(projectType) {
        const packages = {
            'basic': ['numpy', 'pandas', 'matplotlib', 'scikit-learn'],
            'deep-learning': ['tensorflow', 'keras', 'torch', 'torchvision', 'numpy'],
            'nlp': ['transformers', 'nltk', 'spacy', 'gensim', 'torch'],
            'computer-vision': ['opencv-python', 'pillow', 'scikit-image', 'tensorflow'],
            'reinforcement-learning': ['gym', 'stable-baselines3', 'numpy', 'torch'],
            'full-ai': ['tensorflow', 'torch', 'transformers', 'opencv-python', 'gym', 'numpy']
        };

        return packages[projectType] || packages.basic;
    }

    getPythonSetupInstructions() {
        return [
            "1. Install Python 3.7+: https://www.python.org/downloads/",
            "2. Verify: python3 --version",
            "3. Install pip: python3 -m ensurepip --upgrade",
            "4. Test: python3 -c 'print(\"Python ready!\")'"
        ];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = PythonIntegration;
