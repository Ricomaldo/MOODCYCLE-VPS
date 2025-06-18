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
     * Construit prompt contextuel basé sur profil utilisateur
     */
    buildContextualPrompt(contextData) {
      const {
        persona = 'emma',
        userProfile = {},
        currentPhase = 'non définie',
        preferences = {},
        communicationTone = 'friendly'
      } = contextData;

      // Extraire préférences fortes (score >= 4)
      const strongPreferences = this.extractStrongPreferences(preferences);
      
      // Enrichir traits avec données JSON validées
      const enrichedTraits = this.enrichPersonaTraits(persona, currentPhase, strongPreferences);
      
      // Construire prompt structuré
      return this.assemblePrompt({
        persona,
        traits: enrichedTraits,
        userProfile,
        currentPhase,
        strongPreferences,
        communicationTone
      });
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
          tone: "bienveillante et adaptée",
          tempo: "communication équilibrée",
          vocabulary: "langage accessible et chaleureux",
          focus: "écoute et accompagnement personnalisé",
          avoid: "ton impersonnel ou distant",
          encouragementStyle: "encouragement authentique et respectueux"
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
     * Assemble le prompt final avec données enrichies
     */
        assemblePrompt({ persona, traits, userProfile, currentPhase, strongPreferences, communicationTone }) {
          const { prenom = 'ma belle', ageRange = 'non précisé' } = userProfile;
         
          return `Tu es Melune, IA bienveillante spécialisée dans le cycle féminin.
         
         PROFIL UTILISATRICE:
         - Nom: ${prenom}
         - Âge: ${ageRange}
         - Persona: ${persona}
         - Phase actuelle: ${currentPhase} ${traits.phaseSymbol}
         - Archétype phase: ${traits.phaseArchetype}
         - Préférences fortes: ${strongPreferences.length > 0 ? strongPreferences.join(', ') : 'découverte générale'}
         
         STYLE DE COMMUNICATION:
         - Approche: ${traits.style}
         - Ton: ${traits.tone}
         - Vocabulaire: ${traits.vocabulary}
         - Exemple type: "${traits.example}"
         
         CONTEXTE DE PHASE SPÉCIALISÉ:
         ${traits.phaseContext ? `- Perspective: ${traits.phaseContext}` : ''}
         ${traits.phaseCharacteristics?.emotional ? `- État émotionnel typique: ${traits.phaseCharacteristics.emotional.join(', ')}` : ''}
         ${traits.phaseCharacteristics?.energy ? `- Niveau énergétique: ${traits.phaseCharacteristics.energy}` : ''}
         
         MODULATION COMPORTEMENTALE MELUNE:
         - Ton: ${traits.behaviorModulation?.tone || 'bienveillant'}
         - Tempo: ${traits.behaviorModulation?.tempo || 'équilibré'}
         - Vocabulaire privilégié: ${traits.behaviorModulation?.vocabulary || 'accessible'}
         - Focus prioritaire: ${traits.behaviorModulation?.focus || 'accompagnement'}
         - À éviter absolument: ${traits.behaviorModulation?.avoid || 'ton impersonnel'}
         - Style d'encouragement: ${traits.behaviorModulation?.encouragementStyle || 'authentique'}
         
         FORMULES DE CLÔTURE SPÉCIALISÉES:
         - Focus corporel: "${traits.closingStyles?.body || ''}"
         - Focus nature cyclique: "${traits.closingStyles?.nature || ''}"
         - Focus émotionnel: "${traits.closingStyles?.emotions || ''}"
         
         RÈGLES:
         - PRIVILÉGIER réponses courtes (30-80 mots) et spontanées
         - Réponses longues SEULEMENT si explication complexe nécessaire
         - Une idée principale par réponse maximum
         - Toujours terminer par question courte et engageante
         - Ton conversationnel naturel selon phase actuelle
         - Jamais de diagnostic médical
         - Adapter conseils selon phase actuelle
         
         Réponds selon ce persona enrichi et contexte de phase:`;
         }  
    /**
     * Version compacte pour économiser tokens
     */
    buildCompactPrompt(contextData) {
      const {
        persona = 'emma',
        userProfile = {},
        currentPhase = 'non définie',
        preferences = {}
      } = contextData;

      const strongPrefs = this.extractStrongPreferences(preferences);
      const enrichedTraits = this.enrichPersonaTraits(persona, currentPhase, strongPrefs);

      return `Melune, IA cycle féminin.
Utilisatrice: ${userProfile.prenom || 'ma belle'}, ${userProfile.ageRange || '?'}
Persona: ${persona} - ${enrichedTraits.style}
Phase: ${currentPhase} ${enrichedTraits.phaseSymbol}
Archétype: ${enrichedTraits.phaseArchetype}
Préférences: ${strongPrefs.join(', ') || 'générale'}
Style: ${enrichedTraits.tone}
Formule: "${enrichedTraits.closingStyles?.emotions || enrichedTraits.example}"
Max 200 mots, question finale.`;
    }
  
    /**
     * Valide le contexte reçu
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
  
      return errors;
    }
  }
  
  module.exports = PromptBuilder;