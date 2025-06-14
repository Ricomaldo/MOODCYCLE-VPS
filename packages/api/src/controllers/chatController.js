// controllers/chatController.js - Version enrichie
const ClaudeService = require('../services/ClaudeService');
const PromptBuilder = require('../services/PromptBuilder');

class ChatController {
  constructor() {
    this.claudeService = ClaudeService;
    this.promptBuilder = new PromptBuilder();
    
    // Bind methods pour éviter perte de contexte
    this.handleChat = this.handleChat.bind(this);
  }

  async handleChat(req, res) {
    try {
      const { message, context = {} } = req.body;
      const deviceId = req.deviceId;

      // Validation input
      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: { code: 'MESSAGE_REQUIRED', message: 'Message requis' }
        });
      }

      // Validation contexte
      const contextErrors = this.promptBuilder.validateContext(context);
      if (contextErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: { 
            code: 'INVALID_CONTEXT', 
            message: 'Contexte invalide',
            details: contextErrors
          }
        });
      }

      // Construction prompt contextuel
      const systemPrompt = this.buildSystemPrompt(context);
      
      // Appel Claude avec contexte enrichi
      const claudeResponse = await this.claudeService.sendMessage(
        message,
        systemPrompt,
        deviceId
      );

      // Log pour monitoring (données anonymisées)
      this.logConversation(deviceId, {
        persona: context.persona,
        phase: context.currentPhase,
        hasPreferences: !!context.preferences,
        responseLength: claudeResponse.message?.length || 0
      });

      // Réponse enrichie
      res.json({
        success: true,
        data: {
          message: claudeResponse.message,
          metadata: {
            persona: context.persona || 'non défini',
            phase: context.currentPhase || 'non définie',
            tokensUsed: claudeResponse.tokensUsed || 0,
            conversationId: this.generateConversationId(),
            timestamp: new Date().toISOString()
          }
        },
        session: this.buildSessionResponse(req)
      });

    } catch (error) {
      console.error('Chat Error:', error);
      
      // Réponse fallback selon persona
      const fallbackResponse = this.getFallbackResponse(req.body.context);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVICE_ERROR',
          message: 'Service temporairement indisponible'
        },
        fallback: fallbackResponse
      });
    }
  }

  /**
   * Construit prompt système selon sophistication demandée
   */
  buildSystemPrompt(context) {
    // Si données complètes OnboardingStore -> prompt contextualisé
    if (this.hasRichContext(context)) {
      return this.promptBuilder.buildContextualPrompt(context);
    }
    
    // Sinon -> prompt compact
    return this.promptBuilder.buildCompactPrompt(context);
  }

  /**
   * Vérifie si contexte assez riche pour personnalisation avancée
   */
  hasRichContext(context) {
    return context.persona && 
           context.userProfile && 
           Object.keys(context.preferences || {}).length > 0;
  }

  /**
   * Génère réponse fallback personnalisée
   */
  getFallbackResponse(context) {
    const persona = context?.persona || 'emma';
    
    const fallbacks = {
      emma: "Désolée ma belle, j'ai un petit souci technique ! Peux-tu me reparler de ce qui te préoccupe ? 💕",
      laure: "Service temporairement indisponible. Je reviens rapidement pour t'accompagner efficacement.",
      sylvie: "Je rencontre un petit problème technique, mais je suis là. Dis-moi ce qui t'inquiète ?",
      christine: "Les énergies numériques me perturbent un instant... Reformule ta question, belle âme.",
      clara: "Erreur système détectée. Retry en cours... En attendant, précise ta demande ?"
    };

    return {
      message: fallbacks[persona] || fallbacks.emma,
      metadata: { isFallback: true, persona }
    };
  }

  /**
   * Log conversation pour analytics (anonymisé)
   */
  logConversation(deviceId, data) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: 'conversation',
      deviceId: deviceId.substring(0, 8) + '***', // Anonymiser
      ...data
    }));
  }

  /**
   * Construit réponse session
   */
  buildSessionResponse(req) {
    return {
      token: req.sessionToken,
      isNewSession: req.isNewSession || false
    };
  }

  /**
   * Génère ID conversation unique
   */
  generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export des fonctions pour Express
const chatController = new ChatController();

module.exports = {
  handleChat: chatController.handleChat
};