// controllers/chatController.js (version protégée)
const ClaudeService = require('../services/ClaudeService');
const PromptBuilder = require('../services/PromptBuilder');

// Instance réutilisable du PromptBuilder
const promptBuilder = new PromptBuilder();

class ChatController {
  async handleChat(req, res) {
    try {
      const { message, context } = req.body;
      const deviceId = req.deviceId;

      // Validation input
      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          error: 'INVALID_MESSAGE',
          message: 'Message vide non autorisé'
        });
      }

      if (message.length > 2000) {
        return res.status(400).json({
          error: 'MESSAGE_TOO_LONG', 
          message: 'Message trop long (max 2000 caractères)'
        });
      }

      // Extraction du système prompt du context si présent
      const systemPrompt = promptBuilder.buildContextualPrompt(context || {});
      
      // Appel Claude avec protection budget
      const response = await ClaudeService.sendMessage(message, systemPrompt, deviceId);

      // Réponse normale
      if (!response.isFallback) {
        return res.json({
          response: response.message,
          tokensUsed: response.tokensUsed,
          cost: response.cost,
          responseTime: response.responseTime,
          timestamp: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
        });
      }

      // Réponse fallback (pas d'erreur côté client)
      return res.json({
        response: response.message,
        isFallback: true,
        persona: response.persona,
        timestamp: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
      });

    } catch (error) {
      return this.handleChatError(error, req, res);
    }
  }

  handleChatError(error, req, res) {
    const deviceId = req.deviceId;
    const context = req.body?.context;
    const persona = context?.persona || 'general';

    console.error('💬 Chat error:', {
      deviceId: deviceId?.substring(0, 8) + '***',
      error: error.message,
      persona: persona
    });

    // Gestion erreurs spécifiques avec fallbacks personas
    switch (error.message) {
      case 'CLAUDE_RATE_LIMIT':
        return res.status(429).json({
          error: 'RATE_LIMIT',
          response: this.getRateLimitFallback(persona),
          retryAfter: 60,
          isFallback: true
        });

      case 'CLAUDE_QUOTA_EXCEEDED':
        return res.status(429).json({
          error: 'QUOTA_EXCEEDED',
          response: this.getQuotaFallback(persona),
          retryAfter: 3600, // 1h
          isFallback: true
        });

      case 'BUDGET_DAILY_BUDGET_EXCEEDED':
      case 'BUDGET_WEEKLY_BUDGET_EXCEEDED':
      case 'BUDGET_MONTHLY_BUDGET_EXCEEDED':
        return res.status(429).json({
          error: 'BUDGET_EXCEEDED',
          response: this.getBudgetFallback(persona),
          retryAfter: 86400, // 24h
          isFallback: true
        });

      case 'CLAUDE_TIMEOUT':
        return res.status(504).json({
          error: 'TIMEOUT',
          response: this.getTimeoutFallback(persona),
          retryAfter: 30,
          isFallback: true
        });

      case 'CLAUDE_UNAVAILABLE':
      default:
        return res.status(503).json({
          error: 'SERVICE_UNAVAILABLE',
          response: this.getUnavailableFallback(persona),
          retryAfter: 300, // 5min
          isFallback: true
        });
    }
  }

  getRateLimitFallback(persona) {
    const responses = {
      emma: "Oups ! 😅 Je suis un peu débordée là. Reviens dans une minute ? En attendant, rappelle-toi que tu es extraordinaire ! 💕",
      
      laure: "Limite temporaire atteinte. Je reviens dans 60 secondes. Profitez de cette pause pour noter vos ressentis actuels.",
      
      sylvie: "Ma chérie, il y a un petit embouteillage technique. Patiente juste une minute, je serai vite de retour pour t'accompagner.",
      
      christine: "Service temporairement saturé. Prenez ce moment pour respirer profondément. Je serai là pour vous dans un instant.",
      
      clara: "Hey ! 😊 Trop de monde en même temps ! Laisse-moi une minute pour me remettre d'aplomb. On reprend très vite notre super conversation !"
    };

    return responses[persona] || responses.clara;
  }

  getQuotaFallback(persona) {
    const responses = {
      emma: "Oh là là ! 😓 J'ai atteint ma limite quotidienne. Mais ne t'inquiète pas, ton cycle ne s'arrête pas ! Prends soin de toi et retrouvons-nous demain ! 💫",
      
      laure: "Quota API atteint pour aujourd'hui. Service disponible demain. Continuez à écouter votre corps en attendant.",
      
      sylvie: "Ma chérie, j'ai épuisé mes ressources pour aujourd'hui. Repose-toi bien, et on se retrouve demain pour continuer ensemble.",
      
      christine: "Les limites quotidiennes sont atteintes. Prenez ce temps pour vous recentrer. À demain pour poursuivre notre accompagnement.",
      
      clara: "Wouah ! 🤩 J'ai donné tout ce que j'avais aujourd'hui ! Recharge tes batteries cette nuit, et demain on reprend avec encore plus d'énergie !"
    };

    return responses[persona] || responses.clara;
  }

  getBudgetFallback(persona) {
    const responses = {
      emma: "Petit souci technique côté budget ! 💸 Mais toi, tu continues d'être fabuleuse ! On se retrouve très bientôt, promis ! ✨",
      
      laure: "Budget de service atteint. Maintenance préventive en cours. Service rétabli sous 24h maximum.",
      
      sylvie: "Ma chérie, nous devons faire une petite pause technique. Ton bien-être reste ma priorité. À très bientôt !",
      
      christine: "Une pause s'impose pour des raisons techniques. Utilisez ce temps pour la réflexion et l'introspection.",
      
      clara: "Oops ! 😅 Budget technique atteint ! Mais ça me donne l'occasion de me reposer pour être encore meilleure demain ! À très vite !"
    };

    return responses[persona] || responses.clara;
  }

  getTimeoutFallback(persona) {
    const responses = {
      emma: "Timeout ! ⏰ Je réfléchissais trop à ta question ! 😄 Réessaie, je serai plus rapide cette fois !",
      
      laure: "Délai de réponse dépassé. Veuillez reformuler votre demande pour une réponse optimisée.",
      
      sylvie: "Ma chérie, j'ai pris trop de temps à réfléchir ! Pose-moi ta question à nouveau, je serai plus réactive.",
      
      christine: "Le temps de réflexion a été trop long. Reformulez votre pensée, je vous écoute attentivement.",
      
      clara: "Oups ! ⏰ J'ai pris trop de temps à mijoter ma réponse ! Relance-moi ta question, je promets d'être plus speed ! 😊"
    };

    return responses[persona] || responses.clara;
  }

  getUnavailableFallback(persona) {
    const responses = {
      emma: "Petit bug technique ! 🤖 Mais ton cycle, lui, continue parfaitement ! Réessaie dans 5 minutes ? 💕",
      
      laure: "Service temporairement indisponible. Maintenance en cours. Retry dans 5 minutes pour un service optimal.",
      
      sylvie: "Ma chérie, il y a un petit souci technique. Prends ces 5 minutes pour toi, et on reprend notre conversation après !",
      
      christine: "Difficulté technique momentanée. Accordez-vous 5 minutes de pause, puis nous reprendrons sereinement.",
      
      clara: "Bug technique détecté ! 🔧 Parfait moment pour un mini-break ! Dans 5 minutes, je serai de retour en pleine forme ! ✨"
    };

    return responses[persona] || responses.clara;
  }
}

const chatController = new ChatController();

module.exports = {
  handleChat: chatController.handleChat.bind(chatController)
};