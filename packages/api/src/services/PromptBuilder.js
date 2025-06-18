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
    }
  
    /**
     * Construit prompt contextuel basé sur profil utilisateur + historique
     */
    buildContextualPrompt(contextData) {
      const {
        persona = 'emma',
        userProfile = {},
        currentPhase = 'non définie',
        preferences = {},
        communicationTone = 'friendly',
        conversationHistory = [] // ✅ NOUVEAU - Historique conversation
      } = contextData;

      // Extraire préférences fortes (score >= 4)
      const strongPreferences = this.extractStrongPreferences(preferences);
      
      // Enrichir traits avec données JSON validées
      const enrichedTraits = this.enrichPersonaTraits(persona, currentPhase, strongPreferences);
      
      // ✅ NOUVEAU : Formater historique pour prompt
      const formattedHistory = this.formatConversationHistory(conversationHistory);
      
      // Construire prompt structuré avec historique
      return this.assemblePrompt({
        persona,
        traits: enrichedTraits,
        userProfile,
        currentPhase,
        strongPreferences,
        communicationTone,
        conversationHistory: formattedHistory // ✅ NOUVEAU
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
          // Tronquer si trop long (sécurité tokens)
          const userMsg = exchange.user?.slice(0, 100) || '';
          const meluneMsg = exchange.melune?.slice(0, 150) || '';
          
          return `User: "${userMsg}" → Melune: "${meluneMsg}"`;
        })
        .join('\n');

      console.log('📚 Historique formaté pour prompt:', formatted.length, 'caractères');
      return formatted;
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
     * Assemble le prompt final avec données enrichies + historique
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
     * Version compacte pour économiser tokens + historique
     */
    buildCompactPrompt(contextData) {
      const {
        persona = 'emma',
        userProfile = {},
        currentPhase = 'non définie',
        preferences = {},
        conversationHistory = [] // ✅ NOUVEAU
      } = contextData;

      const strongPrefs = this.extractStrongPreferences(preferences);
      const enrichedTraits = this.enrichPersonaTraits(persona, currentPhase, strongPrefs);
      const formattedHistory = this.formatConversationHistory(conversationHistory);

      // ✅ Prompt ultra-compact avec historique
      const historyText = formattedHistory ? `\nHistorique: ${formattedHistory}` : '';

      return `Melune, IA cycle féminin.
${userProfile.prenom || 'ma belle'} (${userProfile.ageRange || '?'}) - ${persona}
Phase: ${currentPhase} ${enrichedTraits.phaseSymbol} - ${enrichedTraits.phaseArchetype}
Style: ${enrichedTraits.tone}${historyText}
Max 80 mots, question finale, continuité conversation.`;
    }
  
    /**
     * Valide le contexte reçu + historique
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
  }
  
  module.exports = PromptBuilder;