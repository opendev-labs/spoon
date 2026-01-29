const colors = require('./colors');
const { extractProjectName } = require('./helpers');

class AIEngine {
    constructor() {
        this.weaponRegistry = new Map();
        this.loadWeapons();
    }

    loadWeapons() {
        this.weaponRegistry.set('react-app', {
            name: 'react-app',
            command: 'npx create-react-app {name}',
            description: 'Creates React application',
            context: ['frontend', 'spa', 'modern-ui', 'react']
        });

        this.weaponRegistry.set('node-api', {
            name: 'node-api',
            command: 'mkdir -p {name}-backend && cd {name}-backend && npm init -y && npm install express cors ws && echo "const express = require(\'express\');\nconst cors = require(\'cors\');\nconst app = express();\napp.use(cors());\napp.use(express.json());\napp.get(\'/api\', (req, res) => { res.json({ message: \'Hello from SPOON backend!\' }); });\nconst PORT = process.env.PORT || 5000;\napp.listen(PORT, () => console.log(\'🚀 Server running on port ${PORT}\'));" > server.js',
            description: 'Creates Node.js API backend with WebSockets',
            context: ['backend', 'api', 'server', 'websockets', 'node']
        });

        this.weaponRegistry.set('html-project', {
            name: 'html-project',
            command: `mkdir -p {name} && cd {name} && cat > index.html << 'ENDOFFILE'
<!DOCTYPE html>
<html>
<head>
    <title>{name}</title>
    <style>
        body { background: #0a0a0a; color: #00ff41; font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; border: 1px solid #00ff41; padding: 20px; }
        h1 { color: #00ff41; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 SPOON: {name}</h1>
        <p>Created by NEO-TANK Quantum System</p>
        <p>🎮 Operator + 🔫 Super Agent</p>
    </div>
</body>
</html>
ENDOFFILE`,
            description: 'Creates HTML project with Matrix theme',
            context: ['html', 'frontend', 'simple', 'matrix']
        });
    }

    analyzeIntent(input) {
        const lower = input.toLowerCase();
        let intent = 'execute command';

        if (lower.includes('full-stack')) intent = 'create full-stack application';
        else if (lower.includes('html') || lower.includes('website')) intent = 'create html project';
        else if (lower.includes('react')) intent = 'create react application';

        return {
            intent,
            projectName: extractProjectName(input),
            complexity: lower.includes('quantum') ? 'high' : 'medium'
        };
    }

    createExecutionPlan(analysis) {
        const weapons = [];
        if (analysis.intent === 'create full-stack application') {
            weapons.push(this.weaponRegistry.get('react-app'));
            weapons.push(this.weaponRegistry.get('node-api'));
        } else if (analysis.intent === 'create html project') {
            weapons.push(this.weaponRegistry.get('html-project'));
        } else if (analysis.intent === 'create react application') {
            weapons.push(this.weaponRegistry.get('react-app'));
        }

        return weapons.map(w => ({
            name: w.name,
            command: w.command.replace(/{name}/g, analysis.projectName)
        }));
    }
}

module.exports = AIEngine;
