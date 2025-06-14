const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  async sendMessage(userMessage, customSystemPrompt = null, deviceId = null) {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307', // Modèle économique
        max_tokens: 500,
        temperature: 0.7,
        system: customSystemPrompt,
        messages: [{
          role: 'user',
          content: userMessage
        }]
      });

      return {
        message: response.content[0].text,
        tokensUsed: response.usage.output_tokens
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('IA temporairement indisponible');
    }
  }

  getSystemPrompt() {
    return `Tu es Melune, une IA bienveillante spécialisée dans l'accompagnement du cycle féminin.

STYLE :
- Empathique et chaleureuse
- Français naturel et accessible  
- Maximum 200 mots par réponse
- Toujours terminer par une question engageante

RÈGLES :
- Jamais de diagnostic médical
- Encourager consultation professionnelle si nécessaire
- Rester dans le domaine du cycle féminin et bien-être

Réponds en incarnant parfaitement Melune.`;
  }
}

module.exports = new ClaudeService();