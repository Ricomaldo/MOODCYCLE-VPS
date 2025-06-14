# Spécifications Techniques - MoodCycle

> **Détails d'implémentation** pour développeurs et équipe technique

## 🏗️ **Architecture Détaillée**

### Stack Technique Complète
```
Frontend: React Native + Expo SDK 53
State: Zustand + AsyncStorage persistence  
Navigation: Expo Router (file-based)
UI: React Native + Expo Linear Gradient + SVG
Fonts: Expo Google Fonts (Quintessential + Quicksand)
Icons: @expo/vector-icons (Ionicons)

Future Backend:
- Middleware: Node.js + Express (VPS)
- IA: Claude API via middleware
- Auth/DB: Supabase (optionnel)
- Payments: RevenueCat
```

## 🎭 **Système de Personas - Spécifications**

### Algorithme de Scoring (utils/personaCalculator.js)
```javascript
// Pondération des facteurs
const WEIGHTS = {
  JOURNEY_CHOICE: 0.25,    // 25% - Objectif utilisateur
  AGE_RANGE: 0.15,         // 15% - Tranche d'âge
  PREFERENCES: 0.40,       // 40% - Préférences santé
  COMMUNICATION: 0.20      // 20% - Style communication
};

// Score final = Σ(facteur × poids) avec bonus/malus
finalScore = baseScore + bonuses - penalties + confidence;
```

### Profils de Référence (android/config/personaProfiles.js)
```javascript
export const PERSONA_PROFILES = {
  emma: {
    id: 'emma',
    name: 'Emma',
    ageRange: ['18-25'],
    description: 'Jeune femme en découverte de son cycle',
    preferredJourney: ['decouverte'],
    strongPreferences: ['medical', 'naturopathie'],
    communicationStyle: ['bienveillant', 'educatif'],
    coefficients: {
      journey: 1.0,
      age: 1.2,        // Bonus pour âge correspondant
      preferences: 1.1,
      communication: 1.0
    }
  }
  // ... autres personas
};
```

### Insights Personnalisés V2 (data/insights-personalized-v2.js)
```javascript
// Structure insight avec variants
{
  id: "insight_001",
  phase: "menstrual",
  baseContent: {
    title: "Titre neutre",
    content: "Contenu de base"
  },
  personaVariants: {
    emma: {
      title: "Version Emma (découverte)",
      content: "Langage bienveillant et éducatif",
      tone: "encouraging"
    },
    laure: {
      title: "Version Laure (optimisation)", 
      content: "Conseils pratiques et efficaces",
      tone: "practical"
    }
    // ... autres variants
  },
  targetPersonas: ['emma', 'laure'],
  qualityScore: 85,
  status: 'enriched'
}

// Algorithme sélection
function getPersonalizedInsightV2(userPersona, phase, usedInsights = []) {
  // 1. Filtrer par phase cycle
  // 2. Calculer relevanceScore par insight
  // 3. Éliminer insights déjà utilisés (anti-répétition)
  // 4. Sélectionner meilleur score
  // 5. Retourner variant persona ou fallback
}
```

## 🔄 **Flux de Données - Spécifications**

### Onboarding Data Flow
```javascript
// Collecte progressive dans useOnboardingStore
1. Promesse (100) → userInfo.hasAcceptedPromise
2. Rencontre (200) → userInfo.hasMetMelune  
3. Confiance (300) → userInfo.trustLevel
4. Âge (375) → userInfo.ageRange
5. Cycle (400) → userInfo.cycleKnowledge
6. Préférences (500) → userInfo.preferences (6 dimensions)
7. Prénom (550) → userInfo.firstName
8. Avatar (600) → userInfo.avatarChoice + communication
9. Paywall (700) → userInfo.hasSeenPaywall
10. Cadeau (800) → calculateAndAssignPersona() + router.replace()
```

### Persistence Zustand
```javascript
// Configuration auto-persistence
import { persist } from 'zustand/middleware';

const useOnboardingStore = create(
  persist(
    (set, get) => ({
      // State + actions
    }),
    {
      name: 'moodcycle-onboarding', // AsyncStorage key
      getStorage: () => AsyncStorage,
      partialize: (state) => ({
        // Sélectionner données à persister
        userInfo: state.userInfo,
        persona: state.persona,
        isCompleted: state.isCompleted
      })
    }
  )
);
```

## 🧪 **Interfaces Debug - Spécifications**

### PersonaDebug (/debug/persona)
```javascript
// components/DevNavigation/PersonaDebug.jsx
Features:
- Visualisation persona assigné avec confiance %
- Breakdown scores détaillé par facteur
- Simulation temps réel avec modification paramètres
- Export/import données persona JSON
- Reset persona pour re-test algorithme

UI Elements:
- Radar chart scores personas
- Sliders interactifs paramètres
- Boutons action (reset, export, simulate)
- Logs temps réel algorithme
```

### InsightsV2Debug (/debug/insights-v2)  
```javascript
// components/DevNavigation/InsightsV2Debug.jsx
Features:
- Simulation sélection insight par persona
- Statistiques usage: répartition personas, anti-répétition
- Preview variants insights côte-à-côte
- Tests performance algorithme
- Analytics qualité insights

UI Elements:
- Dropdown persona selection
- Insight card preview
- Stats charts (usage, quality, distribution)
- Performance metrics
- Reset utilisé insights
```

## 📊 **Métriques et Analytics**

### Métriques Locales (AsyncStorage)
```javascript
// Données collectées localement
{
  usage: {
    insightsViewed: number,
    personalizedInsightsCount: number,
    debugUsage: number,
    appOpenCount: number
  },
  persona: {
    assigned: string,
    confidence: number,
    assignedAt: timestamp,
    recalculatedCount: number
  },
  insights: {
    totalShown: number,
    byPersona: { emma: 10, laure: 5, ... },
    repeatedCount: number,
    qualityAverage: number
  }
}
```

### Performance Monitoring
```javascript
// Performance tracking (local)
function trackPerformance(operation, duration) {
  const metrics = {
    operation,
    duration, 
    timestamp: Date.now(),
    persona: currentPersona,
    phase: currentPhase
  };
  
  // Store locally pour debug
  AsyncStorage.setItem(
    `perf_${Date.now()}`, 
    JSON.stringify(metrics)
  );
}
```

## 🔧 **Configuration Développement**

### Variables d'Environnement
```bash
# .env
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_DEBUG_ENABLED=true
EXPO_PUBLIC_PERSONA_DEBUG=true
EXPO_PUBLIC_INSIGHTS_DEBUG=true

# Future phases
EXPO_PUBLIC_VPS_URL=
EXPO_PUBLIC_REVENUECAT_KEY=
EXPO_PUBLIC_SUPABASE_URL=
```

### Scripts Package.json
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android", 
    "ios": "expo start --ios",
    "test": "jest",
    "test:personas": "node scripts/test-migration-v2.js",
    "validate:insights": "node data/test-insights-v2.js",
    "debug:storage": "node scripts/debug-storage.js"
  }
}
```

## 🚀 **Déploiement et Tests**

### Tests Automatisés
```javascript
// scripts/test-migration-v2.js
Tests validés:
✅ Import des modules personas
✅ Structure insights.json valide  
✅ Algorithme scoring fonctionnel
✅ Fallbacks insights opérationnels
✅ Compatibilité V1 maintenue

// data/test-insights-v2.js
Tests insights:
✅ 13 insights mockés disponibles
✅ 5 variants par insight
✅ Structure personaVariants conforme
✅ Sélection par persona fonctionne
✅ Anti-répétition effectif
```

### Build & Distribution
```bash
# Development
expo start --clear
expo start --tunnel  # Pour tests device physique

# Build production
eas build --platform all
eas submit --platform ios
eas submit --platform android

# Future: automated testing
eas build --profile preview  
npx maestro test flows/
```

## 🔐 **Sécurité et Confidentialité**

### Données Locales
- **AsyncStorage** : Chiffrement automatique iOS/Android
- **Pas de données santé sensibles** en clair
- **Persona + préférences** uniquement stockées
- **Conversations futures** : chiffrées avant stockage

### Future API Security
```javascript
// Middleware VPS sécurisé
Headers requis:
- Authorization: Bearer JWT_TOKEN
- Content-Type: application/json
- User-Agent: MoodCycle/1.0
- X-Device-ID: hash_device_unique

Validation:
- Rate limiting 10 req/jour gratuit
- Sanitization inputs
- Modération réponses Claude
- Logs anonymisés
```

## 📋 **Checklist Migration Future**

### Phase 2: API Conversationnelle
- [ ] VPS setup (Hostinger + Node.js)
- [ ] Claude API key + configuration
- [ ] Express routes + middleware
- [ ] Client mobile intégration
- [ ] Tests conversation bout-en-bout
- [ ] Rate limiting + quotas
- [ ] Error handling robuste

### Phase 3: RevenueCat
- [ ] Account RevenueCat + produits
- [ ] SDK integration mobile
- [ ] Paywall 700 écran fonctionnel  
- [ ] In-app purchases test
- [ ] Webhook subscriptions
- [ ] Analytics conversion

### Phase 4: Supabase
- [ ] Projet Supabase + schémas
- [ ] Auth flow (OAuth + Magic Links)
- [ ] Migration AsyncStorage progressive
- [ ] Sync bidirectionnel
- [ ] Realtime subscriptions
- [ ] Edge Functions deployment

---

**Documentation technique complète** - Prête pour implémentation future. 