# Architecture Actuelle - MoodCycle

> **État au 09/06/2025** - Système de personas 100% opérationnel

## 🏗️ **Stack Technologique Actuelle**

### Implémenté et Fonctionnel ✅
- **Framework** : React Native + Expo Router
- **State Management** : Zustand (4 stores) + persistence AsyncStorage
- **Personnalisation** : Système 5 personas + algorithme mapping
- **Insights** : 400+ variants personnalisés (insights-personalized-v2.js)
- **Debug** : Interfaces complètes /debug/persona et /debug/insights-v2
- **Architecture** : 100% offline-first

### Structure Réelle du Projet
```
MoodCycle/
├── stores/                     # Zustand stores (State management)
│   ├── useOnboardingStore.js  # Système personas + onboarding ✅
│   ├── useCycleStore.js       # Données cycle + calculs ✅
│   ├── useChatStore.js        # Chat conversations ✅
│   └── useAppStore.js         # État global ✅
├── utils/
│   └── personaCalculator.js   # Algorithme mapping personas ✅
├── data/
│   ├── insights.json          # Base insights + variants ✅
│   ├── insights-personalized-v2.js # Moteur sélection ✅
│   └── phases.json            # Données phases cycle ✅
├── android/config/
│   └── personaProfiles.js     # Configuration 5 personas ✅
├── components/DevNavigation/
│   ├── PersonaDebug.jsx       # Debug interface personas ✅
│   └── InsightsV2Debug.jsx    # Debug interface insights ✅
└── app/onboarding/            # 10 écrans conversationnels ✅
    ├── 100-promesse.jsx       # Promesse confidentialité
    ├── 200-rencontre.jsx      # Première rencontre Melune
    ├── 300-confiance.jsx      # Établir confiance
    ├── 375-age.jsx            # Sélection âge (5 tranches)
    ├── 400-cycle.jsx          # Conversation cycle
    ├── 500-preferences.jsx    # Préférences (6 dimensions)
    ├── 550-prenom.jsx         # Collecte prénom
    ├── 600-avatar.jsx         # Personnalisation Melune
    ├── 700-paywall.jsx        # Présentation abonnement
    └── 800-cadeau.jsx         # Finalisation + persona
```

## 🎭 **Système de Personas (Opérationnel)**

### 5 Profils Validés
- **Emma** (18-25) : Découverte, apprentissage, bienveillance
- **Laure** (26-40) : Optimisation, efficacité, pratique  
- **Sylvie** (41-55) : Transition, renaissance, sagesse
- **Christine** (55+) : Spiritualité, ancrage, transmission
- **Clara** (26-35) : Science, data, personnalisation

### Algorithme de Mapping
```javascript
// utils/personaCalculator.js - OPÉRATIONNEL
calculatePersonaScores({
  journeyChoice,    // 25% du score final
  ageRange,        // 15% du score final  
  preferences,     // 40% du score final
  communication    // 20% du score final
})
```

### Insights Personnalisés V2
- **80 insights de base** validés par thérapeute
- **5 variants par insight** = 400 contenus personnalisés
- **Anti-répétition intelligent** évite les doublons
- **Scoring avancé** : Persona +100, Préférences +10, Qualité +5

## 🔄 **Flux de Données (100% Local)**

### Onboarding → Persona
1. **10 écrans conversationnels** collectent les données
2. **Algorithme calcule scores** pour les 5 personas
3. **Persona assigné** (score max) + sauvegarde AsyncStorage
4. **Transition vers app** avec personnalisation active

### Usage Quotidien
1. **Lecture persona** depuis store Zustand
2. **Sélection insight** via insights-personalized-v2.js
3. **Affichage personnalisé** selon profil utilisateur
4. **Tout en local** - aucune API externe requise

## 🧪 **Outils de Debug (Fonctionnels)**

### Routes de Debug
- `/debug/persona` - PersonaDebug.jsx
- `/debug/insights-v2` - InsightsV2Debug.jsx

### Fonctionnalités Debug
- **Visualisation scores** personas en temps réel
- **Test sélection insights** avec simulation
- **Statistiques usage** et répartition
- **Boutons 🎭 et 🧪** dans DevNavigation

## 📊 **Métriques de Qualité**

### Performance
- ✅ **100% offline** - fonctionne sans connexion
- ✅ **Persistance robuste** - AsyncStorage + Zustand
- ✅ **Calculs instantanés** - algorithmes locaux optimisés

### Qualité Insights
- ✅ **400 variants** personnalisés disponibles
- ✅ **Anti-répétition** évite content fatigue
- ✅ **Validation thérapeute** sur contenu de base

### Debug & Monitoring
- ✅ **Interfaces complètes** pour développement
- ✅ **Logs détaillés** pour troubleshooting
- ✅ **Tests automatiques** via scripts/

## 🎯 **Prochaines Étapes Techniques**

Voir `docs/Architecture/ROADMAP.md` pour l'architecture future planifiée.

---

**Architecture stable et opérationnelle** - Prête pour les fonctionnalités avancées. 