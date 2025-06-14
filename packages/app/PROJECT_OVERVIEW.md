# Architecture de Navigation - MoodCycle V2

## 🏗️ Structure Générale

L'application utilise **Expo Router** avec une architecture **local-first** (Zustand + AsyncStorage) et un système de **personas intelligent**. L'architecture offline-first garantit un fonctionnement optimal même sans connexion.

### Architecture finale
```
MoodCycle/
├── app/                    # Expo Router (Routes uniquement)
├── stores/                 # Zustand stores (State management local)
├── services/               # API services
├── components/             # Composants UI réutilisables
├── hooks/                  # Custom hooks
├── utils/                  # Utilitaires (personaCalculator, etc.)
├── data/                   # Base d'insights (insights.json, phases.json)
├── android/config/         # Configuration (personaProfiles.js)
└── scripts/                # Scripts de validation et tests
```

### Structure des routes (app/)
```
app/
├── _layout.jsx                  # Layout racine avec SafeAreaProvider + Providers
├── index.jsx                   # Redirection vers /(tabs)/home
├── onboarding/                 # Flux d'onboarding conversationnel avec Melune (10 écrans)
│   ├── _layout.jsx            # Layout Stack pour onboarding
│   ├── 100-promesse.jsx       # Promesse de confidentialité
│   ├── 200-rencontre.jsx      # Première rencontre avec Melune
│   ├── 300-confiance.jsx      # Établir la confiance
│   ├── 375-age.jsx            # Sélection tranche d'âge (5 choix)
│   ├── 400-cycle.jsx          # Conversation sur le cycle
│   ├── 500-preferences.jsx    # Préférences de conseils (6 dimensions)
│   ├── 550-prenom.jsx         # Collecte du prénom
│   ├── 600-avatar.jsx         # Personnalisation de Melune
│   ├── 700-paywall.jsx        # Présentation abonnement
│   └── 800-cadeau.jsx         # Finalisation + assignation persona
└── (tabs)/
    ├── _layout.jsx            # Configuration 4 onglets + icônes
    ├── home/
    │   ├── _layout.jsx        # Layout Stack simple
    │   └── index.jsx          # Insights personnalisés par persona
    ├── cycle/
    │   ├── _layout.jsx        # Layout Stack + routes phases
    │   ├── index.jsx          # CycleWheel + calculs locaux
    │   └── phases/[id].jsx    # Détails phases personnalisés
    ├── chat/
    │   ├── _layout.jsx        # Layout Stack simple
    │   └── index.jsx          # Interface conversationnelle → middleware VPS
    └── notebook/
        ├── _layout.jsx        # Layout Stack simple
        └── index.jsx          # Carnet de sagesse local
```

## 🏪 Architecture Local-First

### Stack technologique
- **State Management** : Zustand + persistence AsyncStorage
- **Calculs locaux** : Algorithme personas + sélection insights
- **Stockage** : AsyncStorage pour toutes les données utilisateur
- **Debug** : Interfaces complètes /debug/persona et /debug/insights-v2

### Stores Zustand (stores/)
```
stores/
├── useUserStore.js         # ⚠️ À créer (prévu)
├── useCycleStore.js        # Données cycle + calculs locaux ✅
├── useChatStore.js         # Historique conversations (local) ✅
├── useOnboardingStore.js   # Système personas + mapping algorithm ✅
└── useAppStore.js          # État global + settings ✅
```

### Services API (services/)
```
services/
├── api/
│   └── client.js            # Configuration API (existant)
├── local/
│   ├── insights.js          # Sélection insights personnalisés
│   ├── cycle-calculator.js  # Calculs cycle menstruel  
│   └── persona-mapping.js   # Algorithme assignation personas
└── storage/
    ├── persistence.js       # AsyncStorage management
    └── cache.js             # Cache local intelligent
```

## 🎭 Système de Personas (implémenté)

### Algorithme de mapping (useOnboardingStore)
```javascript
// Implémenté dans stores/useOnboardingStore.js
calculateAndAssignPersona: () => {
  const { journey, ageRange, preferences, communication } = get().userInfo;
  
  // Utilise utils/personaCalculator.js
  const scores = calculatePersonaScores({
    journeyChoice: journey,
    ageRange,
    preferences,  
    communication
  });
  
  // Assigne persona avec score le plus élevé
  const assignedPersona = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  set(state => ({
    persona: {
      ...state.persona,
      assigned: assignedPersona,
      scores,
      confidence: Math.max(...Object.values(scores))
    }
  }));
}
```

### Configuration personas (android/config/personaProfiles.js)
```javascript
// 5 profils de référence avec coefficients configurables
export const PERSONA_PROFILES = {
  emma: {    // 18-25 ans, découverte
    preferredJourney: ['decouverte'],
    ageRange: ['18-25'],
    strongPreferences: ['medical', 'naturopathie'],
    communication: ['bienveillant', 'educatif']
  },
  laure: {   // 26-40 ans, optimisation
    preferredJourney: ['optimisation'],
    ageRange: ['26-35', '36-45'],
    strongPreferences: ['medical', 'productivite'],
    communication: ['direct', 'pratique']
  },
  // ... etc pour sylvie, christine, clara
};
```

## 🔄 Flux de Données Actuel

### Onboarding → Assignation Persona
1. **Collecte données** : 10 écrans conversationnels Melune
2. **Calcul persona** : Algorithme mapping dans useOnboardingStore + utils/personaCalculator.js
3. **Sauvegarde locale** : Persona + préférences dans AsyncStorage (persistence Zustand)
4. **Transition app** : `router.replace('/(tabs)/home')` avec persona assigné

### Usage Quotidien (100% Local)
1. **Ouverture app** : Lecture persona + phase cycle depuis AsyncStorage
2. **Sélection insight** : data/insights-personalized-v2.js avec algorithme persona + anti-répétition
3. **Affichage personnalisé** : Contenu adapté au profil utilisateur (5 variants par insight)
4. **Debug interfaces** : /debug/persona et /debug/insights-v2 pour monitoring temps réel

### Base d'insights personnalisés (data/)
```
data/
├── insights.json              # Structure avec baseContent + personaVariants
├── insights-personalized-v2.js # Moteur sélection intelligent V2
├── phases.json                # Données phases cycle menstruel
└── test-insights-v2.js        # Script de validation insights
```

## 🧪 Interfaces de Debug (implémentées)

### Routes de debug actives
```javascript
// Accessibles en développement uniquement
/debug/persona      # components/DevNavigation/PersonaDebug.jsx
/debug/insights-v2  # components/DevNavigation/InsightsV2Debug.jsx
```

### PersonaDebug (/debug/persona)
- **Visualisation persona assigné** avec scores détaillés
- **Mapping en temps réel** des préférences → scores
- **Bouton 🎭** dans DevNavigation pour accès rapide
- **Données complètes** : ageRange, preferences, communication, confidence

### InsightsV2Debug (/debug/insights-v2)
- **Test sélection insights** avec persona simulé
- **Statistiques temps réel** : répartition par persona, anti-répétition
- **Bouton 🧪** dans DevNavigation pour accès rapide
- **Simulation complète** du moteur insights-personalized-v2.js

## 🚀 État Actuel vs Futur

### ✅ **Implémenté et Opérationnel**
- **Système personas complet** : 5 profils + algorithme mapping
- **Insights personnalisés V2** : 400+ variants (80 base × 5 personas)
- **Architecture offline-first** : Zustand + AsyncStorage + persistence
- **Onboarding conversationnel** : 10 écrans avec collecte données
- **Interfaces debug complètes** : Monitoring temps réel
- **Anti-répétition intelligent** : Évite doublons insights
- **Calculs locaux cycle** : Phases menstruelles

### 🔮 **Prévu Post-MVP**
- **API conversationnelle** : Intégration Claude pour chat Melune  
- **Supabase optionnel** : Backup cloud + sync multi-appareils
- **RevenueCat** : Système abonnements + paywall
- **Notifications** : Rappels cycle + insights personnalisés

## 📚 **Documentation Architecture**

### Organisation des Documents
- **NAVIGATION_ARCHITECTURE.md** (ce fichier) - Architecture actuelle navigation + systèmes implémentés
- **docs/Architecture/CURRENT.md** - État actuel détaillé du projet (ce qui fonctionne)
- **docs/Architecture/ROADMAP.md** - Architecture future planifiée (middleware VPS, RevenueCat, Supabase)
- **docs/Architecture/SPECIFICATIONS.md** - Spécifications techniques détaillées pour développeurs

### Comment Utiliser cette Documentation
1. **Développement actuel** → Consulter ce fichier + CURRENT.md
2. **Planification future** → ROADMAP.md pour architecture cible
3. **Implémentation détaillée** → SPECIFICATIONS.md pour détails techniques
4. **Historique décisions** → docs/Progress/ pour logs de migration

---

**🎉 Documentation parfaitement organisée !**