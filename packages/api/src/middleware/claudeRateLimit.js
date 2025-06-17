// middleware/claudeRateLimit.js
const rateLimit = require('express-rate-limit');

// Rate limiting par deviceId (évite conflit Nginx)
const claudeRateLimit = rateLimit({
  windowMs: 60 * 1000,        // 1 minute
  max: 12,                    // 12 req/min (buffer vs API limit 50)
  
  // KEY: Utilise deviceId au lieu d'IP
  keyGenerator: (req) => {
    // Priorité deviceId > fallback IP
    return req.deviceId || req.ip || 'anonymous';
  },
  
  // Messages d'erreur personnalisés par persona
  message: (req) => {
    const persona = req.body?.context?.persona || 'general';
    const messages = {
      emma: "Oups ! 😅 Trop de messages d'un coup. Pause d'une minute ?",
      laure: "Limite atteinte. Nouvelle tentative dans 60 secondes.",
      sylvie: "Ma chérie, patiente un petit moment s'il te plaît.",
      christine: "Merci de patienter quelques instants.",
      clara: "Hey ! 😊 Laisse-moi souffler une minute !",
      general: "Limite temporaire atteinte, patientez 1 minute"
    };
    
    return {
      error: 'RATE_LIMIT_EXCEEDED',
      message: messages[persona] || messages.general,
      retryAfter: 60,
      fallback: getFallbackResponse(persona)
    };
  },
  
  // Headers standards pour debugging
  standardHeaders: true,
  legacyHeaders: false,
  
  // Skip requêtes non-chat (précision exacte)
  skip: (req) => req.path !== '/chat',
  
});

// Fallbacks par persona pour rate limiting
function getFallbackResponse(persona = 'general') {
  const fallbacks = {
    emma: {
      message: "En attendant, rappelle-toi que ton cycle est unique ! 💕",
      tone: "friendly",
      suggestion: "Reviens dans une minute pour continuer notre chat !"
    },
    laure: {
      message: "Profitez de cette pause pour noter vos ressentis du moment.",
      tone: "professional", 
      suggestion: "Service disponible dans 60 secondes."
    },
    sylvie: {
      message: "Prends ce temps pour respirer profondément, ma chérie.",
      tone: "maternal",
      suggestion: "Je serai là pour toi dans un instant."
    },
    christine: {
      message: "Ces moments de patience nous apprennent la sagesse.",
      tone: "wise",
      suggestion: "Revenez quand vous le souhaiterez."
    },
    clara: {
      message: "C'est l'occasion parfaite pour un petit étirement ! 🌟",
      tone: "enthusiastic",
      suggestion: "On reprend très vite notre conversation !"
    },
    general: {
      message: "Service temporairement limité",
      tone: "neutral",
      suggestion: "Retry in 60 seconds"
    }
  };
  
  return fallbacks[persona] || fallbacks.general;
}

module.exports = claudeRateLimit;