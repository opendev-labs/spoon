const colors = require('./colors');

class ErrorHandler {
    static getSuggestion(error, command) {
        const errorMsg = error.toLowerCase();
        const suggestions = {
            'already exists': `${colors.white}Try a different project name or delete the existing directory${colors.reset}`,
            'requires confirmation': `${colors.white}Add --yes flag to auto-confirm deployment${colors.reset}`,
            'not found': `${colors.white}Check if the CLI tool is installed${colors.reset}`,
            'permission denied': `${colors.white}Try running with sudo or check directory permissions${colors.reset}`,
            'command not found': `${colors.white}Install the required CLI tool first${colors.reset}`,
            'no such file': `${colors.white}Create the project first before running this command${colors.reset}`,
            'conflict': `${colors.white}Directory already exists - choose a different name${colors.reset}`,
            'python not found': `${colors.white}Install Python 3.7+ from python.org${colors.reset}`,
            'virtual environment': `${colors.white}Use 'python3 -m venv env_name' to create virtual env${colors.reset}`
        };

        for (const [pattern, suggestion] of Object.entries(suggestions)) {
            if (errorMsg.includes(pattern)) {
                return suggestion;
            }
        }
        return `${colors.white}Check the command syntax and dependencies${colors.reset}`;
    }
}

module.exports = ErrorHandler;
