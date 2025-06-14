import insights from './insights.json';
import phases from './phases.json';
import { getPersonalizedClosing } from './persona-closings.js';

// 🎯 MAPPING Journey Options vers Journey Targets
const JOURNEY_MAPPING = {
  'body': 'body_disconnect',
  'nature': 'hiding_nature', 
  'emotions': 'emotional_control'
};

// 🎯 FALLBACK pour éviter les erreurs
const getFallbackInsight = (phase, persona = null, prenom = null) => {
  const fallbacks = {
    menstrual: "Prends soin de toi aujourd'hui ✨",
    follicular: "L'énergie revient, profite-en ! 🌱", 
    ovulatory: "Tu rayonnes aujourd'hui ! ☀️",
    luteal: "Écoute ton intuition 🌙"
  };
  
  let baseContent = fallbacks[phase] || "Belle journée à toi ! 💕";
  
  // Format simple avec prénom
  if (prenom) {
    baseContent = `${prenom}, ${baseContent.toLowerCase()}`;
  }
  
  return baseContent;
};

// 🎯 NOUVEAU : Enrichir insight avec contexte niveau onboarding
const enrichInsightWithContext = (baseVariant, onboardingStore, phase) => {
  try {
    // 1. Extraire données depuis onboardingStore
    const prenom = onboardingStore?.userInfo?.prenom;
    const assignedPersona = onboardingStore?.persona?.assigned;
    const preferences = onboardingStore?.preferences || {};
    const journeyChoice = onboardingStore?.journeyChoice?.selectedOption;
    const communicationTone = onboardingStore?.melune?.communicationTone;

    // 2. Sélectionner enrichissement contextuel optimal
    const phaseData = phases[phase];
    if (!phaseData?.contextualEnrichments) {
      // Pas d'enrichissement disponible, utiliser format simple
      return prenom ? `${prenom}, ${baseVariant}` : baseVariant;
    }

    // Filtrer par persona assigné
    let candidateEnrichments = phaseData.contextualEnrichments.filter(
      enrichment => enrichment.targetPersona === assignedPersona
    );

    if (candidateEnrichments.length === 0) {
      return prenom ? `${prenom}, ${baseVariant}` : baseVariant;
    }

    // 3. Scorer les enrichissements contextuels
    const scoredEnrichments = candidateEnrichments.map(enrichment => {
      let score = 50;

      // Bonus préférences élevées (>=4)
      if (enrichment.targetPreferences && preferences) {
        const strongPreferences = Object.entries(preferences)
          .filter(([key, value]) => value >= 4)
          .map(([key]) => key);
        
        const matchingPrefs = enrichment.targetPreferences.filter(pref => 
          strongPreferences.includes(pref)
        ).length;
        
        score += matchingPrefs * 25;
      }

      // Bonus journey matching
      const mappedJourney = JOURNEY_MAPPING[journeyChoice];
      if (enrichment.targetJourney === mappedJourney) {
        score += 30;
      }

      // Bonus tone matching
      if (enrichment.tone === communicationTone) {
        score += 20;
      }

      return { ...enrichment, contextScore: score };
    });

    // Trier par score décroissant et sélectionner le meilleur
    scoredEnrichments.sort((a, b) => b.contextScore - a.contextScore);
    const selectedEnrichment = scoredEnrichments[0];

    // 4. VRAIE FORMULE : contextualText + ", " + prénom + insight + personaClosings
    const contextualText = selectedEnrichment.contextualText;
    const cleanedInsight = cleanContentEmojis(baseVariant);
    
    let enrichedMessage = '';
    
    if (contextualText && prenom) {
      enrichedMessage = `${contextualText}, ${prenom} ${cleanedInsight}`;
    } else if (prenom) {
      enrichedMessage = `${prenom}, ${cleanedInsight}`;
    } else {
      enrichedMessage = cleanedInsight;
    }

    // Ajouter conclusion persona personnalisée selon journey
    const personalizedClosing = getPersonalizedClosing(assignedPersona, journeyChoice);
    if (personalizedClosing) {
      enrichedMessage += ` ${personalizedClosing}`;
    }

    return enrichedMessage;

  } catch (error) {
    console.warn('🚨 Erreur enrichissement contextuel:', error);
    return prenom ? `${prenom}, ${baseVariant}` : baseVariant;
  }
};

// 🎯 FONCTION : Nettoyer les emojis en doublon
const cleanContentEmojis = (content) => {
  if (!content) return content;
  
  // Supprimer emojis contextuels génériques en doublon
  let cleaned = content
    .replace(/💜\s*/, '') // Supprimer coeur violet contextuel
    .replace(/✨\s*✨/g, '✨') // Dédupliquer étoiles
    .replace(/🌸\s*🌸/g, '🌸') // Dédupliquer fleurs
    .replace(/💪\s*💪/g, '💪'); // Dédupliquer muscle
  
  // Nettoyer espaces multiples créés par suppression
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};

// 🎯 Sélectionner le contenu approprié selon persona (MODIFIÉ)
const getContentForPersona = (insight, persona, tone, onboardingStore = null) => {
  let baseVariant = '';

  // 1. Si on a des variants persona et que le persona correspond
  if (insight.personaVariants && insight.personaVariants[persona]) {
    baseVariant = insight.personaVariants[persona];
  }
  // 2. Fallback vers baseContent si disponible
  else if (insight.baseContent) {
    baseVariant = insight.baseContent;
  }
  // 3. Fallback vers content (ancien format)
  else if (insight.content) {
    baseVariant = insight.content;
  }
  // 4. Dernière chance : message générique
  else {
    const prenom = onboardingStore?.userInfo?.prenom;
    return getFallbackInsight(insight.phase, persona, prenom);
  }

  // 🌟 NOUVEAU : Enrichir avec contexte si store disponible
  if (onboardingStore && insight.phase) {
    return enrichInsightWithContext(baseVariant, onboardingStore, insight.phase);
  }

  return baseVariant;
};

// 🎯 Calculer score de pertinence pour un insight
const calculateInsightRelevance = (insight, persona, userPreferences, phase) => {
  let score = 0;
  
  // 1. BONUS PERSONA (priorité maximale)
  if (insight.targetPersonas && insight.targetPersonas.includes(persona)) {
    score += 100; // Score de base élevé pour persona match
  }
  
  // 2. BONUS PRÉFÉRENCES (pour affiner)
  if (insight.targetPreferences && userPreferences) {
    const strongPreferences = Object.entries(userPreferences)
      .filter(([key, value]) => value >= 4)
      .map(([key]) => key);
    
    const matchingPrefs = insight.targetPreferences.filter(pref => 
      strongPreferences.includes(pref)
    ).length;
    
    score += matchingPrefs * 10; // Bonus modéré pour préférences
  }
  
  // 3. BONUS QUALITÉ (mirandaApproval)
  score += (insight.mirandaApproval || 3) * 5;
  
  // 4. BONUS STATUT (insights enrichis préférés)
  if (insight.status === 'enriched') {
    score += 20;
  }
  
  return score;
};

// 🎯 FONCTION PRINCIPALE MODIFIÉE pour supporter enrichissement contextuel
export const getPersonalizedInsightV2 = (phase, persona, userPreferences, meluneConfig, usedInsights = [], onboardingStore = null) => {
  // 🛡️ PROTECTION contre données manquantes
  if (!phase) {
    const prenom = onboardingStore?.userInfo?.prenom;
    return { 
      content: getFallbackInsight(phase, persona, prenom), 
      id: null,
      source: 'fallback-no-phase'
    };
  }

  // 1. Filtrer par phase actuelle
  const phaseInsights = insights[phase];
  if (!phaseInsights || phaseInsights.length === 0) {
    const prenom = onboardingStore?.userInfo?.prenom;
    return { 
      content: getFallbackInsight(phase, persona, prenom), 
      id: null,
      source: 'fallback-no-phase-data'
    };
  }
  
  // 2. 🎯 FILTRAGE par TON (si spécifié)
  let availableInsights = phaseInsights;
  if (meluneConfig && meluneConfig.communicationTone) {
    const toneInsights = phaseInsights.filter(
      insight => insight.tone === meluneConfig.communicationTone
    );
    if (toneInsights.length > 0) {
      availableInsights = toneInsights;
    }
  }
  
  // 3. 🎯 ANTI-RÉPÉTITION : Exclure les insights déjà vus
  let unusedInsights = availableInsights.filter(
    insight => !usedInsights.includes(insight.id)
  );
  
  // 4. 🔄 RESET INTELLIGENT : Si 80% des insights sont vus, tout remettre à zéro
  const totalInsights = availableInsights.length;
  const seenPercentage = totalInsights > 0 
    ? (totalInsights - unusedInsights.length) / totalInsights 
    : 0;
  
  let resetNeeded = false;
  if (seenPercentage >= 0.8 && totalInsights > 0) {
    unusedInsights = availableInsights; // Reset : tous redeviennent disponibles
    resetNeeded = true;
    console.log(`🔄 Reset insights pour phase ${phase} (${Math.round(seenPercentage * 100)}% vus)`);
  }
  
  // 5. 🎯 SCORING et SÉLECTION par pertinence
  if (unusedInsights.length === 0) {
    const prenom = onboardingStore?.userInfo?.prenom;
    return { 
      content: getFallbackInsight(phase, persona, prenom), 
      id: null,
      source: 'fallback-no-insights'
    };
  }
  
  // Calculer scores de pertinence pour chaque insight
  const scoredInsights = unusedInsights.map(insight => ({
    ...insight,
    relevanceScore: calculateInsightRelevance(insight, persona, userPreferences, phase)
  }));
  
  // Trier par score de pertinence décroissant
  scoredInsights.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Sélectionner le meilleur
  const selectedInsight = scoredInsights[0];
  
  if (selectedInsight) {
    const personalizedContent = getContentForPersona(
      selectedInsight, 
      persona, 
      meluneConfig?.communicationTone,
      onboardingStore  // 🌟 NOUVEAU : Passer le store pour enrichissement
    );
    
    return {
      content: personalizedContent,
      id: selectedInsight.id,
      persona: persona,
      relevanceScore: selectedInsight.relevanceScore,
      resetNeeded: resetNeeded,
      source: 'persona-system-v2-enriched', // Nouveau source
      debug: {
        totalAvailable: totalInsights,
        unusedCount: unusedInsights.length,
        seenPercentage: Math.round(seenPercentage * 100),
        selectedScore: selectedInsight.relevanceScore,
        hasPersonaVariant: !!(selectedInsight.personaVariants && selectedInsight.personaVariants[persona]),
        targetPersonas: selectedInsight.targetPersonas,
        isEnriched: !!onboardingStore, // Nouveau : indique si enrichissement appliqué
        prenom: onboardingStore?.userInfo?.prenom || null
      }
    };
  }
  
  const prenom = onboardingStore?.userInfo?.prenom;
  return { 
    content: getFallbackInsight(phase, persona, prenom), 
    id: null,
    source: 'fallback-no-selection'
  };
};

// 🎯 FONCTION UTILITAIRE : Obtenir stats pour debug
export const getInsightStats = (phase, persona) => {
  const phaseInsights = insights[phase] || [];
  
  const personaTargeted = phaseInsights.filter(insight => 
    insight.targetPersonas && insight.targetPersonas.includes(persona)
  ).length;
  
  const hasVariants = phaseInsights.filter(insight => 
    insight.personaVariants && insight.personaVariants[persona]
  ).length;
  
  return {
    total: phaseInsights.length,
    personaTargeted,
    hasVariants,
    enriched: phaseInsights.filter(insight => insight.status === 'enriched').length
  };
};

// 🎯 FONCTION DE MIGRATION : Support de l'ancien format (MODIFIÉE)
export const getPersonalizedInsightCompatible = (phase, userPreferencesOrPersona, meluneConfig, usedInsights = [], onboardingStore = null) => {
  // Détecter si on reçoit un persona (string) ou des préférences (object)
  if (typeof userPreferencesOrPersona === 'string') {
    // Nouveau format avec persona
    return getPersonalizedInsightV2(phase, userPreferencesOrPersona, null, meluneConfig, usedInsights, onboardingStore);
  } else {
    // Ancien format non supporté : lever une erreur explicite
    throw new Error("Ancien système d'insights non supporté. Migration requise.");
    // Ou fallback simple :
    // return { content: 'Migration requise', id: null, source: 'fallback-migration' };
  }
};

// 🌟 EXPORT : Fonction d'enrichissement contextuel pour tests
export { enrichInsightWithContext };

// 🌟 NOUVELLE FONCTION UTILITAIRE : Test enrichissement contextuel
export const testContextualEnrichment = (phase, persona, mockStore = null) => {
  const testStore = mockStore || {
    userInfo: { prenom: 'Anna' },
    persona: { assigned: persona },
    preferences: { symptoms: 5, phases: 4 },
    journeyChoice: { selectedOption: 'body' },
    melune: { communicationTone: 'friendly' }
  };

  const phaseInsights = insights[phase] || [];
  if (phaseInsights.length === 0) return null;

  const testInsight = phaseInsights[0];
  const baseVariant = testInsight.personaVariants?.[persona] || testInsight.baseContent || testInsight.content;
  
  if (!baseVariant) return null;

      return {
      original: baseVariant,
      enriched: enrichInsightWithContext(baseVariant, testStore, phase),
      store: testStore,
      phase: phase
    };
  }; 