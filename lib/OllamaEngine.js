const axios = require('axios');
const colors = require('./colors');

class OllamaEngine {
    constructor(host = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434', model = process.env.OLLAMA_MODEL || 'opendev-labs/nanopi') {
        this.host = host;
        this.model = model;
    }

    async generateContent(prompt, systemInstruction = null) {
        try {
            const fullPrompt = systemInstruction
                ? `<|im_start|>system\n${systemInstruction}<|im_end|>\n<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant`
                : prompt;

            const response = await axios.post(`${this.host}/api/generate`, {
                model: this.model,
                prompt: fullPrompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9
                }
            });

            return {
                response: {
                    text: () => response.data.response
                }
            };
        } catch (error) {
            console.error(`${colors.red}Ollama Error: ${error.message}${colors.reset}`);
            throw error;
        }
    }

    async chat(messages, systemInstruction = null) {
        // Convert messages to Ollama format
        const conversationPrompt = messages.map(msg => {
            const role = msg.role === 'user' ? 'user' : 'assistant';
            const content = typeof msg.parts === 'string' ? msg.parts : msg.parts[0]?.text || '';
            return `<|im_start|>${role}\n${content}<|im_end|>`;
        }).join('\n');

        const fullPrompt = systemInstruction
            ? `<|im_start|>system\n${systemInstruction}<|im_end|>\n${conversationPrompt}\n<|im_start|>assistant`
            : `${conversationPrompt}\n<|im_start|>assistant`;

        try {
            const response = await axios.post(`${this.host}/api/generate`, {
                model: this.model,
                prompt: fullPrompt,
                stream: false
            });

            return {
                response: {
                    text: () => response.data.response
                }
            };
        } catch (error) {
            console.error(`${colors.red}Ollama Chat Error: ${error.message}${colors.reset}`);
            throw error;
        }
    }
}

module.exports = OllamaEngine;
