import { callGemini } from './geminiProvider.js';
import { callGroq } from './groqProvider.js';
import { callOpenAI } from './openaiProvider.js';

class AITrafficController {
  constructor() {
    this.providers = [
      { name: 'Gemini', fn: callGemini, isHealthy: true, rateLimitedUntil: 0 },
      { name: 'Groq', fn: callGroq, isHealthy: true, rateLimitedUntil: 0 },
      { name: 'OpenAI', fn: callOpenAI, isHealthy: true, rateLimitedUntil: 0 },
    ];
    this.currentIndex = 0;
  }

  getNextProviderIndex() {
    const now = Date.now();
    for (let i = 0; i < this.providers.length; i++) {
      const idx = (this.currentIndex + i) % this.providers.length;
      const provider = this.providers[idx];
      // Check if cooldown expired
      if (!provider.isHealthy && now > provider.rateLimitedUntil) {
        provider.isHealthy = true;
      }
      if (provider.isHealthy) {
        this.currentIndex = (idx + 1) % this.providers.length;
        return idx;
      }
    }
    // If all rate limited, force reset and try current
    return 0;
  }

  async generateSocraticQuiz(promptText) {
    const attempts = this.providers.length;
    let lastError = null;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const providerIndex = this.getNextProviderIndex();
      const provider = this.providers[providerIndex];

      try {
        console.log(`[AI Traffic Controller]: Dispatching request to Provider '${provider.name}'`);
        const rawResponse = await provider.fn(promptText);
        const parsed = JSON.parse(rawResponse);
        return {
          providerUsed: provider.name,
          data: parsed,
        };
      } catch (err) {
        console.warn(`[AI Traffic Controller]: Provider '${provider.name}' failed. Error: ${err.message}`);
        lastError = err;

        // Mark provider as temporarily rate-limited / unhealthy for 60 seconds
        provider.isHealthy = false;
        provider.rateLimitedUntil = Date.now() + 60000;
      }
    }

    throw new Error(`All 3 AI Providers failed to execute request. Last error: ${lastError?.message}`);
  }
}

export const aiTrafficController = new AITrafficController();
