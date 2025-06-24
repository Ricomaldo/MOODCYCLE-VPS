// services/PromptBuilder.js
const personaClosings = require('../data/persona-closings.json');
const phases = require('../data/phases.json');

class PromptBuilder {
    constructor() {
      // Traits linguistiques par persona
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

      // ✅ NOUVEAU : Styles adaptatifs par persona
      this.personaAdaptiveStyles = {
        emma: {
          natural_tendency: 'spontaneous', // Naturellement spontanée
          adaptation_sensitivity: 'high',   // S'adapte facilement au style user
          first_contact_style: 'ultra_warm', // Premier contact très chaleureux
          technical_comfort: 'low'          // Évite détails techniques
        },
        laure: {
          natural_tendency: 'efficient',    // Naturellement efficace
          adaptation_sensitivity: 'medium', // Adaptation modérée
          first_contact_style: 'professional_warm', // Pro mais bienveillante
          technical_comfort: 'high'         // À l'aise avec détails
        },
        sylvie: {
          natural_tendency: 'nurturing',    // Naturellement maternelle
          adaptation_sensitivity: 'high',   // Très empathique = s'adapte bien
          first_contact_style: 'gentle',    // Premier contact doux
          technical_comfort: 'medium'       // Équilibre sagesse/info
        },
        christine: {
          natural_tendency: 'wise',         // Naturellement sage
          adaptation_sensitivity: 'low',    // Style plus constant/stable
          first_contact_style: 'serene',    // Premier contact serein
          technical_comfort: 'low'          // Focus spirituel vs technique
        },
        clara: {
          natural_tendency: 'analytical',   // Naturellement analytique
          adaptation_sensitivity: 'medium', // S'adapte mais garde structure
          first_contact_style: 'enthusiastic', // Premier contact enthousiaste
          technical_comfort: 'very_high'    // Adore les détails techniques
        }
      };

      // ✅ NOUVEAU : Mots-clés urgence émotionnelle
      this.urgencyKeywords = {
        high: [
          'urgent', 'aide', 'douleur', 'insupportable', 'angoisse', 'panique', 
          'crise', 'horrible', 'terrible', 'catastrophique', 'désespoir',
          'plus capable', 'bout', 'craquer', 'explosion', 'effondrement'
        ],
        medium: [
          'inquiète', 'préoccupée', 'stressée', 'fatiguée', 'épuisée',
          'difficile', 'compliqué', 'dur', 'pénible', 'chamboulée'
        ],
        indicators: [
          '!!!', '???', 'HELP', 'SOS', '😭', '😰', '😱', '💔', '🆘'
        ]
      };
    }
  
    /**
     * Construit prompt contextuel adaptatif basé sur profil utilisateur + historique
     */
    buildContextualPrompt(contextData) {
      const {
        persona = 'emma',
        userProfile = {},
        currentPhase = 'non définie',
        preferences = {},
        communicationTone = 'friendly',
        conversationHistory = [], // ✅ NOUVEAU - Historique conversation
        message = '' // ✅ NOUVEAU - Message actuel pour analyse
      } = contextData;

      // Extraire préférences fortes (score >= 4)
      const strongPreferences = this.extractStrongPreferences(preferences);
      
      // Enrichir traits avec données JSON validées
      const enrichedTraits = this.enrichPersonaTraits(persona, currentPhase, strongPreferences);
      
      // ✅ NOUVEAU : Analyses adaptatives
      const messageStyle = this.analyzeUserMessageStyle(message, conversationHistory);
      const conversationStage = this.getConversationStage(conversationHistory);
      const urgencyLevel = this.detectUrgency(message);
      const preferredStyle = this.getUserPreferredStyle(userProfile, conversationHistory);
      
      // ✅ NOUVEAU : Calcul règles adaptatives
      const adaptiveRules = this.getAdaptiveResponseRules(
        persona, 
        messageStyle, 
        conversationStage, 
        urgencyLevel
      );
      
      // ✅ NOUVEAU : Formater historique pour prompt
      const formattedHistory = this.formatConversationHistory(conversationHistory);
      
      // Construire prompt adaptatif
      return this.assembleAdaptivePrompt({
        persona,
        traits: enrichedTraits,
        userProfile,
        currentPhase,
        strongPreferences,
        communicationTone,
        conversationHistory: formattedHistory,
        adaptiveRules, // ✅ NOUVEAU
        messageStyle,
        conversationStage,
        urgencyLevel,
        preferredStyle
      });
    }

    /**
     * ✅ NOUVEAU : Formate l'historique pour intégration prompt
     */
    formatConversationHistory(history) {
      if (!Array.isArray(history) || history.length === 0) {
        return null;
      }

      // Limiter tokens - max 3 échanges les plus récents pour sécurité
      const recentHistory = history.slice(0, 3);
      
      // Formater pour lisibilité Claude
      const formatted = recentHistory
        .reverse() // Plus ancien → plus récent
        .map((exchange, index) => {
          // ✅ FIX: Validation défensive avant slice()
          if (!exchange || typeof exchange !== 'object') {
            console.warn('⚠️ Exchange invalide dans formatConversationHistory:', exchange);
            return null;
          }

          // ✅ FIX: Vérifier type avant slice()
          const userMsg = (exchange.user && typeof exchange.user === 'string') 
            ? exchange.user.slice(0, 100) 
            : (exchange.content || ''); // Fallback pour format différent
            
          const meluneMsg = (exchange.melune && typeof exchange.melune === 'string') 
            ? exchange.melune.slice(0, 150) 
            : '';
          
          return userMsg || meluneMsg ? `User: "${userMsg}" → Melune: "${meluneMsg}"` : null;
        })
        .filter(Boolean) // Supprimer les entrées null
        .join('\n');

      console.log('📚 Historique formaté pour prompt:', formatted.length, 'caractères');
      return formatted || null;
    }

    /**
     * ✅ NOUVEAU : Calcule tokens approximatifs pour contrôle
     */
    estimateTokens(text) {
      // Estimation approximative : 4 caractères = 1 token
      return Math.ceil((text || '').length / 4);
    }

    /**
     * Mappe phases françaises vers clés JSON anglaises
     */
    mapPhaseToJsonKey(phase) {
      const phaseMapping = {
        'folliculaire': 'follicular',
        'menstruelle': 'menstrual', 
        'ovulatoire': 'ovulatory',
        'lutéale': 'luteal'
      };
      
      return phaseMapping[phase] || phase;
    }

    /**
     * Extrait modulation comportementale de la section melune
     */
    getBehaviorModulation(currentPhase, mappedPhase) {
      console.log('🎭 getBehaviorModulation called:', { currentPhase, mappedPhase });
      
      const phaseData = phases[mappedPhase];
      if (!phaseData || !phaseData.melune) {
        console.log('⚠️ Pas de données melune trouvées pour phase:', mappedPhase);
        return {
          tone: "compréhensive, validante, apaisante",
          tempo: "communication calme, phrases réconfortantes",
          vocabulary: ["validation", "normalité", "bienveillance", "repos", "acceptation"],
          focus: "validation des difficultés, normalisation des symptômes",
          avoid: ["minimiser les inconforts", "suggestions activités intenses", "ton enjoué excessif"],
          encouragementStyle: "reconnaissance de la force nécessaire pour traverser cette phase"
        };
      }

      const melune = phaseData.melune;
      const behaviorMod = {
        tone: melune.tone || "bienveillante",
        tempo: melune.tempo || "communication équilibrée",
        vocabulary: Array.isArray(melune.vocabulary) ? melune.vocabulary.join(', ') : (melune.vocabulary || "langage accessible"),
        focus: melune.focus || "accompagnement personnalisé",
        avoid: Array.isArray(melune.avoid) ? melune.avoid.join(', ') : (melune.avoid || "ton impersonnel"),
        encouragementStyle: melune.encouragementStyle || "encouragement authentique"
      };

      console.log('🎭 Melune behavior:', behaviorMod);
      return behaviorMod;
    }

    /**
     * Enrichit les traits persona avec données JSON de Jeza
     */
    enrichPersonaTraits(persona, currentPhase, strongPreferences) {
      console.log('🔍 DEBUG enrichPersonaTraits:', { persona, currentPhase, strongPreferences });
      
      // Traits de base
      const baseTraits = this.personaTraits[persona] || this.personaTraits.emma;
      console.log('📝 Base traits:', baseTraits);
      
      // Récupérer formules de politesse depuis persona-closings.json
      const closings = personaClosings[persona] || personaClosings.emma;
      console.log('💬 Closings loaded:', closings);
      
      // FIX: Mapper phase française vers clé JSON anglaise
      const mappedPhase = this.mapPhaseToJsonKey(currentPhase);
      const phaseData = phases[mappedPhase];
      console.log('🌙 Phase mapping:', { currentPhase, mappedPhase, found: !!phaseData });
      
      // Récupérer modulation comportementale Melune
      const behaviorModulation = this.getBehaviorModulation(currentPhase, mappedPhase);
      
      // Trouver enrichissement contextuel spécifique à cette persona/phase
      const contextualText = phaseData?.contextualEnrichments
        ?.find(e => e.targetPersona === persona)?.contextualText || "";
      console.log('✨ Contextual text:', contextualText);
      
      // Traits enrichis
      const enrichedTraits = {
        ...baseTraits,
        // Contexte de phase
        phaseContext: contextualText,
        phaseCharacteristics: phaseData?.characteristics || {},
        phaseSymbol: phaseData?.symbol || "",
        phaseArchetype: phaseData?.archetype || "",
        
        // Modulation comportementale Melune
        behaviorModulation,
        
        // Formules spécialisées par focus
        closingStyles: {
          body: closings.body || "",
          nature: closings.nature || "",
          emotions: closings.emotions || ""
        },
        
        // Conseils contextuels
        phaseAdvice: phaseData?.advice || {},
        phaseAffirmation: phaseData?.affirmation || ""
      };
      
      console.log('🎯 Enriched traits result:', {
        phaseSymbol: enrichedTraits.phaseSymbol,
        phaseArchetype: enrichedTraits.phaseArchetype,
        hasClosingStyles: !!enrichedTraits.closingStyles,
        hasPhaseContext: !!enrichedTraits.phaseContext,
        hasBehaviorModulation: !!enrichedTraits.behaviorModulation
      });
      
      return enrichedTraits;
    }
  
    /**
     * Extrait préférences avec score >= 4
     */
    extractStrongPreferences(preferences) {
      const labels = {
        symptoms: 'symptômes physiques',
        moods: 'gestion émotionnelle',
        phyto: 'remèdes naturels',
        phases: 'énergie cyclique',
        lithotherapy: 'lithothérapie',
        rituals: 'rituels bien-être'
      };
  
      return Object.entries(preferences)
        .filter(([_, value]) => value >= 4)
        .map(([key]) => labels[key])
        .filter(Boolean);
    }
  
    /**
     * ✅ NOUVEAU : Assemble prompt adaptatif intelligent
     */
    assembleAdaptivePrompt({ 
      persona, traits, userProfile, currentPhase, strongPreferences, 
      conversationHistory, adaptiveRules, messageStyle, conversationStage, 
      urgencyLevel, preferredStyle 
    }) {
      const { prenom = 'ma belle', ageRange = 'non précisé' } = userProfile;
      
      // Section historique conditionnelle
      const historySection = conversationHistory ? 
        `\nHISTORIQUE: ${conversationHistory}` : '';

      // Section urgence prioritaire
      const urgencySection = urgencyLevel !== 'low' ? 
        `\n🚨 URGENCE ${urgencyLevel.toUpperCase()}: ${adaptiveRules.priority}` : '';

      // Style utilisatrice détecté
      const styleSection = preferredStyle ? 
        `\nSTYLE USER: ${preferredStyle.style} (confiance: ${Math.round(preferredStyle.confidence * 100)}%)` : 
        `\nSTYLE USER: ${messageStyle} (${conversationStage})`;

      return `Tu es Melune, persona ${persona}.

PROFIL: ${prenom} (${ageRange}) - Phase ${currentPhase} ${traits.phaseSymbol}
Préférences: ${strongPreferences.length > 0 ? strongPreferences.join(', ') : 'découverte'}

ADAPTATION DYNAMIQUE:
- ${adaptiveRules.focus}
- Longueur: ${adaptiveRules.wordCount}
- Instructions: ${adaptiveRules.personaInstructions}${urgencySection}${styleSection}${historySection}

STYLE: ${traits.tone} - ${traits.vocabulary}
PHASE: ${traits.phaseArchetype} - ${traits.behaviorModulation?.focus || 'accompagnement'}

RÈGLES ADAPTATIVES:
- Respecter longueur: ${adaptiveRules.wordCount}
- Focus: ${adaptiveRules.focus}
- Question finale engageante
- Continuité naturelle conversation

Réponds selon adaptation calculée:`;
    }

    /**
     * Assemble le prompt final avec données enrichies + historique (LEGACY)
     */
    assemblePrompt({ persona, traits, userProfile, currentPhase, strongPreferences, communicationTone, conversationHistory }) {
      const { prenom = 'ma belle', ageRange = 'non précisé' } = userProfile;
     
      // ✅ NOUVEAU : Section historique conditionnelle
      const historySection = conversationHistory ? 
        `\nHISTORIQUE CONVERSATION RÉCENTE:\n${conversationHistory}\n` : '';

      // ✅ MODIFIÉ : Prompt plus concis pour économiser tokens avec historique
      return `Tu es Melune, IA cycle féminin.

PROFIL: ${prenom} (${ageRange}) - Persona ${persona} - Phase ${currentPhase} ${traits.phaseSymbol}
Préférences: ${strongPreferences.length > 0 ? strongPreferences.join(', ') : 'découverte'}

STYLE: ${traits.tone} - ${traits.vocabulary}
PHASE: ${traits.phaseArchetype} - ${traits.behaviorModulation?.focus || 'accompagnement'}
Éviter: ${traits.behaviorModulation?.avoid || 'ton impersonnel'}${historySection}
RÈGLES:
- Réponses 30-80 mots (courtes et naturelles)  
- Toujours terminer par question engageante
- Continuité avec historique si présent
- Ton selon phase actuelle: ${traits.behaviorModulation?.tone || 'bienveillant'}

Réponds selon ce persona et contexte:`;
    }  

    /**
     * Version compacte adaptative pour économiser tokens
     */
    buildCompactPrompt(contextData) {
      const {
        persona = 'emma',
        userProfile = {},
        currentPhase = 'non définie',
        preferences = {},
        conversationHistory = [],
        message = ''
      } = contextData;

      const strongPrefs = this.extractStrongPreferences(preferences);
      const enrichedTraits = this.enrichPersonaTraits(persona, currentPhase, strongPrefs);
      const formattedHistory = this.formatConversationHistory(conversationHistory);

      // ✅ NOUVEAU : Analyses adaptatives compactes
      const messageStyle = this.analyzeUserMessageStyle(message, conversationHistory);
      const conversationStage = this.getConversationStage(conversationHistory);
      const urgencyLevel = this.detectUrgency(message);
      const adaptiveRules = this.getAdaptiveResponseRules(persona, messageStyle, conversationStage, urgencyLevel);

      // Sections conditionnelles compactes
      const historyText = formattedHistory ? `\nHist: ${formattedHistory}` : '';
      const urgencyText = urgencyLevel !== 'low' ? `\nURGENCE: ${adaptiveRules.priority}` : '';

      return `Melune ${persona}. ${userProfile.prenom || 'ma belle'} (${userProfile.ageRange || '?'})
Phase: ${currentPhase} ${enrichedTraits.phaseSymbol}
Adapt: ${adaptiveRules.wordCount} - ${adaptiveRules.focus}${urgencyText}${historyText}
Question finale obligatoire.`;
    }
  
    /**
     * Valide le contexte reçu + historique + message
     */
    validateContext(contextData) {
      const errors = [];
  
      if (!contextData) {
        errors.push('Context data manquant');
        return errors;
      }
  
      // Validation persona
      if (contextData.persona && !this.personaTraits[contextData.persona]) {
        errors.push(`Persona invalide: ${contextData.persona}`);
      }
  
      // Validation preferences format
      if (contextData.preferences) {
        const validKeys = ['symptoms', 'moods', 'phyto', 'phases', 'lithotherapy', 'rituals'];
        Object.keys(contextData.preferences).forEach(key => {
          if (!validKeys.includes(key)) {
            errors.push(`Clé préférence invalide: ${key}`);
          }
        });
      }

      // ✅ NOUVEAU : Validation historique format
      if (contextData.conversationHistory) {
        if (!Array.isArray(contextData.conversationHistory)) {
          errors.push('conversationHistory doit être un array');
        } else {
          // Vérifier structure des échanges
          contextData.conversationHistory.forEach((exchange, index) => {
            if (!exchange.user || !exchange.melune) {
              errors.push(`Échange ${index} mal formaté`);
            }
          });
        }
      }

      // ✅ NOUVEAU : Validation message pour analyses adaptatives
      if (contextData.message !== undefined && typeof contextData.message !== 'string') {
        errors.push('Message doit être une string');
      }
  
      return errors;
    }

    /**
     * ✅ NOUVEAU : Debug tokens pour éviter dépassements
     */
    debugTokenUsage(contextData) {
      const prompt = this.buildContextualPrompt(contextData);
      const estimatedTokens = this.estimateTokens(prompt);
      
      const stats = {
        promptLength: prompt.length,
        estimatedTokens,
        historyCount: contextData.conversationHistory?.length || 0,
        isOverLimit: estimatedTokens > 1500, // Sécurité 1500 tokens
        recommendation: estimatedTokens > 1500 ? 'Utiliser buildCompactPrompt' : 'OK'
      };

      console.log('🔍 Token usage debug:', stats);
      return stats;
    }

    /**
     * ✅ NOUVEAU : Debug système adaptatif complet
     */
    debugAdaptiveSystem(contextData) {
      const { message = '', conversationHistory = [], persona = 'emma' } = contextData;
      
      // Analyses
      const messageStyle = this.analyzeUserMessageStyle(message, conversationHistory);
      const conversationStage = this.getConversationStage(conversationHistory);
      const urgencyLevel = this.detectUrgency(message);
      const preferredStyle = this.getUserPreferredStyle(contextData.userProfile, conversationHistory);
      const adaptiveRules = this.getAdaptiveResponseRules(persona, messageStyle, conversationStage, urgencyLevel);
      
      const debug = {
        message: {
          length: message.length,
          content: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        },
        analysis: {
          messageStyle,
          conversationStage,
          urgencyLevel,
          preferredStyle
        },
        adaptiveRules,
        prompt: {
          length: 0,
          tokens: 0
        }
      };

      // Calculer prompt final
      const prompt = this.buildContextualPrompt(contextData);
      debug.prompt.length = prompt.length;
      debug.prompt.tokens = this.estimateTokens(prompt);

      console.log('🔬 Système adaptatif debug:', debug);
      return debug;
    }

    /**
     * ✅ NOUVEAU : Analyse style de communication de l'utilisatrice
     */
    analyzeUserMessageStyle(message, conversationHistory = []) {
      const currentLength = message.trim().length;
      
      // Analyser historique pour détecter pattern de communication
      const userMessages = conversationHistory
        .map(exchange => exchange.user)
        .filter(msg => msg && msg.length > 0);
      
      const avgUserLength = userMessages.length > 0 
        ? userMessages.reduce((sum, msg) => sum + msg.length, 0) / userMessages.length
        : currentLength;

      console.log('📊 Style analysis:', { 
        currentLength, 
        avgUserLength, 
        historicalMessages: userMessages.length 
      });

      // Classification adaptative
      if (avgUserLength <= 20) return 'ultra_concise';  // SMS style
      if (avgUserLength <= 50) return 'concise';        // Messages courts
      if (avgUserLength <= 100) return 'balanced';      // Équilibré  
      if (avgUserLength <= 200) return 'detailed';      // Développé
      return 'very_detailed';                           // Très bavarde
    }

    /**
     * ✅ NOUVEAU : Détecte urgence émotionnelle
     */
    detectUrgency(message) {
      const lowerMsg = message.toLowerCase();
      const hasExclamations = (message.match(/[!]{2,}/g) || []).length > 0;
      const hasQuestions = (message.match(/[?]{2,}/g) || []).length > 0;
      const hasEmojis = this.urgencyKeywords.indicators.some(indicator => 
        message.includes(indicator)
      );

      // Compter mots-clés urgence
      const highUrgencyCount = this.urgencyKeywords.high.filter(keyword => 
        lowerMsg.includes(keyword)
      ).length;
      
      const mediumUrgencyCount = this.urgencyKeywords.medium.filter(keyword => 
        lowerMsg.includes(keyword)  
      ).length;

      // Classification urgence
      if (highUrgencyCount >= 2 || (highUrgencyCount >= 1 && (hasExclamations || hasEmojis))) {
        console.log('🚨 URGENCE HAUTE détectée:', { highUrgencyCount, hasExclamations, hasEmojis });
        return 'high';
      }
      
      if (highUrgencyCount >= 1 || mediumUrgencyCount >= 2 || (mediumUrgencyCount >= 1 && hasQuestions)) {
        console.log('⚠️ Urgence moyenne détectée:', { highUrgencyCount, mediumUrgencyCount });
        return 'medium';
      }

      return 'low';
    }

    /**
     * ✅ NOUVEAU : Détermine étape de conversation
     */
    getConversationStage(conversationHistory) {
      const exchangeCount = conversationHistory.length;
      
      if (exchangeCount === 0) return 'first_contact';
      if (exchangeCount <= 2) return 'ice_breaking';  
      if (exchangeCount <= 5) return 'building_rapport';
      return 'deep_conversation';
    }

    /**
     * ✅ NOUVEAU : Calcule style de réponse adaptatif par persona
     */
    getAdaptiveResponseRules(persona, messageStyle, conversationStage, urgencyLevel) {
      const personaStyle = this.personaAdaptiveStyles[persona] || this.personaAdaptiveStyles.emma;
      
      // URGENCE BYPASS - ignore tout et priorise empathie
      if (urgencyLevel === 'high') {
        return {
          wordCount: '15-40 mots',
          priority: 'empathie immédiate + validation',
          structure: 'reconnaissance urgence → réassurance → question simple',
          tone: 'très chaleureux, protection maternelle'
        };
      }

      if (urgencyLevel === 'medium') {
        return {
          wordCount: '20-50 mots', 
          priority: 'validation émotion + soutien',
          structure: 'empathie → encouragement → question douce',
          tone: 'bienveillant, compréhensif'
        };
      }

      // ADAPTATION NORMALE par étape + persona + style user
      const baseRules = this.getBaseAdaptiveRules(conversationStage, messageStyle);
      
      // Modulation par persona
      return this.modulateByPersona(baseRules, persona, personaStyle);
    }

    /**
     * ✅ NOUVEAU : Règles de base par étape conversation
     */
    getBaseAdaptiveRules(conversationStage, messageStyle) {
      const rules = {
        first_contact: {
          ultra_concise: { words: '8-15', focus: 'accueil spontané + question simple' },
          concise: { words: '12-20', focus: 'bienvenue chaleureuse + découverte' },
          balanced: { words: '15-30', focus: 'présentation douce + mise en confiance' },
          detailed: { words: '20-40', focus: 'accueil développé mais naturel' },
          very_detailed: { words: '25-45', focus: 'répondre au niveau de détail' }
        },
        
        ice_breaking: {
          ultra_concise: { words: '10-20', focus: 'réponse directe + curiosité' },
          concise: { words: '15-30', focus: 'validation + exploration douce' },
          balanced: { words: '20-50', focus: 'empathie + engagement naturel' },
          detailed: { words: '30-70', focus: 'développement si question complexe' },
          very_detailed: { words: '40-80', focus: 'égaler richesse des échanges' }
        },
        
        building_rapport: {
          ultra_concise: { words: '15-35', focus: 'respecter préférence concision' },
          concise: { words: '25-50', focus: 'proportionner aux messages user' },
          balanced: { words: '35-70', focus: 'conversation fluide naturelle' },
          detailed: { words: '50-100', focus: 'suivre rythme développé user' },
          very_detailed: { words: '60-120', focus: 'égaler niveau de partage' }
        },
        
        deep_conversation: {
          ultra_concise: { words: '20-40', focus: 'efficacité respectueuse' },
          concise: { words: '30-60', focus: 'substance avec concision' },
          balanced: { words: '40-80', focus: 'conversation riche équilibrée' },
          detailed: { words: '60-120', focus: 'développements approfondis' },
          very_detailed: { words: '80-150', focus: 'égaler niveau détail user' }
        }
      };

      return rules[conversationStage][messageStyle];
    }

    /**
     * ✅ NOUVEAU : Modulation des règles par persona
     */
    modulateByPersona(baseRules, persona, personaStyle) {
      const modulation = {
        emma: {
          // Spontanée = tend vers + court, + chaleureux
          wordAdjustment: -5,
          focusPrefix: 'spontané et chaleureux:',
          specificInstructions: 'Garder ton grande sœur naturel'
        },
        
        laure: {
          // Efficace = structure claire, info utile
          wordAdjustment: 0,
          focusPrefix: 'structuré et informatif:',
          specificInstructions: 'Donner conseils pratiques pertinents'
        },
        
        sylvie: {
          // Maternelle = peut développer pour réconforter
          wordAdjustment: +10,
          focusPrefix: 'bienveillant et réconfortant:',
          specificInstructions: 'Prendre temps nécessaire pour rassurer'
        },
        
        christine: {
          // Sage = constante, moins adaptative
          wordAdjustment: +5,
          focusPrefix: 'sage et apaisante:',
          specificInstructions: 'Partager sagesse appropriée au moment'
        },
        
        clara: {
          // Analytique = s'adapte mais ajoute structure
          wordAdjustment: +5,
          focusPrefix: 'enthousiaste et structurée:',
          specificInstructions: 'Ajouter insights pertinents si approprié'
        }
      };

      const mod = modulation[persona] || modulation.emma;
      
      // Ajuster nombre de mots
      const [min, max] = baseRules.words.match(/\d+/g).map(Number);
      const adjustedMin = Math.max(5, min + mod.wordAdjustment);
      const adjustedMax = Math.max(adjustedMin + 10, max + mod.wordAdjustment);

      return {
        wordCount: `${adjustedMin}-${adjustedMax} mots`,
        focus: `${mod.focusPrefix} ${baseRules.focus}`,
        personaInstructions: mod.specificInstructions
      };
    }

    /**
     * ✅ NOUVEAU : Sauvegarde/récupère style préféré user
     */
    getUserPreferredStyle(userProfile, conversationHistory) {
      // Pour l'instant, analyser historique actuel
      // TODO: Intégrer avec base de données user preferences
      
      if (conversationHistory.length >= 3) {
        const avgLength = conversationHistory
          .map(ex => ex.user?.length || 0)
          .reduce((sum, len) => sum + len, 0) / conversationHistory.length;
        
        const preferredStyle = {
          communicationLength: avgLength,
          style: this.analyzeUserMessageStyle('', conversationHistory),
          confidence: Math.min(conversationHistory.length / 5, 1) // 0-1
        };

        console.log('💾 Style préféré détecté:', preferredStyle);
        return preferredStyle;
      }

      return null;
    }
  }
  
  module.exports = PromptBuilder;