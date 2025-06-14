# 🌸 Système d'Insights Personnalisés MoodCycle

## Vue d'ensemble

Le système d'insights personnalisés de MoodCycle génère des messages contextuels adaptés à chaque utilisatrice selon sa phase de cycle, sa persona assignée, ses préférences et son journey personnel.

## 📋 Architecture des Fichiers

### `insights-personalized-v2.js` - Moteur Principal
- **Fonction principale** : `getPersonalizedInsightV2()`
- **Enrichissement contextuel** : `enrichInsightWithContext()`
- **Scoring de pertinence** : `calculateInsightRelevance()`
- **Gestion anti-répétition** avec reset automatique à 80%

### `insights.json` - Base de Données d'Insights
- **Structure** : `{ phase: [insights...] }`
- **Variants par persona** : `personaVariants: { emma: "texte", laure: "texte", ... }`
- **Ciblage** : `targetPersonas`, `targetPreferences`, `tone`
- **Qualité** : `mirandaApproval` (1-5), `status: "enriched"`

### `persona-closings.js` - Closings Personnalisés
- **Structure** : `persona → journey → closing`
- **Mapping** : `body`, `nature`, `emotions`
- **Fonction** : `getPersonalizedClosing(persona, journeyChoice)`

### `phases.json` - Enrichissements Contextuels
- **Phases** : `menstrual`, `follicular`, `ovulatory`, `luteal`
- **Enrichissements** : `contextualEnrichments[]` par phase
- **Ciblage** : `targetPersona`, `targetJourney`, `targetPreferences`

## 🎯 Formule d'Insight Final

```
INSIGHT FINAL = contextualText + ", " + prénom + " " + insightCleanedContent + " " + personalizedClosing
```

### Exemple complet :
```
"Ce moment sacré où ton corps te reconnecte à ton essence profonde, Emma tes crampes te parlent aujourd'hui ! Ton corps fait un travail incroyable. Je t'accompagne dans cette reconnexion avec ton corps"
```

**Décomposition :**
- `contextualText` : "Ce moment sacré où ton corps te reconnecte à ton essence profonde"
- `prénom` : "Emma"
- `insightContent` : "tes crampes te parlent aujourd'hui ! Ton corps fait un travail incroyable."
- `personalizedClosing` : "Je t'accompagne dans cette reconnexion avec ton corps"

## 🔄 Flux de Génération

### 1. Filtrage Initial
```javascript
// Filtre par phase
const phaseInsights = insights[phase];

// Filtre par tone (optionnel)
if (meluneConfig.communicationTone) {
  availableInsights = phaseInsights.filter(insight => 
    insight.tone === meluneConfig.communicationTone
  );
}
```

### 2. Anti-Répétition
```javascript
// Exclure insights déjà vus  
let unusedInsights = availableInsights.filter(
  insight => !usedInsights.includes(insight.id)
);

// Reset auto à 80%
if (seenPercentage >= 0.8) {
  unusedInsights = availableInsights; // Reset complet
}
```

### 3. Scoring de Pertinence
```javascript
let score = 0;

// BONUS PERSONA (priorité max)
if (insight.targetPersonas?.includes(persona)) {
  score += 100;
}

// BONUS PRÉFÉRENCES fortes (>=4)
score += matchingPrefs * 10;

// BONUS QUALITÉ
score += (insight.mirandaApproval || 3) * 5;

// BONUS STATUT ENRICHI
if (insight.status === 'enriched') {
  score += 20;
}
```

### 4. Sélection du Contenu
```javascript
// 1. Variant persona (priorité)
if (insight.personaVariants?.[persona]) {
  baseVariant = insight.personaVariants[persona];
}
// 2. Fallback baseContent
else if (insight.baseContent) {
  baseVariant = insight.baseContent;
}
// 3. Fallback content (ancien format)
else if (insight.content) {
  baseVariant = insight.content;
}
```

### 5. Enrichissement Contextuel
```javascript
// Sélection enrichissement optimal
const candidateEnrichments = phaseData.contextualEnrichments.filter(
  enrichment => enrichment.targetPersona === assignedPersona
);

// Scoring contextuel
let contextScore = 50;
contextScore += matchingPrefs * 25;    // Bonus préférences
contextScore += journeyMatch * 30;     // Bonus journey
contextScore += toneMatch * 20;        // Bonus tone
```

### 6. Construction Finale
```javascript
// Formule complète
if (contextualText && prenom) {
  enrichedMessage = `${contextualText}, ${prenom} ${cleanedInsight}`;
}

// Ajout closing personnalisé
const personalizedClosing = getPersonalizedClosing(assignedPersona, journeyChoice);
if (personalizedClosing) {
  enrichedMessage += ` ${personalizedClosing}`;
}
```

## 👥 Personas Supportées

| Persona | Archetype | Style | Journey Focus |
|---------|-----------|-------|---------------|
| **Emma** | Découvreuse | Amical, encourageant | Exploration |
| **Laure** | Performeuse | Professionnel, optimisé | Efficacité |
| **Sylvie** | Transformatrice | Inspirant, doux | Changement |
| **Christine** | Sage | Profond, spirituel | Sagesse |
| **Clara** | Analytique | Précis, scientifique | Compréhension |

## 🌙 Phases du Cycle

| Phase | Énergie | Mood | Symbol | Durée |
|-------|---------|------|--------|-------|
| **Menstruelle** | Basse | Introspective | 🌙 | J1-5 |
| **Folliculaire** | Croissante | Optimiste | 🌱 | J6-13 |
| **Ovulatoire** | Maximum | Rayonnante | ☀️ | J14-17 |
| **Lutéale** | Décroissante | Intuitive | 🔮 | J18-28 |

## 🎯 Journey Mapping

| Journey Option | Journey Target | Focus |
|----------------|----------------|-------|
| `body` | `body_disconnect` | Reconnexion corporelle |
| `nature` | `hiding_nature` | Acceptation cycles |
| `emotions` | `emotional_control` | Maîtrise émotionnelle |

## 🔧 Utilisation

### Basique
```javascript
import { getPersonalizedInsightV2 } from './insights-personalized-v2.js';

const insight = getPersonalizedInsightV2(
  'menstrual',           // phase
  'emma',               // persona
  { symptoms: 5 },      // préférences utilisateur
  { communicationTone: 'friendly' }, // config melune
  ['M_symptoms_01'],    // insights déjà vus
  onboardingStore       // store d'onboarding (optionnel)
);
```

### Avec Enrichissement Contextuel
```javascript
const onboardingStore = {
  userInfo: { prenom: 'Emma' },
  persona: { assigned: 'emma' },
  preferences: { symptoms: 5, phases: 4 },
  journeyChoice: { selectedOption: 'body' },
  melune: { communicationTone: 'friendly' }
};

const enrichedInsight = getPersonalizedInsightV2(
  'menstrual', 'emma', null, meluneConfig, [], onboardingStore
);
```

## 📊 Données de Retour

```javascript
{
  content: "Message final enrichi",
  id: "M_symptoms_friendly_01",
  persona: "emma",
  relevanceScore: 145,
  resetNeeded: false,
  source: "persona-system-v2-enriched",
  debug: {
    totalAvailable: 12,
    unusedCount: 8,
    seenPercentage: 33,
    selectedScore: 145,
    hasPersonaVariant: true,
    targetPersonas: ['emma', 'laure'],
    isEnriched: true,
    prenom: 'Emma'
  }
}
```

## 🚀 Fonctionnalités Avancées

### Anti-Répétition Intelligente
- Tracking des insights vus par utilisatrice
- Reset automatique à 80% de saturation
- Garantit la variété sur le long terme

### Scoring Multi-Critères
- **Persona Match** : 100 points (priorité absolue)
- **Préférences Fortes** : 10 points par match
- **Qualité Miranda** : 5 points par niveau
- **Statut Enrichi** : 20 points bonus

### Enrichissement Contextuel
- Texte d'ouverture personnalisé selon persona/journey
- Intégration du prénom utilisatrice
- Closing personnalisé selon parcours

### Fallbacks Robustes
- Messages de secours par phase
- Gestion des données manquantes
- Expérience utilisateur toujours fluide

## 🔍 Debug & Monitoring

### Fonctions Utilitaires
```javascript
// Stats par phase/persona
getInsightStats(phase, persona);

// Test enrichissement  
testContextualEnrichment(phase, persona, mockStore);

// Liste tous les closings
getAllClosings();
```

### Logs de Debug
- Resets automatiques
- Scores de pertinence
- Sélections contextuelles
- Erreurs d'enrichissement

---

**Dernière mise à jour** : 09/06/2025  
**Version** : insights-personalized-v2  
**Auteur** : Équipe MoodCycle 🌸 