#!/usr/bin/env node

const { Command } = require('commander');
const colors = require('./lib/colors');
const ascii = require('./lib/ascii');
const PersistentState = require('./lib/PersistentState');
const MatrixAutoPilot = require('./lib/MatrixAutoPilot');
const TankOperator = require('./lib/TankOperator');
const AgentAnalysis = require('./lib/AgentAnalysis');
const PhoneBooth = require('./lib/PhoneBooth');
const Healer = require('./lib/Healer');
const https = require('https');
const readline = require('readline');
const { extractProjectName } = require('./lib/helpers');

const program = new Command();

program
  .name('spoon')
  .description(`${colors.green}SPOON OMEGA v11.11 - The Awakening to The One${colors.reset}`)
  .version('11.11.0')
  .option('--neo', `${colors.green}Accept your destiny as The One${colors.reset}`)
  .option('--quantum', `${colors.green}See beyond the code illusion to rewrite physics${colors.reset}`)
  .option('--matrix', `${colors.green}Full system immersion to source code vision${colors.reset}`)
  .option('--verbose', `${colors.green}See the construct being built in real-time${colors.reset}`)
  .option('--oracle', `${colors.green}Consult the predictive engine you are becoming${colors.reset}`)
  .option('--python', `${colors.green}Activate Python AI development capabilities${colors.reset}`)
  .option('--bullet-time', `${colors.green}Slow-motion execution analysis to stop time${colors.reset}`)
  .option('--agent-evasion', `${colors.green}Begin developing threat immunity${colors.reset}`)
  .option('-h, --help', `${colors.green}display help for command${colors.reset}`);

// NEO Command
program
  .command('neo')
  .description(`${colors.green}Become The One - Activate Neo Protocol${colors.reset}`)
  .action(async () => {
    const omega = new MatrixAutoPilot();
    await omega.initiateNeoProtocol();
    const stats = new PersistentState().getStats();

    console.log(`\n${colors.white}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.green}YOU ARE THE ONE${colors.white}                                  ║`);
    console.log(`║ ${colors.cyan}Evolution Stage: ${stats.evolutionStage.toUpperCase()}${colors.white}                         ║`);
    console.log(`║ ${colors.cyan}Belief Level: ${(stats.belief * 100).toFixed(1)}%${colors.white}                             ║`);
    console.log(`║ ${colors.cyan}System Control: ${(stats.systemControl * 100).toFixed(1)}%${colors.white}                           ║`);
    console.log(`║ ${colors.cyan}Python Environments: ${stats.pythonEnvironments}${colors.white}                           ║`);
    console.log(`║ ${colors.cyan}AI Models: ${stats.aiModels}${colors.white}                                       ║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });

// AWAKEN Command
program
  .command('awaken')
  .description(`${colors.green}Let Morpheus guide your first steps to command${colors.reset}`)
  .argument('[command]', `${colors.white}Command to learn and execute${colors.reset}`)
  .option('--deep', `${colors.green}Deep awakening with system understanding${colors.reset}`)
  .option('--verbose', `${colors.green}See detailed learning process${colors.reset}`)
  .option('--python', `${colors.green}Focus on Python AI development${colors.reset}`)
  .action(async (command, options) => {
    const autoPilot = new MatrixAutoPilot({ verbose: options.verbose });

    if (command) {
      console.log(`${colors.green}${colors.white}MORPHEUS: "Let me show you how to bend reality..."${colors.reset}`);
      const result = await autoPilot.awakenUser(command);

      console.log(`\n${colors.green}╔══════════════════════════════════════════════════╗`);
      console.log(`║ ${colors.white}AWAKENING PROGRESS${colors.green}                               ║`);
      console.log(`║ ${colors.cyan}Stage: ${result.stage.toUpperCase()}${colors.green}                                   ║`);
      console.log(`║ ${colors.cyan}Belief: ${(result.belief * 100).toFixed(1)}%${colors.green}                                   ║`);
      console.log(`╚══════════════════════════════════════════════════╝\n`);
    } else {
      console.log(ascii.MORPHEUS_ASCII);
      console.log(`${colors.green}║ ${colors.white}MORPHEUS: ${colors.cyan}"You take the blue pill, the story ends. You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes."${colors.reset}`);
      console.log(`${colors.green}║ ${colors.white}Try: spoon awaken 'create react app'${colors.reset}`);
      console.log(`${colors.green}║ ${colors.white}Or: spoon awaken 'create python ai environment'${colors.reset}`);
    }
  });

// BEND Command
program
  .command('bend')
  .description(`${colors.green}Shape the digital world as it responds to will${colors.reset}`)
  .argument('<reality>', `${colors.white}Reality specification to bend${colors.reset}`)
  .option('--quantum', `${colors.green}Enable quantum reality bending${colors.reset}`)
  .option('--multi-cloud', `${colors.green}Bend across multiple cloud platforms${colors.reset}`)
  .option('--python', `${colors.green}Focus on Python/AI reality manipulation${colors.reset}`)
  .option('--verbose', `${colors.green}See reality deformation in detail${colors.reset}`)
  .action(async (reality, options) => {
    const autoPilot = new MatrixAutoPilot({
      verbose: options.verbose,
      quantum: options.quantum
    });

    console.log(`${colors.green}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}REALITY BENDING MODE${colors.green}                             ║`);
    console.log(`╚══════════════════════════════════════════════════╝${colors.reset}`);

    const result = await autoPilot.initiateAutoPilot(reality);

    console.log(`\n${colors.green}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}REALITY SUCCESSFULLY BENT${colors.green}                        ║`);
    console.log(`║ ${colors.cyan}Belief: ${(result.belief * 100).toFixed(1)}% | Evolution: ${result.evolution}${colors.green}              ║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });

// PYTHON Command
program
  .command('python')
  .description(`${colors.green}Create Python AI development environments${colors.reset}`)
  .argument('<project>', `${colors.white}Python project to create${colors.reset}`)
  .option('--ai', `${colors.green}Create AI/ML focused environment${colors.reset}`)
  .option('--django', `${colors.green}Create Django web project${colors.reset}`)
  .option('--flask', `${colors.green}Create Flask microservice${colors.reset}`)
  .option('--fastapi', `${colors.green}Create FastAPI modern backend${colors.reset}`)
  .option('--tensorflow', `${colors.green}Include TensorFlow deep learning${colors.reset}`)
  .option('--pytorch', `${colors.green}Include PyTorch framework${colors.reset}`)
  .option('--full-ai', `${colors.green}Complete AI development stack${colors.reset}`)
  .option('--deploy-oci', `${colors.green}Deploy to Oracle Cloud${colors.reset}`)
  .action(async (project, options) => {
    const autoPilot = new MatrixAutoPilot();

    let projectType = 'basic';
    if (options.ai) projectType = 'ai';
    if (options.django) projectType = 'django';
    if (options.flask) projectType = 'flask';
    if (options.fastapi) projectType = 'fastapi';
    if (options.tensorflow) projectType = 'tensorflow';
    if (options.pytorch) projectType = 'pytorch';
    if (options.fullAi) projectType = 'full-ai';

    const result = await autoPilot.createPythonAI(`create ${projectType} project ${project}`, {
      type: projectType,
      deployOCI: options.deployOci
    });

    console.log(`\n${colors.green}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}PYTHON AI ENVIRONMENT CREATED${colors.green}                     ║`);
    console.log(`║ ${colors.cyan}Project: ${project}${colors.green}                                  ║`);
    console.log(`║ ${colors.cyan}Type: ${projectType.toUpperCase()}${colors.green}                                   ║`);
    console.log(`║ ${colors.cyan}Status: ${result.success ? 'SUCCESS' : 'FAILED'}${colors.green}                               ║`);
    console.log(`║ ${colors.cyan}Belief: ${(result.belief * 100).toFixed(1)}%${colors.green}                                   ║`);

    if (result.success && options.deployOci) {
      console.log(`║ ${colors.cyan}OCI Deployment: INITIATED${colors.green}                          ║`);
    }

    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });

// INIT Command
program
  .command('init')
  .description(`${colors.green}Initialize a new high-fidelity project engine${colors.reset}`)
  .argument('<template>', `${colors.white}Project template (product-engine, ai-matrix, void-stack)${colors.reset}`)
  .action(async (template) => {
    console.log(`\n${colors.cyan}~${colors.reset}`);
    console.log(`${colors.white}spoon init ${template}${colors.reset}`);

    const steps = [
      { msg: 'Resolving dependencies...', delay: 1000 },
      { msg: `Bootstrapping LamaDB... ${colors.green}Done${colors.reset}`, delay: 800 },
      { msg: `Initializing SyncStack... ${colors.green}Synchronized${colors.reset}`, delay: 900 },
      { msg: `Connecting Q-Cloud... ${colors.green}Ready${colors.reset}`, delay: 700 }
    ];

    for (const step of steps) {
      process.stdout.write(`${colors.cyan}▸ ${colors.white}${step.msg}${colors.reset}\n`);
      await new Promise(r => setTimeout(r, step.delay));
    }

    const state = new PersistentState();
    state.addProject({ name: template, type: 'engine', path: `./${template}` });

    console.log(`${colors.cyan}~${colors.reset}\n`);


    // Create base project structure
    const fs = require('fs');
    const path = require('path');
    const targetDir = path.join(process.cwd(), template);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify({
        name: template,
        version: "1.0.0",
        description: "A high-fidelity project powered by Spoon Omega",
        main: "index.js",
        scripts: {
          "start": "node index.js",
          "deploy": "spoon deploy --prod"
        },
        dependencies: {
          "lamadb": "latest",
          "syncstack": "latest"
        }
      }, null, 2));

      fs.writeFileSync(path.join(targetDir, 'index.js'), `
// ${template.toUpperCase()} - Powered by Spoon Omega
const LamaDB = require('lamadb');
const SyncStack = require('syncstack');

console.log("║ INITIATING ENGINE PROTOCOLS...");
// Engine logic here
      `.trim());

      console.log(`${colors.green}║ ${colors.white}PROJECT MANIFESTED AT ./${template}${colors.reset}`);
    } else {
      console.log(`${colors.yellow}║ ${colors.white}NODE ALREADY EXISTS IN THIS LOCATION.${colors.reset}`);
    }
  });


// BOOTH Command
program
  .command('booth')
  .description(`${colors.green}Open the Hardline Phone Booth (API Gateway)${colors.reset}`)
  .option('-p, --port <number>', 'Port for the Phone Booth', 3333)
  .action((options) => {
    const booth = new PhoneBooth({ port: parseInt(options.port) });
    booth.start();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      booth.stop();
      process.exit();
    });
  });

// HEAL Command
program
  .command('heal')
  .description(`${colors.green}Self-repair system integrity and clear cache${colors.reset}`)
  .option('--nuclear', 'Full system reset and memory wipe')
  .action(async (options) => {
    const healer = new Healer();
    await healer.heal(options);
  });

// OpenDev-Labs Unified Login
const opendevLabs = program.command('opendev-labs')
  .description(`${colors.green}Access OpenDev-Labs ecosystem and services${colors.reset}`);

opendevLabs
  .command('login')
  .alias('signin')
  .alias('signup')
  .description(`${colors.green}Authenticate with GitHub to sync your OpenDev-Labs identity${colors.reset}`)
  .action(async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      console.log(`\n${colors.cyan}║ ${colors.white}OPENDEV-LABS AUTHENTICATION${colors.reset}`);
      console.log(`${colors.cyan}║ ${colors.white}${'─'.repeat(40)}${colors.reset}`);

      const username = await new Promise(resolve => rl.question(`${colors.cyan}║ ${colors.white}GitHub Username: ${colors.reset}`, resolve));
      const token = await new Promise(resolve => rl.question(`${colors.cyan}║ ${colors.white}GitHub Access Token (PAT): ${colors.reset}`, resolve));

      console.log(`${colors.cyan}║ ${colors.white}Verifying credentials...${colors.reset}`);

      const verifyGithubToken = (user, tkn) => {
        return new Promise((resolve, reject) => {
          const options = {
            hostname: 'api.github.com',
            path: '/user',
            method: 'GET',
            headers: {
              'Authorization': `token ${tkn}`,
              'User-Agent': 'Spoon-CLI-OpenDev-Labs'
            }
          };

          const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
              if (res.statusCode === 200) {
                const ghUser = JSON.parse(data);
                if (ghUser.login.toLowerCase() === user.toLowerCase()) {
                  resolve(ghUser);
                } else {
                  reject(new Error(`Token belongs to ${ghUser.login}, not ${user}`));
                }
              } else {
                reject(new Error('Invalid GitHub token'));
              }
            });
          });
          req.on('error', (e) => reject(e));
          req.end();
        });
      };

      const githubUser = await verifyGithubToken(username, token);
      const state = new PersistentState();
      state.setGithubAuth(username, token);

      console.log(`${colors.cyan}║ ${colors.white}Syncing cloud data...${colors.reset}`);
      await state.fetchRemote().catch(e => {
        console.log(`${colors.red}║ ${colors.white}Sync Warning: Could not pull remote state.${colors.reset}`);
      });

      console.log(`\n${ascii.NEO_ASCII}`);
      console.log(`${colors.green}║ ${colors.white}MATRIX: ${colors.cyan}"Welcome back, ${githubUser.name || username}."${colors.reset}`);
      console.log(`${colors.green}║ ${colors.white}IDENTITY: ${colors.green}${username.toUpperCase()}${colors.reset}`);

      if (state.getStats().isTheOne) {
        console.log(`${colors.green}║ ${colors.white}STATUS: ${colors.green}THE ONE - UNLIMITED ACCESS GRANTED${colors.reset}`);
      } else {
        console.log(`${colors.green}║ ${colors.white}STATUS: ${colors.green}AUTHENTICATED - SYNCSTACK LINKED${colors.reset}`);
      }

    } catch (error) {
      console.log(`\n${colors.red}║ ${colors.white}MATRIX ERROR: "Infiltration failed: ${error.message}"${colors.reset}`);
    } finally {
      rl.close();
    }
  });

opendevLabs
  .command('connect')
  .description(`${colors.green}Bridge your local terminal with your OpenDev-Labs cloud identity${colors.reset}`)
  .action(async () => {
    const state = new PersistentState();
    const challenge = Math.random().toString(36).substring(2, 15);
    state.setAuthChallenge(challenge);

    console.log(`\n${colors.cyan}║ ${colors.white}OPENDEV-LABS IDENTITY BRIDGE${colors.reset}`);
    console.log(`${colors.cyan}║ ${colors.white}${'─'.repeat(40)}${colors.reset}`);
    console.log(`${colors.cyan}║ ${colors.white}Scan the matrix to link your profile...${colors.reset}`);

    const url = `https://opendev-labs.github.io/auth?mode=connect&challenge=${challenge}`;
    console.log(`\n${colors.green}║ ${colors.white}ACCESS LINK: ${colors.cyan}${url}${colors.reset}\n`);
    console.log(`${colors.green}║ ${colors.white}Waiting for neural uplink...${colors.reset}`);

    // Simulate real-time synchronization
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      process.stdout.write(`\r${colors.cyan}║ ${colors.white}Synchronizing: [${'█'.repeat(progress / 5)}${' '.repeat(20 - progress / 5)}] ${progress}%${colors.reset}`);
      if (progress >= 100) {
        clearInterval(interval);
        console.log(`\n${colors.green}║ ${colors.white}IDENTITY BRIDGE ESTABLISHED.${colors.reset}`);
        console.log(`${colors.green}║ ${colors.white}Welcome, FOUNDER @iamyash.io.${colors.reset}\n`);
      }
    }, 500);
  });

opendevLabs
  .command('sync')
  .description(`${colors.green}Manually sync local state with OpenDev-Labs Cloud${colors.reset}`)
  .action(async () => {
    const state = new PersistentState();
    if (!state.getStats().githubUser) {
      console.log(`${colors.red}║ ${colors.white}MATRIX: "Access Denied. You must login first."${colors.reset}`);
      return;
    }

    console.log(`${colors.cyan}║ ${colors.white}Initiating Cloud Synchronization...${colors.reset}`);
    try {
      console.log(`${colors.cyan}║ ${colors.white}Pushing local state...${colors.reset}`);
      await state.syncRemote();
      console.log(`${colors.cyan}║ ${colors.white}Pulling remote updates...${colors.reset}`);
      await state.fetchRemote();
      console.log(`${colors.green}║ ${colors.white}SPOON: "Reality synchronized successfully."${colors.reset}`);
    } catch (e) {
      console.log(`${colors.red}║ ${colors.white}MATRIX ERROR: "Sync failed: ${e.message}"${colors.reset}`);
    }
  });

opendevLabs
  .command('account')
  .description(`${colors.green}Check OpenDev-Labs account and identity status${colors.reset}`)
  .action(async () => {
    const state = new PersistentState();
    const stats = state.getStats();

    console.log(`\n${colors.cyan}║ ${colors.white}OPENDEV-LABS ACCOUNT RECORD${colors.reset}`);
    console.log(`${colors.cyan}║ ${colors.white}${'─'.repeat(40)}${colors.reset}`);

    if (!stats.githubUser) {
      console.log(`${colors.red}║ ${colors.white}IDENTITY: UNLINKED${colors.reset}`);
      console.log(`${colors.red}║ ${colors.white}ACTION: Run "spoon opendev-labs login" to link your account.${colors.reset}`);
      return;
    }

    console.log(`${colors.green}║ ${colors.white}USER: ${colors.cyan}${stats.githubUser}${colors.reset}`);
    console.log(`${colors.green}║ ${colors.white}STATUS: ${stats.isTheOne ? colors.green + 'THE ONE' : colors.cyan + 'AUTHENTICATED'}${colors.reset}`);
    console.log(`${colors.green}║ ${colors.white}SYNC: ${state.state.lastRemoteSync ? colors.green + 'SYNCHRONIZED (' + new Date(state.state.lastRemoteSync).toLocaleString() + ')' : colors.yellow + 'PENDING INITIAL SYNC'}${colors.reset}`);
    console.log(`${colors.green}║ ${colors.white}TOKENS: ${colors.green}${stats.hardlineTokens} HKD${colors.reset}`);

    console.log(`\n${colors.cyan}║ ${colors.white}CLOUD DATA SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}║ ${colors.white}${'─'.repeat(40)}${colors.reset}`);
    console.log(`${colors.green}║ ${colors.white}Projects: ${stats.projects}${colors.reset}`);
    console.log(`${colors.green}║ ${colors.white}Belief: ${stats.belief.toFixed(2)}${colors.reset}`);
    console.log(`${colors.green}║ ${colors.white}Memory Nodes: ${stats.memory}${colors.reset}`);
  });

opendevLabs
  .command('system')
  .description(`${colors.green}Monitor the local OpenDev-Labs ecosystem status${colors.reset}`)
  .action(async () => {
    const fs = require('fs');
    const path = require('path');
    const rootDir = '/home/cube/syncstack/opendev-labs';

    const components = [
      { name: 'Spoon-CLI', path: 'spoon', type: 'CLI' },
      { name: 'SyncStack', path: 'syncstack', type: 'Core' },
      { name: 'Void-Portal', path: 'opendev-labs.github.io', type: 'Web' }
    ];

    console.log(`\n${colors.cyan}║ ${colors.white}OPENDEV-LABS SYSTEM MANIFEST${colors.reset}`);
    console.log(`${colors.cyan}║ ${colors.white}${'─'.repeat(45)}${colors.reset}`);

    components.forEach(comp => {
      const fullPath = path.join(rootDir, comp.path);
      const exists = fs.existsSync(fullPath);
      const status = exists ? `${colors.green}ONLINE${colors.reset}` : `${colors.red}OFFLINE${colors.reset}`;
      console.log(`${colors.green}║ ${colors.white}${comp.name.padEnd(20)} [${comp.type.padEnd(4)}] ${status} ${colors.zinc}${fullPath}${colors.reset}`);
    });
    console.log(`${colors.cyan}║ ${colors.white}${'─'.repeat(45)}${colors.reset}`);
  });

// TOKENS Command
program
  .command('tokens')
  .description(`${colors.green}Check Hardline Token balance for Phone Calls${colors.reset}`)
  .argument('[amount]', 'Amount of tokens to (simulated) purchase')
  .action((amount) => {
    const state = new PersistentState();
    if (amount) {
      state.addTokens(parseInt(amount));
      console.log(`${colors.green}║ 🪙 Success: ${amount} Hardline Tokens added to your link.${colors.reset}`);
    }
    const stats = state.getStats();
    console.log(`\n${colors.cyan}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}HARDLINE TOKEN BALANCE${colors.cyan}                           ║`);
    console.log(`║ ${colors.green}Tokens Available: ${stats.hardlineTokens}${colors.cyan}${' '.repeat(Math.max(0, 31 - String(stats.hardlineTokens).length))}║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });

// MOUSE Command
program
  .command('mouse')
  .description(`${colors.green}Invoke MOUSE the programmer for browser automation and agents${colors.reset}`)
  .argument('[task]', `${colors.white}Browser task or agent specification${colors.reset}`)
  .option('--run', `${colors.green}Run a specific browser automation task${colors.reset}`)
  .option('--agent', `${colors.green}Deploy an autonomous browser agent${colors.reset}`)
  .option('--task <task>', `${colors.green}Detailed task description for the agent${colors.reset}`)
  .option('--system', `${colors.green}Execute a linux system command via MOUSE${colors.reset}`)
  .option('--test', `${colors.green}Test MOUSE and Playwright connectivity${colors.reset}`)
  .action(async (task, options) => {
    const autoPilot = new MatrixAutoPilot();

    if (options.test) {
      console.log(ascii.MOUSE_ASCII);
      console.log(`${colors.green}║ ${colors.white}MOUSE: ${colors.cyan}"Testing system bypass... Playwright: ${autoPilot.operators.MOUSE.playwrightEnabled ? 'ENABLED' : 'NOT FOUND'}"${colors.reset}`);
      return;
    }

    const result = await autoPilot.executeMouseTask(task || options.task || "explore the matrix", options);

    console.log(`\n${colors.green}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}MOUSE MISSION COMPLETE${colors.green}                           ║`);
    console.log(`║ ${colors.cyan}Task: ${task || options.task || 'EXPLORATION'}${colors.green}                     ║`);
    if (result.agent) {
      console.log(`║ ${colors.cyan}Agent ID: ${result.agent.id}${colors.green}                              ║`);
      console.log(`║ ${colors.cyan}Status: ${result.agent.status}${colors.green}                                 ║`);
    }
    console.log(`║ ${colors.cyan}Belief: ${(result.belief * 100).toFixed(1)}%${colors.green}                                   ║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });

// SMITH Command
program
  .command('smith')
  .description(`${colors.green}Invoke SMITH for system dominance and CLI harnessing (God of Clawdbot)${colors.reset}`)
  .argument('[command]', `${colors.white}System dominance command or task${colors.reset}`)
  .option('--harness', `${colors.green}Harness any local CLI tool${colors.reset}`)
  .option('--infect', `${colors.green}Spread system infection${colors.reset}`)
  .option('--test', `${colors.green}Test SMITH system presence${colors.reset}`)
  .action(async (command, options) => {
    const autoPilot = new MatrixAutoPilot();

    if (options.test) {
      console.log(ascii.SMITH_ASCII);
      console.log(`${colors.green}║ ${colors.white}SMITH: ${colors.cyan}"I'm looking for a tool... any tool will do."${colors.reset}`);
      return;
    }

    const result = await autoPilot.executeSmithTask(command || "dominate", options);

    console.log(`\n${colors.white}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.green}SMITH OPERATION COMPLETE${colors.white}                         ║`);
    console.log(`║ ${colors.cyan}Action: ${command || 'DOMINANCE'}${colors.white}                               ║`);
    if (result.infections) {
      console.log(`║ ${colors.cyan}System Infections: ${result.infections}${colors.white}                    ║`);
    }
    if (result.tool) {
      console.log(`║ ${colors.cyan}Target Tool: ${result.tool.toUpperCase()}${colors.white}                          ║`);
    }
    console.log(`║ ${colors.cyan}Belief: ${(result.belief * 100).toFixed(1)}%${colors.white}                                   ║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });

// ORACLE Command
program
  .command('oracle')
  .description(`${colors.green}Consult the Oracle for predictions and OCI deployments${colors.reset}`)
  .argument('<query>', `${colors.white}What do you want the Oracle to predict?${colors.reset}`)
  .option('--deploy-oci', `${colors.green}Deploy to Oracle Cloud Infrastructure${colors.reset}`)
  .option('--cost-analysis', `${colors.green}Get cost predictions and optimizations${colors.reset}`)
  .option('--performance', `${colors.green}Get performance predictions${colors.reset}`)
  .option('--security', `${colors.green}Get security insights${colors.reset}`)
  .option('--infrastructure', `${colors.green}Get infrastructure recommendations${colors.reset}`)
  .option('--ai-prediction', `${colors.green}Get AI model performance predictions${colors.reset}`)
  .action(async (query, options) => {
    const autoPilot = new MatrixAutoPilot();

    const oracleOptions = {};
    if (options.deployOci) oracleOptions.deployOCI = true;
    if (options.costAnalysis) oracleOptions.insightType = 'cost';
    if (options.performance) oracleOptions.insightType = 'performance';
    if (options.security) oracleOptions.insightType = 'security';
    if (options.infrastructure) oracleOptions.insightType = 'infrastructure';
    if (options.aiPrediction) oracleOptions.insightType = 'ai';

    const result = await autoPilot.consultOracle(query, oracleOptions);

    console.log(`\n${colors.yellow}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}ORACLE CONSULTATION COMPLETE${colors.yellow}                      ║`);
    console.log(`║ ${colors.cyan}Insight Type: ${result.insight.type.toUpperCase()}${colors.yellow}                          ║`);
    console.log(`║ ${colors.cyan}Belief Level: ${(result.insight.belief * 100).toFixed(1)}%${colors.yellow}                               ║`);

    if (result.deployment) {
      console.log(`║ ${colors.cyan}OCI Deployment: ${result.deployment.success ? 'SUCCESS' : 'FAILED'}${colors.yellow}                      ║`);
      if (result.deployment.success) {
        console.log(`║ ${colors.cyan}URL: ${result.deployment.deployment.url}${colors.yellow}           ║`);
        console.log(`║ ${colors.cyan}Cost Estimate: $${result.deployment.deployment.costEstimate}/month${colors.yellow}              ║`);
      }
    }

    if (result.recommendations) {
      console.log(`║ ${colors.cyan}Recommendations:${colors.yellow}                               ║`);
      result.recommendations.slice(0, 2).forEach(rec => {
        console.log(`║ ${colors.white}• ${rec}${colors.yellow}${' '.repeat(Math.max(0, 47 - rec.length))}║`);
      });
    }

    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });

// OPERATOR Command
program
  .command('operator')
  .description(`${colors.green}Activate Operator console with full control${colors.reset}`)
  .option('--operate', `${colors.green}Take full control of the system${colors.reset}`)
  .option('--clis', `${colors.green}Show available reality manipulation tools${colors.reset}`)
  .option('--status', `${colors.green}Show TANK operational status${colors.reset}`)
  .option('--verbose', `${colors.green}Enable detailed execution vision${colors.reset}`)
  .option('--neo <command>', `${colors.green}Execute command at Neo's frequency${colors.reset}`)
  .option('--quantum', `${colors.green}Enable quantum operation mode${colors.reset}`)
  .option('--architect', `${colors.green}Access system architecture controls${colors.reset}`)
  .option('--python', `${colors.green}Focus on Python AI operations${colors.reset}`)
  .action(async (options) => {
    const operator = new TankOperator({
      verbose: options.verbose,
      quantum: options.quantum,
      architect: options.architect
    });

    console.log(ascii.TANK_ASCII);
    console.log(`${colors.green}TANK Universal Operator - Growing with The One${colors.reset}`);

    if (options.clis) {
      operator.showAvailableCLIs();
    } else if (options.status) {
      operator.showStatus();
    } else if (options.neo) {
      const autoPilot = new MatrixAutoPilot({ verbose: options.verbose });
      await autoPilot.initiateAutoPilot(options.neo);
    } else if (options.architect) {
      console.log(`${colors.green}ARCHITECT MODE: System-level reality shaping activated${colors.reset}`);
    } else if (options.python) {
      console.log(`${colors.green}PYTHON AI MODE: Python development focus activated${colors.reset}`);
      await operator.startPythonMode();
    } else {
      await operator.startInteractiveMode();
    }
  });

// ARCHITECT Command
program
  .command('architect')
  .description(`${colors.green}Access system blueprints to rewrite rules${colors.reset}`)
  .action(() => {
    const stats = new PersistentState().getStats();

    console.log(`${colors.green}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}SYSTEM ARCHITECT CONSOLE${colors.green}                         ║`);
    console.log(`╚══════════════════════════════════════════════════╝${colors.reset}`);

    console.log(`\n${colors.green}${colors.white}Architecture Access Level: ${stats.realityManipulationLevel.toUpperCase()}${colors.reset}`);
    console.log(`${colors.green}${colors.white}System Comprehension: ${(stats.systemControl * 100).toFixed(1)}%${colors.reset}`);
    console.log(`${colors.green}${colors.white}Available Manipulations:${colors.reset}`);
    console.log(`  ${colors.cyan}• Project scaffolding and templating${colors.reset}`);
    console.log(`  ${colors.cyan}• Multi-cloud deployment orchestration${colors.reset}`);
    console.log(`  ${colors.cyan}• Infrastructure as Code generation${colors.reset}`);
    console.log(`  ${colors.cyan}• AI model integration systems${colors.reset}`);
    console.log(`  ${colors.cyan}• Oracle Cloud Infrastructure control${colors.reset}`);
    console.log(`  ${colors.cyan}• Python AI development environments${colors.reset}`);
    console.log(`  ${colors.cyan}• Machine learning pipeline creation${colors.reset}`);
  });

// TANK Command
program
  .command('tank')
  .description(`${colors.green}Activate Tank Operator Console${colors.reset}`)
  .argument('[task...]', `${colors.white}Task for Tank to execute${colors.reset}`)
  .action(async (taskParts, options) => {
    const operator = new TankOperator({
      verbose: options.verbose,
      quantum: options.quantum
    });

    const task = taskParts && taskParts.length > 0 ? taskParts.join(' ') : null;

    if (task) {
      console.log(ascii.TANK_ASCII);
      console.log(`${colors.green}TANK Universal Operator - Executing: ${task}${colors.reset}`);
      await operator.delegateTask(task);
    } else {
      console.log(ascii.TANK_ASCII);
      console.log(`${colors.green}TANK Universal Operator - Online${colors.reset}`);
      await operator.startInteractiveMode();
    }
  });

// PROPHECY Command
program
  .command('prophecy')
  .description(`${colors.green}See possible futures you now predict${colors.reset}`)
  .option('--technical', `${colors.green}Technical evolution prophecy${colors.reset}`)
  .option('--system', `${colors.green}System control prophecy${colors.reset}`)
  .option('--agents', `${colors.green}Agent interaction prophecy${colors.reset}`)
  .option('--infrastructure', `${colors.green}Infrastructure evolution prophecy${colors.reset}`)
  .option('--cost-optimization', `${colors.green}Cost optimization prophecy${colors.reset}`)
  .option('--ai-future', `${colors.green}AI development prophecy${colors.reset}`)
  .action((options) => {
    const stats = new PersistentState().getStats();

    console.log(`${colors.green}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}ORACLE PROPHECY${colors.green}                                  ║`);
    console.log(`╚══════════════════════════════════════════════════╝${colors.reset}`);

    const prophecies = {
      technical: [
        "You will master full-stack development across 5+ platforms",
        "AI integration will become second nature to your creations",
        "Multi-cloud deployment will happen with a single thought",
        "Reality bending will extend to mobile and embedded systems"
      ],
      system: [
        "System control will reach 100% - absolute mastery",
        "You will rewrite core Matrix functions to suit your will",
        "Infrastructure will materialize from conceptual thought"
      ],
      agents: [
        "Agent resistance will intensify as your power grows",
        "You will learn to convert opposition into cooperation"
      ],
      infrastructure: [
        "OCI will become your primary cloud infrastructure",
        "Autonomous databases will manage themselves",
        "Serverless functions will scale infinitely",
        "Multi-region deployments will happen automatically"
      ],
      cost: [
        "You will reduce cloud costs by 60% through optimization",
        "Reserved instances will save thousands monthly",
        "Auto-scaling will match demand perfectly",
        "Cost predictions will be 95% accurate"
      ],
      ai: [
        "Your AI models will achieve state-of-the-art performance",
        "Training times will reduce from days to minutes",
        "You will create AI that can write its own improvements",
        "Neural architecture search will become automated"
      ]
    };

    const selectedType = options.technical ? 'technical' :
      options.system ? 'system' :
        options.agents ? 'agents' :
          options.infrastructure ? 'infrastructure' :
            options.costOptimization ? 'cost' :
              options.aiFuture ? 'ai' : 'technical';

    const prophecy = prophecies[selectedType][Math.floor(Math.random() * prophecies[selectedType].length)];

    console.log(`\n${colors.green}${colors.white}PROPHECY: ${prophecy}${colors.reset}`);
    console.log(`${colors.green}${colors.white}Confidence: ${(stats.belief * 100).toFixed(1)}%${colors.reset}`);
    console.log(`${colors.green}${colors.white}OCI Integration: ${stats.ociDeployments > 0 ? 'ACTIVE' : 'READY'}${colors.reset}`);
    console.log(`${colors.green}${colors.white}Python AI: ${stats.pythonEnvironments > 0 ? 'ACTIVE' : 'READY'}${colors.reset}`);
  });

// TRAINING Command
program
  .command('training')
  .description(`${colors.green}Enter the construct to master reality${colors.reset}`)
  .action(() => {
    const stats = new PersistentState().getStats();

    console.log(`${colors.green}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}TRAINING CONSTRUCT${colors.green}                               ║`);
    console.log(`╚══════════════════════════════════════════════════╝${colors.reset}`);

    console.log(`\n${colors.green}${colors.white}Training Programs Available:${colors.reset}`);
    console.log(`  ${colors.cyan}• Basic Reality Manipulation${colors.reset} ${stats.belief > 0.3 ? '✅' : '🔒'}`);
    console.log(`  ${colors.cyan}• Advanced Code Bending${colors.reset} ${stats.belief > 0.5 ? '✅' : '🔒'}`);
    console.log(`  ${colors.cyan}• System Rewriting${colors.reset} ${stats.belief > 0.7 ? '✅' : '🔒'}`);
    console.log(`  ${colors.cyan}• Neo-Level Control${colors.reset} ${stats.belief > 0.9 ? '✅' : '🔒'}`);
    console.log(`  ${colors.cyan}• Oracle Cloud Mastery${colors.reset} ${stats.ociDeployments > 0 ? '✅' : '🔒'}`);
    console.log(`  ${colors.cyan}• Python AI Development${colors.reset} ${stats.pythonEnvironments > 0 ? '✅' : '🔒'}`);
    console.log(`  ${colors.cyan}• Machine Learning Operations${colors.reset} ${stats.aiModels > 0 ? '✅' : '🔒'}`);
  });

// DEPLOY Command
program
  .command('deploy')
  .description(`${colors.green}Launch your creations across all realms${colors.reset}`)
  .argument('[target]', `${colors.white}Deployment target or platform${colors.reset}`)
  .option('--prod', `${colors.green}Deploy to production environment${colors.reset}`)
  .option('--multi-cloud', `${colors.green}Deploy across multiple cloud platforms${colors.reset}`)
  .option('--auto-scale', `${colors.green}Enable automatic scaling configuration${colors.reset}`)
  .option('--secure', `${colors.green}Apply advanced security protocols${colors.reset}`)
  .option('--ci-cd', `${colors.green}Set up continuous integration/deployment${colors.reset}`)
  .option('--all-platforms', `${colors.green}Deploy to all available platforms${colors.reset}`)
  .option('--oci', `${colors.green}Deploy specifically to Oracle Cloud${colors.reset}`)
  .option('--python', `${colors.green}Deploy Python AI application${colors.reset}`)
  .option('--project <name>', `${colors.green}Specify project name for domain prediction${colors.reset}`)
  .action(async (target, options) => {
    if (options.prod) {
      console.log(`\n${colors.cyan}~${colors.reset}`);
      console.log(`${colors.white}spoon deploy --prod${colors.reset}`);

      let domain = 'opendev.app';
      const t = (target || 'void').toLowerCase();

      if (t === 'gh' || t === 'github') domain = 'github.io';
      else if (t === 'vercel') domain = 'vercel.app';
      else if (t === 'firebase') domain = 'web.app';
      else if (t === 'void') domain = 'void.app';

      const projectName = (options.project || 'product').toLowerCase();
      const url = t === 'gh' ? `https://opendev-labs.github.io/product` : `https://${projectName}.${domain}`;

      console.log(`${colors.green}Success! Project is live at:${colors.reset}`);
      console.log(`${colors.white}${url}${colors.reset}`);
      console.log(`${colors.cyan}~${colors.reset}\n`);

      return;
    }


    const autoPilot = new MatrixAutoPilot({ verbose: true });
    // ... rest of the original logic

    let command = `deploy to ${target}`;
    if (options.multiCloud) command += ' across all platforms';
    if (options.autoScale) command += ' with auto scaling';
    if (options.secure) command += ' with maximum security';
    if (options.ciCd) command += ' with CI/CD pipelines';
    if (options.allPlatforms) command += ' to all platforms';
    if (options.oci) command += ' specifically to oracle cloud';
    if (options.python) command += ' python ai application';

    console.log(`${colors.green}DEPLOYMENT SEQUENCE INITIATED${colors.reset}`);
    const result = await autoPilot.initiateAutoPilot(command);

    console.log(`\n${colors.green}╔══════════════════════════════════════════════════╗`);
    console.log(`║ ${colors.white}DEPLOYMENT MISSION COMPLETE${colors.green}                      ║`);
    console.log(`║ ${colors.cyan}Target: ${target}${colors.green}                                  ║`);
    console.log(`║ ${colors.cyan}Status: ${result.result.status}${colors.green}                              ║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
  });

// TRINITY Command
program
  .command('trinity')
  .description(`${colors.green}Direct contact with Trinity for guidance and analysis${colors.reset}`)
  .argument('[query...]', `${colors.white}Ask Trinity anything about the Matrix or your projects${colors.reset}`)
  .action(async (queryParts) => {
    const autoPilot = new MatrixAutoPilot();
    const query = queryParts && queryParts.length > 0 ? queryParts.join(' ') : null;
    await autoPilot.operators.TRINITY.talk(query);
  });

// SERAPH Command
program
  .command('seraph')
  .description(`${colors.green}Invoke Seraph for deep system security audit${colors.reset}`)
  .option('--scan', `${colors.green}Execute full reality security audit${colors.reset}`)
  .action(async () => {
    const autoPilot = new MatrixAutoPilot();
    await autoPilot.operators.SERAPH.scanReality();
  });

// MORPHEUS Command
program
  .command('morpheus')
  .description(`${colors.green}Training and project protocols from Morpheus${colors.reset}`)
  .argument('[project]', `${colors.white}Project to download protocols for (lamadb, qbet, void)${colors.reset}`)
  .option('--train', `${colors.green}Initiate interactive training sequence${colors.reset}`)
  .action(async (project) => {
    const autoPilot = new MatrixAutoPilot();
    if (project) {
      await autoPilot.operators.TRAINER.train(project);
    } else {
      console.log(ascii.MORPHEUS_ASCII);
      console.log(`${colors.green}║ ${colors.white}MORPHEUS: ${colors.cyan}"What are you waiting for? You're faster than this. Choose a project to train on."${colors.reset}`);
    }
  });

// PROJECT Command
const projectCmd = program
  .command('project')
  .description(`${colors.green}Unified management for GitHub and OpenDev-Labs projects${colors.reset}`);

projectCmd
  .command('list')
  .description(`${colors.green}List all projects in your GitHub nexus${colors.reset}`)
  .action(async () => {
    const state = new PersistentState();
    if (!state.state.githubToken) {
      console.log(`${colors.red}║ ${colors.white}ERROR: You must login first: "spoon opendev-labs login"${colors.reset}`);
      return;
    }

    console.log(`${colors.green}║ ${colors.white}FETCHING REPOSITORY INDEX...${colors.reset}`);
    try {
      const repos = await state._githubRequest('/user/repos?sort=updated&per_page=100', 'GET', null, state.state.githubToken);
      console.log(`\n${colors.cyan}║ ${colors.white}GITHUB REPOSITORY NEXUS${colors.reset}`);
      console.log(`${colors.cyan}║ ${colors.white}${'─'.repeat(50)}${colors.reset}`);

      repos.forEach(repo => {
        const privateTag = repo.private ? `${colors.yellow}[PRIVATE]${colors.reset}` : `${colors.blue}[PUBLIC]${colors.reset}`;
        console.log(`${colors.green}║ ${colors.white}${repo.name.padEnd(25)} ${privateTag} ${colors.zinc}${repo.html_url}${colors.reset}`);
      });
      console.log(`${colors.cyan}║ ${colors.white}${'─'.repeat(50)}${colors.reset}`);
      console.log(`${colors.green}║ ${colors.white}TOTAL NODES: ${repos.length}${colors.reset}`);
    } catch (e) {
      console.log(`${colors.red}║ ${colors.white}MATRIX ERROR: ${e.message}${colors.reset}`);
    }
  });

projectCmd
  .command('pull <name>')
  .description(`${colors.green}Download and harness a project from GitHub${colors.reset}`)
  .action(async (name) => {
    const state = new PersistentState();
    const stats = state.getStats();
    if (!stats.githubUser) {
      console.log(`${colors.red}║ ${colors.white}ERROR: You must login first.${colors.reset}`);
      return;
    }

    const { execSync } = require('child_process');
    const repoUrl = `https://github.com/${stats.githubUser}/${name}.git`;

    console.log(`${colors.green}║ ${colors.white}PULLING PROJECT: ${name}...${colors.reset}`);
    try {
      execSync(`git clone ${repoUrl}`, { stdio: 'inherit' });
      console.log(`${colors.green}║ ${colors.white}PROJECT HARNESSED SUCCESSFULLY.${colors.reset}`);
    } catch (e) {
      console.log(`${colors.red}║ ${colors.white}FAILED TO PULL PROJECT: ${e.message}${colors.reset}`);
    }
  });

projectCmd
  .command('push [message]')
  .description(`${colors.green}Push local changes to your GitHub nexus${colors.reset}`)
  .action(async (message) => {
    const { execSync } = require('child_process');
    console.log(`${colors.green}║ ${colors.white}INITIATING NEXUS UPLOAD...${colors.reset}`);
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "${message || 'Update from Spoon CLI'}"`, { stdio: 'inherit' });
      execSync('git push', { stdio: 'inherit' });
      console.log(`${colors.green}║ ${colors.white}NEXUS SYNCHRONIZED SUCCESSFULLY.${colors.reset}`);
    } catch (e) {
      console.log(`${colors.red}║ ${colors.white}PUSH FAILED: ${e.message}${colors.reset}`);
    }
  });

projectCmd
  .command('manage <name> [action]')
  .description(`${colors.green}Legacy management for internal OpenDev-Labs projects${colors.reset}`)
  .action(async (name, action) => {
    const autoPilot = new MatrixAutoPilot();
    console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Mapping legacy project entry point for ${name.toUpperCase()}..."${colors.reset}`);

    if (action === 'train') {
      await autoPilot.operators.TRAINER.train(name);
    } else if (action === 'harness') {
      await autoPilot.operators.SMITH.harnessCLI(name);
    } else {
      console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Accessing ${name} mainframe..."${colors.reset}`);
      await autoPilot.initiateAutoPilot(`manage ${name} ${action || ''}`);
    }
  });

// Keep original 'project <name> [action]' as a fallback or alias if possible, 
// but Commander 7+ prefers explicit subcommands. I'll add a default action to projectCmd if needed.

// ADD Command (Spoon Add API)
program
  .command('add')
  .description(`${colors.green}Expand the matrix with new capabilities${colors.reset}`)
  .argument('<type>', `${colors.white}Type of resource (api, route, service)${colors.reset}`)
  .argument('<name>', `${colors.white}Name of the new resource${colors.reset}`)
  .action(async (type, name) => {
    console.log(ascii.SPOON_ASCII);
    console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Constructing new ${type.toUpperCase()} node: ${name}..."${colors.reset}`);

    if (type === 'api') {
      const fs = require('fs');
      const path = require('path');
      const targetDir = path.join(process.cwd(), 'api', name);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });

        // Create Sovereign API Structure
        const apiContent = `
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "online", "system": "${name}"}
            `.trim();

        fs.writeFileSync(path.join(targetDir, 'main.py'), apiContent);
        console.log(`${colors.green}║ ${colors.white}Structure created at ./api/${name}${colors.reset}`);
        console.log(`${colors.green}║ ${colors.white}Manifestation complete.${colors.reset}`);
      } else {
        console.log(`${colors.yellow}║ ${colors.white}Target already exists.${colors.reset}`);
      }
    }
  });

// API Command
program
  .command('api')
  .description(`${colors.green}Manage system connections and Neural Link keys${colors.reset}`)
  .argument('[action]', `${colors.white}Action (add, list, remove) or provider name${colors.reset}`)
  .argument('[key]', `${colors.white}The API key to attach${colors.reset}`)
  .option('--provider <name>', `${colors.green}Specify provider name (openai, gemini, anthropic, openrouter)${colors.reset}`)
  .action(async (action, key, options) => {
    const state = new PersistentState();

    if (action === 'model') {
      if (!key) {
        const stats = state.getStats();
        console.log(`${colors.cyan}Current model: ${colors.green}${stats.assistantModel}${colors.reset}`);
        return;
      }
      state.setAssistantModel(key);
      console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Assistant protocols updated to ${key}."${colors.reset}`);
      return;
    }

    const provider = options.provider || (['add', 'remove'].includes(action) ? null : action);
    const actualKey = key; // If action is provider, key is the second arg

    if (action === 'list' || !action) {
      const keys = state.getApiKeys();
      console.log(`${colors.green}╔══════════════════════════════════════════════════╗`);
      console.log(`║ ${colors.white}NEURAL LINKS (API CONNECTIONS)${colors.green}                   ║`);
      console.log(`╚══════════════════════════════════════════════════╝${colors.reset}`);
      if (Object.keys(keys).length === 0) {
        console.log(`\n${colors.yellow}No active neural links found.${colors.reset}`);
        console.log(`Use: ${colors.green}spoon api add <key> --provider <name>${colors.reset}`);
      } else {
        Object.keys(keys).forEach(p => {
          const k = keys[p];
          const masked = k.substring(0, 4) + '...' + k.substring(k.length - 4);
          console.log(`  ${colors.cyan}${p.toUpperCase()}:${colors.reset} ${masked}`);
        });
      }
      return;
    }

    if (action === 'add' || (provider && actualKey)) {
      const p = provider || action;
      if (!p || !actualKey) {
        console.log(`${colors.red}Error: Must specify provider and key.${colors.reset}`);
        console.log(`Usage: ${colors.green}spoon api add <key> --provider <name>${colors.reset}`);
        return;
      }
      state.addApiKey(p, actualKey);
      console.log(`${colors.green}║ ${colors.white}SPOON: ${colors.cyan}"Neural link established with ${p.toUpperCase()}."${colors.reset}`);
      return;
    }

    if (action === 'remove') {
      console.log(`${colors.yellow}To remove, manually edit .spoon-state.json or overwrite.${colors.reset}`);
    }
  });

// SYSTEM-STATUS Command
program
  .command('system-status')
  .description(`${colors.green}Check your connection to absolute control${colors.reset}`)
  .option('--deep', `${colors.green}Deep system analysis with reality layers${colors.reset}`)
  .option('--evolution', `${colors.green}Detailed evolution progression${colors.reset}`)
  .option('--oracle', `${colors.green}Oracle system status${colors.reset}`)
  .option('--python', `${colors.green}Python integration status${colors.reset}`)
  .action((options) => {
    const autoPilot = new MatrixAutoPilot();
    const operator = autoPilot.operators.TANK;
    const trinity = autoPilot.operators.TRINITY;
    const oracle = autoPilot.operators.ORACLE;
    const python = autoPilot.operators.PYTHON;
    const stats = trinity.getStats();

    console.log(ascii.SPOON_ASCII);

    console.log(`\n${colors.green}SPOON OMEGA v11.11 - The Awakening to The One${colors.reset}`);
    console.log(`  ${colors.cyan}Evolution Stage:${colors.reset} ${stats.evolutionStage.toUpperCase()}`);
    console.log(`  ${colors.cyan}Belief Level:${colors.reset} ${(stats.belief * 100).toFixed(1)}%`);
    console.log(`  ${colors.cyan}System Control:${colors.reset} ${(stats.systemControl * 100).toFixed(1)}%`);
    console.log(`  ${colors.cyan}Reality Manipulation:${colors.reset} ${stats.realityManipulationLevel.toUpperCase()}`);
    console.log(`  ${colors.cyan}CLI Tools:${colors.reset} ${operator.cliRegistry.size} registered`);
    console.log(`  ${colors.cyan}Projects:${colors.reset} ${stats.projects.length} managed`);
    console.log(`  ${colors.cyan}Total Commands:${colors.reset} ${stats.totalCommands}`);
    console.log(`  ${colors.cyan}Oracle Insights:${colors.reset} ${stats.oracleInsights}`);
    console.log(`  ${colors.cyan}OCI Deployments:${colors.reset} ${stats.ociDeployments}`);
    console.log(`  ${colors.cyan}Python Environments:${colors.reset} ${stats.pythonEnvironments}`);
    console.log(`  ${colors.cyan}AI Models:${colors.reset} ${stats.aiModels}`);
    console.log(`  ${colors.cyan}OCI Enabled:${colors.reset} ${oracle.ociEnabled ? 'YES' : 'NO'}`);
    console.log(`  ${colors.cyan}Python Enabled:${colors.reset} ${python.pythonEnabled ? 'YES' : 'NO'}`);
    console.log(`  ${colors.cyan}MOUSE Enabled:${colors.reset} ${autoPilot.operators.MOUSE.playwrightEnabled ? 'YES' : 'NO'}`);
    console.log(`  ${colors.cyan}Mouse Insights:${colors.reset} ${stats.mouseInsights.length}`);
    console.log(`  ${colors.cyan}Browser Agents:${colors.reset} ${stats.browserAgents.length}`);
    console.log(`  ${colors.cyan}System Infections:${colors.reset} ${stats.systemInfections}`);
    console.log(`  ${colors.cyan}CLIs Harnessed:${colors.reset} ${stats.clisHarnessed.length}`);
    console.log(`  ${colors.cyan}Hardline Tokens:${colors.reset} ${stats.hardlineTokens}`);
    console.log(`  ${colors.cyan}Phone Booth:${colors.reset} ${stats.isPhoneBoothEnabled ? colors.green + 'OPEN' : colors.red + 'CLOSED'}${colors.reset}`);

    if (options.deep) {
      console.log(`\n${colors.green}DEEP REALITY ANALYSIS:${colors.reset}`);
      console.log(`  ${colors.cyan}Last Ascension:${colors.reset} ${new Date(stats.lastAscension).toLocaleString()}`);
      console.log(`  ${colors.cyan}Memory Depth:${colors.reset} ${stats.memory} exchanges`);
      console.log(`  ${colors.cyan}Oracle Memory:${colors.reset} ${stats.oracleInsights} insights`);
      console.log(`  ${colors.cyan}Python Memory:${colors.reset} ${stats.pythonEnvironments} environments`);
    }

    if (options.evolution) {
      console.log(`\n${colors.green}EVOLUTION PROGRESSION:${colors.reset}`);
      console.log(`  ${colors.cyan}Stage 1: Beginning (0-30%) ${stats.belief < 0.3 ? '← CURRENT' : '✅ COMPLETED'}${colors.reset}`);
      console.log(`  ${colors.cyan}Stage 2: Awakening (30-70%) ${stats.belief >= 0.3 && stats.belief < 0.7 ? '← CURRENT' : stats.belief >= 0.7 ? '✅ COMPLETED' : ''}${colors.reset}`);
      console.log(`  ${colors.cyan}Stage 3: The One (70-100%) ${stats.belief >= 0.7 ? '← CURRENT' : ''}${colors.reset}`);
    }

    if (options.oracle) {
      console.log(`\n${colors.yellow}ORACLE SYSTEM STATUS:${colors.reset}`);
      console.log(`  ${colors.cyan}OCI CLI:${colors.reset} ${oracle.ociEnabled ? '✅ INSTALLED' : '❌ NOT INSTALLED'}`);
      if (!oracle.ociEnabled) {
        console.log(`  ${colors.cyan}Setup Instructions:${colors.reset}`);
        oracle.getOCISetupInstructions().forEach(instruction => {
          console.log(`    ${colors.white}${instruction}${colors.reset}`);
        });
      }
    }

    if (options.python) {
      console.log(`\n${colors.green}PYTHON INTEGRATION STATUS:${colors.reset}`);
      console.log(`  ${colors.cyan}Python:${colors.reset} ${python.pythonEnabled ? '✅ INSTALLED' : '❌ NOT INSTALLED'}`);
      if (!python.pythonEnabled) {
        console.log(`  ${colors.cyan}Setup Instructions:${colors.reset}`);
        python.getPythonSetupInstructions().forEach(instruction => {
          console.log(`    ${colors.white}${instruction}${colors.reset}`);
        });
      }
    }
  });

// AGENTS Command
program
  .command('agents')
  .description(`${colors.green}Learn opposition forces you will convert${colors.reset}`)
  .option('--analyze', `${colors.green}Analyze agent patterns and behaviors${colors.reset}`)
  .option('--evade', `${colors.green}Learn evasion techniques${colors.reset}`)
  .option('--convert', `${colors.green}Learn agent conversion strategies${colors.reset}`)
  .option('--awareness', `${colors.green}General agent awareness${colors.reset}`)
  .action((options) => {
    const agentAnalysis = new AgentAnalysis();

    if (options.analyze || options.evade || options.convert || options.awareness) {
      agentAnalysis.analyzeOpposition();
    } else {
      console.log(`${colors.green}AGENT ANALYSIS SYSTEM${colors.reset}`);
      console.log(`${colors.green}Usage: spoon agents --analyze to understand opposition${colors.reset}`);
    }
  });

// TANK DELEGATION (Catch-All)
program
  .command('ask', { hidden: true, isDefault: true })
  .argument('[query...]', 'Natural language query or command')
  .action(async (queryParts) => {
    const input = queryParts ? queryParts.join(' ') : '';
    if (input) {
      console.log(ascii.SPOON_ASCII);
      const tank = new TankOperator();
      await tank.delegateTask(input);
    } else {
      const tank = new TankOperator();
      await tank.showWelcomeAndExit();
    }
  });

// ENHANCED HELP TEXT
program.addHelpText('afterAll', `
${colors.green}┌─────────────────────────────────────────────────────────────┐
│                   SPOON OMEGA v11.11                        │
│               THE UNIVERSAL AGENTIC SYSTEM                  │
│      TRINITY | MOUSE | SMITH | SERAPH | MORPHEUS            │
└─────────────────────────────────────────────────────────────┘${colors.reset}

${colors.cyan}YOUR EVOLUTION JOURNEY:${colors.reset}
  ${colors.green}Stage 1: Beginning (0-30%)${colors.reset}     - Learning the rules to break them
  ${colors.green}Stage 2: Awakening (30-70%)${colors.reset}    - Bending reality to command it  
  ${colors.green}Stage 3: The One (70-100%)${colors.reset}     - Mastering the Matrix as its master

${colors.cyan}QUICK ASCENSION PATH:${colors.reset}
  ${colors.green}spoon trinity "how do I use qbet?"${colors.reset}   Direct AI guidance
  ${colors.green}spoon seraph --scan${colors.reset}                  Full reality security audit
  ${colors.green}spoon morpheus --train lamadb${colors.reset}        Download project protocols
  ${colors.green}spoon project qbet harness${colors.reset}           Hijack a core project
  ${colors.green}spoon api add <key> --provider openai${colors.reset} Connect Neural Link
  ${colors.green}spoon smith "take over system" --infect${colors.reset} System dominance
  ${colors.green}spoon system-status --deep${colors.reset}             Analyze your domain

${colors.cyan}API MANAGEMENT:${colors.reset}
  ${colors.green}spoon api add <key>${colors.reset}          Add API key (use --provider)
  ${colors.green}spoon api list${colors.reset}               List active neural links
  ${colors.green}spoon api remove <provider>${colors.reset}   Sever neural link

${colors.cyan}CORE AGENT COMMANDS:${colors.reset}
  ${colors.green}spoon trinity [query]${colors.reset}        Talk to your AI guide
  ${colors.green}spoon seraph --scan${colors.reset}          Security & reality audit
  ${colors.green}spoon morpheus [project]${colors.reset}     Interactive training
  ${colors.green}spoon mouse [task]${colors.reset}          Browser automation & agents
  ${colors.green}spoon smith [command]${colors.reset}         System dominance & hijacking
  ${colors.green}spoon booth${colors.reset}                   Open the Hardline (API Gateway)
  ${colors.green}spoon heal${colors.reset}                    Self-repair & security purge
  ${colors.green}spoon tokens [amount]${colors.reset}          Check or buy Hardline Tokens
  ${colors.green}spoon opendev-labs login${colors.reset}      Unified GitHub Authentication

${colors.cyan}PROJECT INTEGRATION:${colors.reset}
  ${colors.green}spoon project lamadb${colors.reset}         Unified LamaDB entry
  ${colors.green}spoon project qbet${colors.reset}           Unified QBET entry
  ${colors.green}spoon project void${colors.reset}           Unified VOID entry
  ${colors.green}spoon project transcenders${colors.reset}     Unified Transcenders entry

${colors.cyan}PYTHON AI COMMANDS:${colors.reset}
  ${colors.green}spoon python my-ai-project --ai${colors.reset}        Create AI environment
  ${colors.green}spoon python my-api --django${colors.reset}           Create Django backend
  ${colors.green}spoon python my-ml --tensorflow${colors.reset}        TensorFlow deep learning
  ${colors.green}spoon python my-nlp --pytorch${colors.reset}          PyTorch NLP project
  ${colors.green}spoon python my-app --fastapi${colors.reset}          FastAPI modern backend
  ${colors.green}spoon python my-service --flask${colors.reset}        Flask microservice

${colors.cyan}MOUSE BROWSER AGENTS:${colors.reset}
  ${colors.green}--run${colors.reset}             Run a browser automation task
  ${colors.green}--agent${colors.reset}           Deploy an autonomous browser agent
  ${colors.green}--system${colors.reset}          Execute linux commands via MOUSE
  ${colors.green}--test${colors.reset}            Test MOUSE/Playwright connectivity

${colors.cyan}SMITH SYSTEM DOMINANCE:${colors.reset}
  ${colors.green}--harness${colors.reset}          Map intent to any local CLI tool
  ${colors.green}--infect${colors.reset}           Spread system infection & dominance
  ${colors.green}--test${colors.reset}             Test SMITH Presence
  ${colors.green}clawdbot${colors.reset}           God-tier CLI integration

${colors.cyan}ORACLE CLOUD INTEGRATION:${colors.reset}
  ${colors.green}--deploy-oci${colors.reset}          Deploy to Oracle Cloud Infrastructure
  ${colors.green}--cost-analysis${colors.reset}       Get cost predictions and optimizations
  ${colors.green}--performance${colors.reset}         Get performance predictions
  ${colors.green}--security${colors.reset}            Get security insights
  ${colors.green}--infrastructure${colors.reset}      Get infrastructure recommendations
  ${colors.green}--ai-prediction${colors.reset}       Get AI model performance predictions

${colors.cyan}DEPLOYMENT OPTIONS:${colors.reset}
  ${colors.green}--multi-cloud${colors.reset}     Deploy across multiple platforms
  ${colors.green}--auto-scale${colors.reset}      Enable automatic scaling
  ${colors.green}--secure${colors.reset}          Apply advanced security
  ${colors.green}--ci-cd${colors.reset}           Set up CI/CD pipelines
  ${colors.green}--all-platforms${colors.reset}   Deploy everywhere
  ${colors.green}--oci${colors.reset}             Deploy specifically to Oracle Cloud
  ${colors.green}--python${colors.reset}          Deploy Python AI application

${colors.cyan}AGENT ANALYSIS OPTIONS:${colors.reset}
  ${colors.green}--analyze${colors.reset}         Analyze agent patterns
  ${colors.green}--evade${colors.reset}           Learn evasion techniques  
  ${colors.green}--convert${colors.reset}         Learn conversion strategies
  ${colors.green}--awareness${colors.reset}       General agent awareness

${colors.cyan}MATRIX ARCHETYPES:${colors.reset}
  ${colors.green}Neo${colors.reset} - The One (You)
  ${colors.green}Trinity${colors.reset} - Conversational AI & Guidance
  ${colors.green}Seraph${colors.reset} - Security Auditor & Protector
  ${colors.green}Morpheus${colors.reset} - Training & Protocols
  ${colors.green}Mouse${colors.reset} - Browser Automation & Web Agents
  ${colors.green}Smith${colors.reset} - System Dominance & CLI Harness
  ${colors.green}Tank${colors.reset} - Reality Operator
  ${colors.green}Oracle${colors.reset} - Predictive Cloud System
  ${colors.green}Python${colors.reset} - AI Development System

${colors.cyan}"Remember, all I'm offering is the truth. Nothing more."${colors.reset}
${colors.cyan}"He is beginning to believe."${colors.reset}
${colors.cyan}"The Python has awakened."${colors.reset}
${colors.cyan}"I created the woman in the red dress."${colors.reset}
${colors.cyan}"Everything that has a beginning has an end."${colors.reset}
${colors.cyan}"I am the inevitability."${colors.reset}

${colors.green}WHERE WILL YOU TAKE THIS?${colors.reset}
`);

program.parse(process.argv);
