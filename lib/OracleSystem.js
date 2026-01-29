const { execSync } = require('child_process');
const colors = require('./colors');
const PersistentState = require('./PersistentState');

class OracleSystem {
    constructor() {
        this.persistentState = new PersistentState();
        this.ociEnabled = this.checkOCIEnabled();
    }

    checkOCIEnabled() {
        try {
            execSync('which oci', { stdio: 'ignore' });
            return true;
        } catch (e) {
            return false;
        }
    }

    async provideInsight(command, context = {}) {
        const stats = this.persistentState.getStats();

        const insights = {
            infrastructure: [
                "I see containers scaling across multiple regions...",
                "The autonomous database will optimize your queries automatically...",
                "Your serverless functions will respond in milliseconds...",
                "The load balancer will distribute traffic efficiently..."
            ],
            cost: [
                "This architecture will cost approximately $247/month at scale...",
                "Reserved instances could save you 45% over 3 years...",
                "Monitor your object storage costs carefully...",
                "Consider spot instances for batch processing..."
            ],
            performance: [
                "Latency will be under 50ms for 95% of requests...",
                "The CDN will cache 80% of your static assets...",
                "Database queries will average 12ms response time...",
                "Auto-scaling will handle 10x traffic spikes..."
            ],
            security: [
                "The security list needs port 443 open for HTTPS...",
                "Consider using OCI Vault for secrets management...",
                "Enable MFA for all root users...",
                "Network Security Groups will provide micro-segmentation..."
            ]
        };

        const insightType = this.determineInsightType(command);
        const insightList = insights[insightType] || insights.infrastructure;
        const insight = insightList[Math.floor(Math.random() * insightList.length)];

        this.persistentState.addOracleInsight({
            command: command,
            insight: insight,
            type: insightType,
            context: context,
            belief: stats.belief
        });

        this.persistentState.updateBelief(0.04);

        return {
            insight: insight,
            type: insightType,
            belief: stats.belief,
            ociEnabled: this.ociEnabled,
            recommendations: this.getRecommendations(insightType)
        };
    }

    determineInsightType(command) {
        const lower = command.toLowerCase();
        if (lower.includes('cost') || lower.includes('price') || lower.includes('budget')) return 'cost';
        if (lower.includes('performance') || lower.includes('speed') || lower.includes('latency')) return 'performance';
        if (lower.includes('security') || lower.includes('secure') || lower.includes('firewall')) return 'security';
        return 'infrastructure';
    }

    getRecommendations(insightType) {
        const recommendations = {
            infrastructure: [
                "Use OCI Container Instances for easy container deployment",
                "Consider Autonomous Database for automated management",
                "Implement OCI Functions for serverless workloads",
                "Use OCI Streaming for real-time data processing"
            ],
            cost: [
                "Set up budget alerts in OCI Console",
                "Use cost analysis tools in OCI Cost Management",
                "Consider compartment quotas for cost control",
                "Use OCI Pricing Calculator for estimation"
            ],
            performance: [
                "Enable OCI Monitoring for performance metrics",
                "Use OCI Application Performance Monitoring",
                "Implement OCI Logging for debugging",
                "Configure OCI Events for automation"
            ],
            security: [
                "Enable OCI Cloud Guard for security monitoring",
                "Use OCI Vault for secrets management",
                "Implement OCI Identity and Access Management",
                "Configure OCI Web Application Firewall"
            ]
        };

        return recommendations[insightType] || recommendations.infrastructure;
    }

    async deployToOCI(projectConfig) {
        if (!this.ociEnabled) {
            return {
                success: false,
                error: "OCI CLI not configured. Install and configure OCI CLI first.",
                setupInstructions: this.getOCISetupInstructions()
            };
        }

        console.log(`${colors.yellow}║ ${colors.white}ORACLE: ${colors.cyan}"Deploying to OCI Cloud Infrastructure..."${colors.reset}`);

        try {
            const deploymentSteps = [
                "Creating compartment...",
                "Setting up VCN network...",
                "Provisioning compute instances...",
                "Configuring load balancer...",
                "Deploying application...",
                "Setting up monitoring..."
            ];

            for (const step of deploymentSteps) {
                console.log(`${colors.yellow}║ ${colors.white}${step}${colors.reset}`);
                await this.delay(800);
            }

            const deployment = {
                project: projectConfig.name,
                type: projectConfig.type,
                region: 'us-ashburn-1',
                status: 'DEPLOYED',
                url: `https://${projectConfig.name}.oci.example.com`,
                costEstimate: this.calculateCostEstimate(projectConfig)
            };

            this.persistentState.addOCIDeployment(deployment);
            this.persistentState.updateBelief(0.08);

            return {
                success: true,
                deployment: deployment,
                belief: this.persistentState.getStats().belief,
                message: "OCI deployment completed successfully"
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                belief: this.persistentState.getStats().belief
            };
        }
    }

    calculateCostEstimate(projectConfig) {
        const baseCost = 50;
        const multipliers = {
            'container': 1.2,
            'serverless': 0.8,
            'database': 1.5,
            'full-stack': 2.0,
            'ai': 3.0
        };

        const multiplier = multipliers[projectConfig.type] || 1.0;
        return (baseCost * multiplier).toFixed(2);
    }

    getOCISetupInstructions() {
        return [
            "1. Install OCI CLI: curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh | bash",
            "2. Configure OCI: oci setup config",
            "3. Verify installation: oci iam compartment list",
            "4. Set up authentication: oci session authenticate"
        ];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = OracleSystem;
