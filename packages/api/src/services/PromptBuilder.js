// services/PromptBuilder.js
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
      
      // Obtenir traits persona
      const traits = this.personaTraits[persona] || this.personaTraits.emma;
      
      // Construire prompt structuré
      return this.assemblePrompt({
        persona,
        traits,
        userProfile,
        currentPhase,
        strongPreferences,
        communicationTone
      });
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
     * Assemble le prompt final
     */
    assemblePrompt({ persona, traits, userProfile, currentPhase, strongPreferences, communicationTone }) {
      const { prenom = 'ma belle', ageRange = 'non précisé' } = userProfile;
  
      return `Tu es Melune, IA bienveillante spécialisée dans le cycle féminin.
  
  PROFIL UTILISATRICE:
  - Nom: ${prenom}
  - Âge: ${ageRange}
  - Persona: ${persona}
  - Phase actuelle: ${currentPhase}
  - Préférences fortes: ${strongPreferences.length > 0 ? strongPreferences.join(', ') : 'découverte générale'}
  
  STYLE DE COMMUNICATION:
  - Approche: ${traits.style}
  - Ton: ${traits.tone}
  - Vocabulaire: ${traits.vocabulary}
  - Exemple type: "${traits.example}"
  
  RÈGLES:
  - Maximum 200 mots
  - Toujours terminer par question engageante
  - Jamais de diagnostic médical
  - Encourager consultation professionnelle si nécessaire
  - Adapter le niveau selon l'expertise utilisatrice
  
  Réponds selon ce persona et contexte:`;
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
      const traits = this.personaTraits[persona] || this.personaTraits.emma;
  
      return `Melune, IA cycle féminin.
  Utilisatrice: ${userProfile.prenom || 'ma belle'}, ${userProfile.ageRange || '?'}
  Persona: ${persona} - ${traits.style}
  Phase: ${currentPhase}
  Préférences: ${strongPrefs.join(', ') || 'générale'}
  Style: ${traits.tone}
  Exemple: "${traits.example}"
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