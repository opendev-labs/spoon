function extractProjectName(input) {
    if (!input || typeof input !== 'string') return 'matrix-project';

    const patterns = [
        /(?:create|make|build)\s+(?:a\s+)?(?:app|project|website|site|env|environment|ai|model)\s+(?:called|named)?\s*["']?([a-zA-Z0-9\-_]+)["']?/i,
        /(?:app|project|website|env|environment|ai|model)\s+(?:called|named)?\s*["']?([a-zA-Z0-9\-_]+)["']?/i,
        /create\s+[a-z-]+\s+([a-zA-Z0-9\-_]+)/i,
        /(?:called|named|name)\s+["']?([a-zA-Z0-9\-_]+)["']?/i,
        /(?:for|with)\s+["']?([a-zA-Z0-9\-_]+)["']?/i,
        /["']([a-zA-Z0-9\-_]+)["']/i,
        /\b(?:create|make|build)\s+(?:a\s+)?[\w-]+\s+([a-zA-Z0-9\-_]+)(?:\s|$)/i
    ];

    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match && match[1] && match[1].length > 1) {
            return match[1];
        }
    }

    const words = input.split(/\s+/).filter(word =>
        word.length > 3 &&
        /^[a-zA-Z0-9\-_]+$/.test(word) &&
        !['create', 'make', 'build', 'deploy', 'setup', 'with', 'and', 'python', 'ai', 'env'].includes(word.toLowerCase())
    );

    return words.length > 0 ? words[0] : 'matrix-project';
}

module.exports = {
    extractProjectName
};
