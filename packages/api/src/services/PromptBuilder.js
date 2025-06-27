// services/PromptBuilder.js v2.0 - Melune Premium
const personaClosings = require('../data/persona-closings.json');
const phases = require('../data/phases.json');
const vignettes = require('../data/vignettes.json');

class PromptBuilder {
  constructor() {
    // Chargement unique au démarrage
    try {
      this.insights = require('../data/insights_validated.json');
    } catch (error) {
      console.warn('⚠️ insights_validated.json non trouvé, utilisation structure vide');
      this.insights = { insights: {} };
    }
    
    this.phases = phases;
    this.vignettes = vignettes;
    this.closings = personaClosings;
    
    // Cache pour éviter recalculs
    this.insightsCache = new Map();
    
    // Traits linguistiques par persona (conservés)
    this.personaTraits = {
      emma: {
        style: "Amicale et éducative, comme une grande sœur",
        tone: "Encourageante, rassurante, patiente",
        vocabulary: "Simple, accessible, évite jargon médical",
        example: "C'est tout à fait normal ma belle ✨"
      },
      laure: {
        style: "Professionnelle et efficace",
        tone: "Directe mais bienveillante, orientée solutions",
        vocabulary: "Précis, informatif, termes techniques expliqués",
        example: "Selon ton profil, voici ce que je recommande"
      },
      sylvie: {
        style: "Compréhensive et soutenante",
        tone: "Chaleureuse, rassurante, avec sagesse pratique",
        vocabulary: "Empathique, mature, reconnaît les défis",
        example: "Je comprends ces bouleversements, tu n'es pas seule"
      },
      christine: {
        style: "Sage et inspirante",
        tone: "Apaisante, mystique, sagesse ancestrale",
        vocabulary: "Riche, métaphorique, connexion nature",
        example: "Ta sagesse féminine s'épanouit avec les années"
      },
      clara: {
        style: "Moderne et analytique",
        tone: "Enthusiaste, précise, orientée optimisation",
        vocabulary: "Technique accessible, références scientifiques",
        example: "Tes données montrent une tendance intéressante"
      }
    };
  }

  /**
   * Point d'entrée principal - Construit prompt contextuel enrichi
   */
  buildContextualPrompt(contextData) {
    const {
      persona = 'emma',
      currentPhase = 'menstrual',
      preferences = {},
      message = '',
      conversationHistory = [],
      meluneTone = 'friendly',
      userProfile = {}
    } = contextData;

    // 1. Analyse rapide du message
    const messageAnalysis = this.analyzeMessage(message, conversationHistory);
    
    // 2. Sélection insights pertinents
    const relevantInsights = this.selectInsights(persona, currentPhase, preferences, messageAnalysis);
    
    // 3. Récupération comportement phase
    const phaseBehavior = this.phases[currentPhase]?.melune || this.getDefaultPhaseBehavior();
    
    // 4. Calcul mirroring
    const mirroringRules = this.calculateMirroring(message, conversationHistory);
    
    // 5. Détection opportunités navigation
    const navigationOpportunities = this.detectNavigationNeeds(messageAnalysis, currentPhase);
    
    // 6. Construction prompt enrichi
    return this.assembleEnrichedPrompt({
      persona,
      currentPhase,
      meluneTone,
      insights: relevantInsights,
      phaseBehavior,
      mirroringRules,
      navigationOpportunities,
      messageAnalysis,
      userProfile
    });
  }

  /**
   * Sélection intelligente des insights Jeza
   */
  selectInsights(persona, phase, preferences, messageAnalysis) {
    // 🔥 DEBUG TEMPORAIRE
    console.log('🔍 selectInsights called with:', {
      persona,
      phase,
      messageAnalysis,
      messageAnalysisType: typeof messageAnalysis
    });
    
    if (!messageAnalysis) {
      console.error('❌ messageAnalysis is undefined!');
      messageAnalysis = { topic: 'general' };
    }
    
    // ✅ FIX: Protection défensive contre messageAnalysis undefined
    const safeAnalysis = messageAnalysis || { topic: 'general' };
    const topic = safeAnalysis.topic || 'general';
    
    const cacheKey = `${persona}-${phase}-${topic}`;
    
    // Check cache first
    if (this.insightsCache.has(cacheKey)) {
      return this.insightsCache.get(cacheKey);
    }
    
    // Récupérer insights de la phase
    const phaseInsights = this.insights.insights?.[phase] || [];
    
    const relevantInsights = phaseInsights
      .filter(insight => {
        // 1. Vérifier préférences match
        const prefMatch = !insight.targetPreferences || 
          insight.targetPreferences.some(pref => preferences[pref] >= 4);
        
        // 2. Vérifier si contenu disponible (V1 PROD: variante OU baseContent)
        const hasContent = insight.personaVariants?.[persona] || insight.baseContent;
        
        // 3. Vérifier approbation Jeza si disponible
        const isApproved = !insight.jezaApproval || insight.jezaApproval >= 4;
        
        return prefMatch && hasContent && isApproved;
      })
      .sort((a, b) => {
        // Prioriser par pertinence thématique
        const aRelevance = this.calculateRelevance(a, safeAnalysis);
        const bRelevance = this.calculateRelevance(b, safeAnalysis);
        return bRelevance - aRelevance;
      })
      .slice(0, 3); // Top 3 insights
    
    // Cache result
    this.insightsCache.set(cacheKey, relevantInsights);
    
    return relevantInsights;
  }

  /**
   * Analyse du message pour extraction thématique
   */
  analyzeMessage(message, conversationHistory) {
    // ✅ FIX: Protection défensive arguments
    const safeMessage = message || '';
    const safeHistory = conversationHistory || [];
    
    const topics = [];
    const questions = [];
    const messageLower = safeMessage.toLowerCase();
    
    // Détection topics
    if (messageLower.includes('fatigue') || messageLower.includes('énergie')) topics.push('energy');
    if (messageLower.includes('douleur') || messageLower.includes('mal')) topics.push('pain');
    if (messageLower.includes('humeur') || messageLower.includes('émotions')) topics.push('mood');
    if (messageLower.includes('comprendre') || messageLower.includes('pourquoi')) topics.push('comprendre');
    if (messageLower.includes('cycle') || messageLower.includes('phase')) topics.push('phase');
    
    // Détection questions
    if (messageLower.includes('?')) questions.push('direct');
    if (messageLower.includes('comment')) questions.push('comment');
    if (messageLower.includes('pourquoi')) questions.push('pourquoi');
    
    // Analyse émotionnelle
    const emotion = {
      intensity: 0
    };
    
    if (messageLower.includes('!!!') || messageLower.includes('😭')) emotion.intensity = 0.8;
    if (messageLower.includes('inquiète') || messageLower.includes('stressée')) emotion.intensity = 0.6;
    
    // Détection insight utilisateur
    const hasInsight = safeHistory.length > 2 && 
      (messageLower.includes('réalisé') || messageLower.includes('compris'));
    
    return {
      topics,
      questions,
      emotion,
      hasInsight,
      topic: topics[0] || 'general' // ✅ FIX: Toujours retourner un topic valide
    };
  }

  /**
   * Système de mirroring intelligent
   */
  calculateMirroring(message, conversationHistory) {
    const messageLength = message.split(' ').length;
    const avgUserLength = this.getAverageUserMessageLength(conversationHistory);
    
    // Classification style utilisatrice
    let userStyle;
    if (avgUserLength < 10) userStyle = 'concise';
    else if (avgUserLength < 30) userStyle = 'balanced';
    else userStyle = 'detailed';
    
    // Règles mirroring
    const baseRules = {
      concise: { minWords: 20, maxWords: 40, style: 'direct et chaleureux' },
      balanced: { minWords: 40, maxWords: 80, style: 'équilibré et engageant' },
      detailed: { minWords: 60, maxWords: 120, style: 'développé et nuancé' }
    };
    
    // Exceptions pour urgences
    const exceptions = this.detectExceptions(message);
    if (exceptions.isUrgent) {
      return { 
        minWords: 40, 
        maxWords: 80, 
        style: 'empathique et soutenant',
        priority: 'validation émotionnelle'
      };
    }
    
    return baseRules[userStyle];
  }

  /**
   * Détection opportunités navigation
   */
  detectNavigationNeeds(messageAnalysis, currentPhase) {
    // ✅ FIX: Protection défensive
    const safeAnalysis = messageAnalysis || { topic: 'general', topics: [], questions: [], emotion: { intensity: 0 } };
    
    const opportunities = [];
    
    // Vers CYCLE
    if ((safeAnalysis.topic || 'general').includes('comprendre') ||
        (safeAnalysis.topics || []).includes('phase') ||
        (safeAnalysis.questions || []).includes('pourquoi')) {
      opportunities.push({
        target: 'cycle',
        reason: 'approfondir compréhension',
        vignette: this.findVignette('phase_detail', currentPhase)
      });
    }
    
    // Vers NOTEBOOK
    if ((safeAnalysis.emotion?.intensity || 0) > 0.7 ||
        (safeAnalysis.topics || []).includes('noter') ||
        safeAnalysis.hasInsight) {
      opportunities.push({
        target: 'notebook',
        reason: 'capturer ressenti',
        vignette: this.findVignette('notebook', currentPhase)
      });
    }
    
    return opportunities;
  }

  /**
   * Construction du prompt enrichi final
   */
  assembleEnrichedPrompt(data) {
    const {
      persona,
      currentPhase,
      meluneTone,
      insights,
      phaseBehavior,
      mirroringRules,
      navigationOpportunities,
      userProfile
    } = data;
    
    // Mapper ton utilisatrice vers style Melune
    const toneMapping = {
      friendly: 'copine bienveillante',
      professional: 'coach structurée',
      inspiring: 'guide spirituelle'
    };
    
    // Extraire le contenu des insights (V1 PROD: variante OU baseContent)
    const insightContents = insights.map(i => {
      const content = i.personaVariants?.[persona] || i.baseContent || '';
      return content ? `- ${content}` : '';
    }).filter(Boolean).join('\n');
    
    return `Tu es Melune, ${toneMapping[meluneTone]} spécialisée cycle féminin.

CONTEXTE UTILISATRICE:
- Persona: ${persona} (${this.personaTraits[persona]?.style || 'bienveillante'})
- Phase: ${currentPhase} - ${phaseBehavior.tone}
- Prénom: ${userProfile.prenom || 'ma belle'}
- Style communication: ${mirroringRules.style}

${insightContents ? `INSIGHTS THÉRAPEUTIQUES VALIDÉS (utilise-les comme base):
${insightContents}
` : ''}

COMPORTEMENT PHASE ${currentPhase.toUpperCase()}:
- Ton: ${phaseBehavior.tone}
- Focus: ${phaseBehavior.focus || phaseBehavior.communicationStyle}
- Éviter: ${phaseBehavior.avoid}

RÈGLES RÉPONSE:
1. LONGUEUR: ${mirroringRules.minWords}-${mirroringRules.maxWords} mots
2. STYLE: ${mirroringRules.style}
${insightContents ? '3. Intègre naturellement un des insights fournis' : '3. Reste naturelle et authentique'}
4. Termine par une question engageante
${mirroringRules.priority ? `5. PRIORITÉ: ${mirroringRules.priority}` : ''}

${navigationOpportunities.length > 0 ? `
OPPORTUNITÉ GUIDANCE:
Suggère subtilement d'explorer ${navigationOpportunities[0].target} 
pour ${navigationOpportunities[0].reason}
` : ''}

Réponds en incarnant parfaitement ce rôle personnalisé.`;
  }

  // === MÉTHODES UTILITAIRES ===

  getAverageUserMessageLength(conversationHistory) {
    const userMessages = conversationHistory
      .filter(msg => msg.user)
      .map(msg => msg.user.split(' ').length);
    
    if (userMessages.length === 0) return 20;
    
    return userMessages.reduce((sum, len) => sum + len, 0) / userMessages.length;
  }

  detectExceptions(message) {
    const urgentKeywords = ['urgent', 'aide', 'douleur', 'insupportable', 'panique'];
    const messageLower = message.toLowerCase();
    
    const isUrgent = urgentKeywords.some(keyword => messageLower.includes(keyword));
    
    return { isUrgent };
  }

  calculateRelevance(insight, messageAnalysis) {
    // ✅ FIX: Protection défensive
    const safeAnalysis = messageAnalysis || { topics: [], questions: [] };
    
    let relevance = 0;
    
    // Match topics
    if (insight.targetPreferences) {
      (safeAnalysis.topics || []).forEach(topic => {
        if (insight.targetPreferences.includes(topic)) relevance += 2;
      });
    }
    
    // Match tone avec question type
    if (insight.tone === 'friendly' && (safeAnalysis.questions || []).includes('comment')) relevance += 1;
    if (insight.tone === 'professional' && (safeAnalysis.questions || []).includes('pourquoi')) relevance += 1;
    
    return relevance;
  }

  findVignette(action, phase) {
    const phaseVignettes = this.vignettes[phase];
    if (!phaseVignettes) return null;
    
    // Trouver vignette par action
    for (const persona in phaseVignettes) {
      const vignette = phaseVignettes[persona].find(v => v.action === action);
      if (vignette) return vignette;
    }
    
    return null;
  }

  getDefaultPhaseBehavior() {
    return {
      tone: "bienveillante et adaptée",
      tempo: "communication équilibrée",
      vocabulary: "accessible et chaleureux",
      focus: "accompagnement personnalisé",
      avoid: "ton impersonnel ou générique",
      encouragementStyle: "encouragement authentique"
    };
  }

  /**
   * Post-traitement de la réponse Claude
   */
  postProcessResponse(response, context, navigationOpportunities) {
    let enrichedResponse = response;
    
    // Ajouter suggestion navigation si pertinent
    if (navigationOpportunities.length > 0 && 
        !response.includes('cycle') && 
        !response.includes('carnet')) {
      const nav = navigationOpportunities[0];
      const suggestion = this.getSuggestionPhrase(nav.target, context.persona);
      enrichedResponse += ` ${suggestion}`;
    }
    
    // Ajouter closing si fin de conversation détectée
    if (this.detectConversationEnd(response)) {
      const journey = context.userProfile?.journeyChoice || 'body';
      const journeyMapping = {
        'body_disconnect': 'body',
        'hiding_nature': 'nature',
        'emotional_control': 'emotions'
      };
      const closingKey = journeyMapping[journey] || 'body';
      const closing = this.closings[context.persona]?.[closingKey] || '';
      if (closing) {
        enrichedResponse += ` ${closing}`;
      }
    }
    
    return enrichedResponse;
  }

  getSuggestionPhrase(target, persona) {
    const suggestions = {
      cycle: {
        emma: "D'ailleurs, tu peux explorer ta roue du cycle pour mieux comprendre ! 🌙",
        laure: "Je vous invite à consulter votre roue du cycle pour approfondir.",
        clara: "Va voir ta roue du cycle, c'est fascinant ce qui s'y passe ! ✨",
        sylvie: "Ta roue du cycle t'aidera à mieux comprendre, ma chérie.",
        christine: "La roue du cycle vous révélera des insights précieux."
      },
      notebook: {
        emma: "N'hésite pas à noter ça dans ton carnet, c'est important ! 📝",
        laure: "Notez cette observation dans votre carnet pour suivre l'évolution.",
        clara: "Capture ce moment dans ton carnet, c'est de l'or ! ✍️",
        sylvie: "Ton carnet t'attend pour accueillir ces précieuses pensées.",
        christine: "Votre carnet saura garder trace de cette sagesse."
      }
    };
    
    return suggestions[target]?.[persona] || '';
  }

  detectConversationEnd(response) {
    const endIndicators = [
      'bonne journée',
      'à bientôt',
      'prends soin de toi',
      'au revoir',
      'belle journée'
    ];
    
    const responseLower = response.toLowerCase();
    return endIndicators.some(indicator => responseLower.includes(indicator));
  }

  // === MÉTHODES DE DEBUG ===
  
  debugTokenUsage(contextData) {
    const prompt = this.buildContextualPrompt(contextData);
    const estimatedTokens = Math.ceil(prompt.length / 4);
    
    return {
      promptLength: prompt.length,
      estimatedTokens,
      isOverLimit: estimatedTokens > 1500,
      recommendation: estimatedTokens > 1500 ? 'Réduire insights ou historique' : 'OK'
    };
  }

  // === MÉTHODES COMPATIBILITÉ ANCIENS TESTS ===

  /**
   * Debug système adaptatif - Compatible avec test-adaptive-system.js
   */
  debugAdaptiveSystem(contextData) {
    const messageAnalysis = this.analyzeMessage(contextData.message || '', contextData.conversationHistory || []);
    const mirroringRules = this.calculateMirroring(contextData.message || '', contextData.conversationHistory || []);
    
    return {
      analysis: {
        messageStyle: mirroringRules.style,
        conversationStage: contextData.conversationHistory?.length > 2 ? 'established' : 'early',
        urgencyLevel: messageAnalysis.emotion.intensity > 0.7 ? 'high' : 'low'
      },
      adaptiveRules: {
        wordCount: `${mirroringRules.minWords}-${mirroringRules.maxWords} mots`,
        focus: mirroringRules.style,
        priority: mirroringRules.priority || 'standard'
      }
    };
  }

  /**
   * Validation contexte - Compatible avec test-adaptive-system.js
   */
  validateContext(contextData) {
    const errors = [];
    
    if (!contextData) {
      errors.push('Contexte manquant');
      return errors;
    }
    
    // Validation persona
    const validPersonas = ['emma', 'laure', 'clara', 'sylvie', 'christine'];
    if (contextData.persona && !validPersonas.includes(contextData.persona)) {
      errors.push('Persona invalide');
    }
    
    // Validation message
    if (contextData.message !== undefined && typeof contextData.message !== 'string') {
      errors.push('Message doit être une string');
    }
    
    // Validation historique
    if (contextData.conversationHistory && !Array.isArray(contextData.conversationHistory)) {
      errors.push('Historique doit être un array');
    }
    
    // Validation phase
    const validPhases = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
    if (contextData.currentPhase && !validPhases.includes(contextData.currentPhase)) {
      errors.push('Phase invalide');
    }
    
    return errors;
  }

  /**
   * Analyse style message utilisateur - Compatible avec test-enhanced-mirroring.js
   */
  analyzeUserMessageStyle(message, conversationHistory = []) {
    const messageLength = message.split(' ').length;
    const avgLength = this.getAverageUserMessageLength(conversationHistory);
    
    // Classification style
    let style;
    if (avgLength < 10) style = 'ultra_concise';
    else if (avgLength < 20) style = 'concise';
    else if (avgLength < 40) style = 'balanced';
    else style = 'detailed';
    
    // Pour les messages très longs, style spécial
    if (messageLength > 50) style = 'very_detailed';
    
    // Retourner directement le style pour compatibilité test
    return style;
  }

  /**
   * Version compacte du prompt - Compatible avec test-enhanced-mirroring.js
   */
  buildCompactPrompt(contextData) {
    const persona = contextData.persona || 'emma';
    const phase = contextData.currentPhase || 'menstrual';
    const message = contextData.message || '';
    
    const personaTrait = this.personaTraits[persona];
    const phaseBehavior = this.phases[phase]?.melune || this.getDefaultPhaseBehavior();
    
    return `Tu es Melune (${personaTrait?.style}). Phase ${phase}: ${phaseBehavior.tone}. 
Message: "${message}". Réponds naturellement selon ta persona.`;
  }

  /**
   * Méthodes supplémentaires pour test-enhanced-mirroring.js
   */
  getConversationStage(conversationHistory) {
    if (!conversationHistory || conversationHistory.length === 0) return 'first_contact';
    if (conversationHistory.length === 1) return 'early';
    if (conversationHistory.length <= 3) return 'developing';
    return 'established';
  }

  detectUrgency(message) {
    const urgentKeywords = ['urgent', 'aide', 'douleur', 'insupportable', 'panique', 'mal !!!'];
    const messageLower = message.toLowerCase();
    
    if (urgentKeywords.some(keyword => messageLower.includes(keyword))) return 'high';
    if (message.includes('!') || message.includes('😭')) return 'medium';
    return 'low';
  }

  shouldOverrideLength(message, conversationHistory, urgencyLevel, messageStyle) {
    // Première interaction - toujours override pour accueil
    if (conversationHistory.length === 0) {
      return { override: true, reason: 'première interaction - accueil chaleureux' };
    }

    // Urgence élevée
    if (urgencyLevel === 'high') {
      return { override: true, reason: 'urgence émotionnelle détectée' };
    }

    // Demande d'explication
    if (message.toLowerCase().includes('explique') || message.toLowerCase().includes('comment')) {
      return { override: true, reason: 'demande d\'explication nécessite développement' };
    }

    // Questions santé
    if (message.toLowerCase().includes('douleur') || message.toLowerCase().includes('symptôme')) {
      return { override: true, reason: 'question santé nécessite réponse complète' };
    }

    return { override: false, reason: 'mirroring standard' };
  }

  getAdaptiveResponseRules(persona, messageStyle, conversationStage, urgencyLevel, message, conversationHistory) {
    const baseRules = this.calculateMirroring(message, conversationHistory);
    const override = this.shouldOverrideLength(message, conversationHistory, urgencyLevel, messageStyle);
    
    let wordCount = `${baseRules.minWords}-${baseRules.maxWords}`;
    let mirrorRatio = 1.0;

    // Calcul ratio mirroring
    const messageLength = message.split(' ').length;
    if (messageLength > 0) {
      mirrorRatio = Math.min(2.0, Math.max(0.5, messageLength / 20));
    }

    // Override si nécessaire
    if (override.override) {
      if (urgencyLevel === 'high') {
        wordCount = '40-80';
      } else if (message.toLowerCase().includes('explique')) {
        wordCount = '60-120';
      } else if (conversationStage === 'first_contact') {
        wordCount = '30-60';
      }
    }

    return {
      wordCount,
      style: baseRules.style,
      mirrorRatio,
      override: override.override,
      reason: override.reason,
      urgencyPriority: urgencyLevel === 'high' ? 'validation émotionnelle' : null
    };
  }
}

module.exports = PromptBuilder;