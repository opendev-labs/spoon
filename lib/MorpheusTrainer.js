const colors = require('./colors');
const { MORPHEUS_ASCII } = require('./ascii');
const PersistentState = require('./PersistentState');

class MorpheusTrainer {
    constructor() {
        this.persistentState = new PersistentState();
    }

    async train(project) {
        console.log(MORPHEUS_ASCII);
        const target = project.toLowerCase();

        const guides = {
            'lamadb': [
                "LamaDB: The unified intelligence database.",
                "Use 'lama auth' to connect your consciousness.",
                "Query patterns are mapped via natural language.",
                "Schema-less reality for quantum-level storage."
            ],
            'qbet': [
                "QBET: Quantum Build & Execution Tool.",
                "Manifest your desires in .qbet files.",
                "Execution is non-linear and hyper-fast.",
                "Harness the power of all quantum projects."
            ],
            'void': [
                "VOID: Hyper-Intelligent Virtual Environment.",
                "Manage environments like reality layers.",
                "Isolated execution in protected containers.",
                "A Vercel-level deployment system for your PC."
            ]
        };

        const steps = guides[target] || [
            `Training sequence for ${project} initiated...`,
            "Analyzing project architecture...",
            "Feeding documentation into neural link...",
            "Training complete. You now know the rules."
        ];

        console.log(`${colors.green}║ ${colors.white}MORPHEUS: "Free your mind, Neo. I'm uploading the ${target.toUpperCase()} protocols."${colors.reset}`);

        for (const step of steps) {
            console.log(`${colors.green}║ ${colors.white}• ${step}${colors.reset}`);
            await new Promise(r => setTimeout(r, 600));
        }

        this.persistentState.updateBelief(0.1);
        return { success: true, belief: this.persistentState.getStats().belief };
    }
}

module.exports = MorpheusTrainer;
