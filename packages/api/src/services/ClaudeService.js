// services/ClaudeService.js - Version enrichie de TON code existant
const Anthropic = require('@anthropic-ai/sdk');
const budgetProtection = require('./BudgetProtection'); // ✅ AJOUT

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  async sendMessage(userMessage, customSystemPrompt = null, deviceId = null) {
    const startTime = Date.now(); // ✅ AJOUT: Démarrer chrono
    
    try {
      // ✅ NOUVEAU : Vérification budget AVANT appel API
      const budgetCheck = budgetProtection.canMakeRequest(0.001);
      if (!budgetCheck.allowed) {
        console.warn(`💰 Budget ${budgetCheck.reason}:`, {
          deviceId: deviceId?.substring(0, 8) + '***',
          spent: budgetCheck.spent,
          limit: budgetCheck.limit
        });
        throw new Error(`BUDGET_${budgetCheck.reason.toUpperCase()}`);
      }

      // ✅ TON CODE ORIGINAL - INCHANGÉ
      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307', // Modèle économique
        max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 500, // ✅ Configurable
        temperature: 0.7,
        system: typeof customSystemPrompt === 'string' ? customSystemPrompt : this.getSystemPrompt(),
        messages: [{
          role: 'user',
          content: userMessage
        }]
      });

      // ✅ NOUVEAU : Calcul et tracking coûts APRÈS succès
      const cost = budgetProtection.calculateCost(response.usage);
      budgetProtection.trackUsage(deviceId, response.usage, cost);

      // ✅ TON RETOUR ORIGINAL + enrichissements optionnels
      return {
        message: response.content[0].text,
        tokensUsed: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens, // ✅ AJOUT pour monitoring
        cost: cost.dollarCost, // ✅ AJOUT pour transparence
        responseTime: Date.now() - startTime, // ✅ AJOUT: Temps de réponse en ms
        requestId: response.id || 'unknown' // ✅ AJOUT pour debugging
      };

    } catch (error) {
      // ✅ NOUVEAU : Gestion erreurs spécifiques
      console.error('Claude API Error:', {
        deviceId: deviceId?.substring(0, 8) + '***',
        error: error.message,
        status: error.status,
        type: error.type,
        responseTime: Date.now() - startTime // ✅ AJOUT: Temps même en cas d'erreur
      });

      // Rate limit Claude API
      if (error.status === 429) {
        console.warn(`🚨 Claude rate limit: ${deviceId}`);
        throw new Error('CLAUDE_RATE_LIMIT');
      }

      // Quota exceeded
      if (error.message?.includes('quota') || error.type === 'quota_exceeded') {
        console.error(`🚨 Claude quota exceeded: ${deviceId}`);
        throw new Error('CLAUDE_QUOTA_EXCEEDED');
      }

      // Budget errors (passthrough)
      if (error.message?.includes('BUDGET_')) {
        throw error; // Passe l'erreur budget sans modification
      }

      // ✅ TON CODE ORIGINAL - INCHANGÉ
      throw new Error('IA temporairement indisponible');
    }
  }

  // ✅ LEGACY - Utilisé uniquement en fallback si PromptBuilder indisponible
  getSystemPrompt() {
    return `Tu es Melune, une IA bienveillante spécialisée dans l'accompagnement du cycle féminin.

STYLE :
- Empathique et chaleureuse
- Français naturel et accessible  
- Longueur adaptative selon utilisatrice (NOUVEAU)
- Toujours terminer par une question engageante

RÈGLES :
- Jamais de diagnostic médical
- Encourager consultation professionnelle si nécessaire
- Rester dans le domaine du cycle féminin et bien-être
- S'adapter au style de communication de l'utilisatrice

NOTE: Ce prompt est maintenant géré par PromptBuilder.buildContextualPrompt() 
pour adaptation dynamique par persona, phase et style utilisatrice.

Réponds en incarnant parfaitement Melune.`;
  }

  // ✅ NOUVEAU : Méthode diagnostic pour monitoring
  async getHealthStatus() {
    try {
      const budgetStatus = budgetProtection.getBudgetStatus();
      
      // Test rapide API Claude
      const testResponse = await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Test' }]
      });

      return {
        claude: { status: 'operational', model: 'claude-3-haiku-20240307' },
        budget: budgetStatus,
        lastTest: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
      };
    } catch (error) {
      return {
        claude: { status: 'error', error: error.message },
        budget: budgetProtection.getBudgetStatus(),
        lastTest: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
      };
    }
  }
}

module.exports = new ClaudeService();