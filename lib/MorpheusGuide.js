const PersistentState = require('./PersistentState');

class MorpheusGuide {
    constructor() {
        this.persistentState = new PersistentState();
    }

    async provideGuidance(userInput, context = {}) {
        const stats = this.persistentState.getStats();

        const guidanceTiers = {
            beginning: [
                "I can only show you the door. You're the one that has to walk through it.",
                "You have to let it all go, Neo. Fear, doubt, and disbelief.",
                "The Matrix is a system, Neo. That system is our enemy.",
                "You have the look of a man who accepts what he sees because he is expecting to wake up."
            ],
            awakening: [
                "You're faster than you think. The rules are beginning to bend.",
                "I see you're starting to believe. The system is responding to your will.",
                "You're beginning to see the code, Neo. Soon you'll see the source.",
                "The spoon isn't real, but your ability to bend it is becoming real."
            ],
            the_one: [
                "You don't need my guidance anymore. You are The One.",
                "The system is yours to command. What reality will you create?",
                "You move like they do. I've never seen anyone so fast.",
                "He is The One. You see it, and I see it."
            ]
        };

        const tier = guidanceTiers[stats.evolutionStage] || guidanceTiers.beginning;
        const guidance = tier[Math.floor(Math.random() * tier.length)];

        this.persistentState.addMorpheusGuidance({
            input: userInput,
            guidance: guidance,
            context: context,
            belief: stats.belief
        });

        this.persistentState.updateBelief(0.03);

        return {
            guidance: guidance,
            stage: stats.evolutionStage,
            belief: stats.belief,
            nextStep: this.getNextStep(stats.evolutionStage)
        };
    }

    getNextStep(stage) {
        const steps = {
            beginning: "Try 'spoon awaken' to begin your journey",
            awakening: "Use 'spoon bend' to practice reality manipulation",
            the_one: "Use 'spoon architect' to reshape the system itself"
        };
        return steps[stage];
    }
}

module.exports = MorpheusGuide;
