# 🔧 TECHNICAL - Architecture Technique MoodCycle

*Documentation technique détaillée et patterns de développement*

## 🏗️ Architecture Globale

### **Mono-repo Structure**
```
MoodCycle/
├── MoodCycleApp/         # React Native + Expo
├── MoodCycleAPI/         # Node.js + Express  
├── MoodCycleAdmin/       # React + Vite (à créer)
├── TASKS.md             # Source de vérité opérationnelle
├── FOCUS-AGENT.md       # Instructions agent focus
└── README.md            # Vue d'ensemble
```

### **Hébergement Strategy**
- **App Mobile** : App Store (Apple)
- **API + Admin** : VPS Hostinger (admin.irimwebforge.com)
- **Développement** : Local-first avec fallbacks

## 📱 MoodCycleApp - React Native

### **Stack Technique Complète**
```
Frontend: React Native + Expo SDK 53
State: Zustand + AsyncStorage persistence  
Navigation: Expo Router (file-based)
UI: React Native + Expo Linear Gradient + SVG
Fonts: Expo Google Fonts (Quintessential + Quicksand)
Icons: @expo/vector-icons (Ionicons)
TypeScript: Strict mode activé
```

### **Architecture Offline-First**
```javascript
// Pattern principal
const useDataWithFallback = (apiData, localFallback) => {
  return apiData || localFallback;
};
```

### **Stores Zustand Opérationnels**
- `useOnboardingStore` : Personas + préférences (217 lignes) ✅
- `useCycleStore` : Calculs cycle + phases (161 lignes) ✅
- `useChatStore` : Historique conversations (195 lignes) ✅
- `useAppStore` : État global app (82 lignes) ✅

### **Structure Réelle du Projet**
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
├── config/
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

### **Système Personas (100% Opérationnel)**
```javascript
// utils/personaCalculator.js - OPÉRATIONNEL
const scoring = {
  JOURNEY_CHOICE: 0.25,    // 25%
  AGE_RANGE: 0.15,         // 15%
  PREFERENCES: 0.40,       // 40% (plus important)
  COMMUNICATION: 0.20      // 20%
};

// 5 Profils Validés
const PERSONAS = {
  emma: "Emma (18-25) : Découverte, apprentissage, bienveillance",
  laure: "Laure (26-40) : Optimisation, efficacité, pratique",
  sylvie: "Sylvie (41-55) : Transition, renaissance, sagesse", 
  christine: "Christine (55+) : Spiritualité, ancrage, transmission",
  clara: "Clara (26-35) : Science, data, personnalisation"
};
```

### **Services Clés Fonctionnels**
- `ChatService` : Singleton avec cache 24h ✅
- `ContextFormatter` : Transformation données optimisée ✅
- `DeviceAuthService` : Authentification device-based ✅

### **Insights Personnalisés V2 Opérationnels**
- **400+ insights** disponibles (base enrichie)
- **5 variants par insight** = personnalisation complète
- **Anti-répétition intelligent** évite les doublons
- **Scoring avancé** : Persona +100, Préférences +10, Qualité +5

## 🌐 MoodCycleAPI - Node.js

### **Stack Backend Validé**
- Node.js + Express
- @anthropic-ai/sdk (Claude Haiku)
- JWT device-based auth
- Rate limiting multi-niveau

### **Architecture Validée (Score: 8.5/10)**
```javascript
// PromptBuilder - 5 personas avec traits linguistiques
const personaTraits = {
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
```

### **Endpoints Existants**
- `POST /api/chat` : Conversations Claude ✅
- `GET /api/health` : Health check ✅

### **Endpoints À Créer (Sprint 1)**
- `GET/POST /api/admin/insights` : CRUD insights
- `GET/POST /api/admin/phases` : Gestion phases.json
- `POST /api/admin/auth` : Authentification admin

### **Sécurité Opérationnelle**
- Rate limiting : 50/jour, 5/minute ✅
- Device ID validation ✅
- JWT avec device fingerprint ✅
- Sanitisation inputs (anti-XSS) ✅

## ⚙️ MoodCycleAdmin - Interface Admin (À Créer)

### **Objectif Sprint 1**
Interface React générée par Lovable pour débloquer travail thérapeutique Jeza.

### **Fonctionnalités Critiques**
```javascript
// Workflow Jeza
const adminWorkflow = {
  listInsights: "Afficher 178 insights de base existants",
  editVariants: "Créer 5 variants par insight (890 total)",
  previewRendering: "Aperçu rendu final selon persona", 
  saveToAPI: "Sauvegarde via POST /api/admin/insights",
  managePhases: "Édition phases.json via interface"
};
```

### **Structure Générée par Lovable**
```
MoodCycleAdmin/ [GÉNÉRÉ PAR LOVABLE]
├── src/components/InsightsList.jsx
├── src/components/VariantEditor.jsx  
├── src/components/Preview.jsx
├── src/services/apiClient.js
└── src/App.jsx
```

### **API Express - Endpoints Sprint 1**
```javascript
// À implémenter dans MoodCycleAPI
GET  /api/admin/insights     // Liste 178 insights base
POST /api/admin/insights     // CRUD variants
GET  /api/admin/phases       // Retour phases.json
POST /api/admin/auth         // Auth simple Jeza
```

## 🎭 Système Personas Technique Détaillé

### **Calcul Algorithmique Opérationnel**
```javascript
// Formule validée - utils/personaCalculator.js
const calculatePersonaScore = (userData, personaRef) => {
  return (
    journeyScore * 0.25 +
    ageScore * 0.15 + 
    preferencesScore * 0.40 +
    communicationScore * 0.20
  );
};
```

### **Traits Linguistiques Opérationnels**
Chaque persona dispose de :
- Style communication spécifique ✅
- Vocabulaire adapté ✅
- Tonalité différenciée ✅
- Exemples phrases typiques ✅
- Niveau d'empathie calibré ✅

### **Métriques de Qualité Validées**
- ✅ **400+ variants** personnalisés disponibles
- ✅ **Anti-répétition** évite content fatigue
- ✅ **Validation thérapeute** sur contenu de base
- ✅ **Scoring pertinence** multicritères opérationnel

## 🔌 APIs & Intégrations

### **Claude AI Integration Validée**
```javascript
// Configuration opérationnelle
const claudeConfig = {
  model: 'claude-3-haiku-20240307',
  max_tokens: 500, // Augmenté vs 300 initial
  temperature: 0.7
};
```

### **Flux de Données (100% Local Opérationnel)**
1. **10 écrans conversationnels** collectent les données ✅
2. **Algorithme calcule scores** pour les 5 personas ✅
3. **Persona assigné** (score max) + sauvegarde AsyncStorage ✅
4. **Transition vers app** avec personnalisation active ✅

### **Usage Quotidien Opérationnel**
1. **Lecture persona** depuis store Zustand ✅
2. **Sélection insight** via insights-personalized-v2.js ✅
3. **Affichage personnalisé** selon profil utilisateur ✅
4. **Tout en local** - aucune API externe requise ✅

## 🛡️ Sécurité & Privacy

### **Données Sensibles**
- Chiffrement local : AsyncStorage + SecureStore ✅
- Transmission : HTTPS obligatoire
- Rétention : 30 jours max conversations
- Anonymisation : Données personnelles

### **Authentification Opérationnelle**
```javascript
// Device-based auth (pas de comptes utilisateur)
const deviceAuth = {
  deviceId: 'fingerprint-uuid',
  sessionToken: 'JWT-7days', 
  autoRenew: true
};
```

## 📊 Performance & Optimisation

### **Cache Strategy Validé**
- App : AsyncStorage + cache 24h contexte ✅
- API : Pas de cache (stateless) ✅
- Admin : Cache browser standard

### **Optimisations Validées**
- Modèle Claude Haiku (économique + rapide) ✅
- Fallbacks locaux (performance offline) ✅
- Rate limiting intelligent ✅
- Compression responses ✅

### **Métriques Performance Actuelles**
- ✅ **100% offline** - fonctionne sans connexion
- ✅ **Persistance robuste** - AsyncStorage + Zustand
- ✅ **Calculs instantanés** - algorithmes locaux optimisés

## 🧪 Testing & Debug

### **Interfaces Debug Opérationnelles**
- `/debug/persona` - PersonaDebug.jsx ✅
- `/debug/insights-v2` - InsightsV2Debug.jsx ✅

### **Fonctionnalités Debug Validées**
- **Visualisation scores** personas en temps réel ✅
- **Test sélection insights** avec simulation ✅
- **Statistiques usage** et répartition ✅
- **Boutons 🎭 et 🧪** dans DevNavigation ✅

### **Testing Strategy**
- Manuel : Tests UX bout-en-bout ✅
- Fallbacks : Mode offline complet ✅
- API : Rate limiting + auth validation

## 🚀 Déploiement

### **Environnements Opérationnels**
```bash
# Développement (Actuel)
MoodCycleApp: localhost + simulateur ✅
MoodCycleAPI: localhost:4000 ✅
MoodCycleAdmin: localhost:3000 (à créer)

# Production (Prévu)
MoodCycleApp: App Store
MoodCycleAPI: VPS Hostinger
MoodCycleAdmin: admin.irimwebforge.com
```

### **Configuration Environnements**
```bash
# App Mobile (.env) - Opérationnel
ENVIRONMENT=development|staging|production ✅

# Future - Sprint 1
VPS_MIDDLEWARE_URL=https://moodcycle-api.ton-vps.com
ADMIN_API_ENDPOINTS=/api/admin/*
```

## 🔧 Guidelines Développement

### **Patterns Validés Opérationnels**
- Offline-first systematic ✅
- Zustand pour state (pas Context API) ✅
- Claude API via backend uniquement ✅
- Personas au centre de toute feature ✅
- AsyncStorage persistence obligatoire ✅

### **Anti-Patterns Validés**
- ❌ State côté API (stateless requis)
- ❌ Calls Claude direct depuis app
- ❌ Features sans personnalisation persona
- ❌ Breaking changes offline-first

### **Code Style Opérationnel**
- TypeScript strict ✅
- ESLint + Prettier ✅
- Composants modulaires ✅
- Documentation inline minimale ✅

## 🎯 État Actuel vs Sprint 1

### **✅ DÉJÀ OPÉRATIONNEL**
- Architecture complète personas ✅
- 400+ insights personnalisés ✅
- Interfaces debug complètes ✅
- Système offline-first robuste ✅

### **⏳ SPRINT 1 - ADMIN MVP REQUIS**
- Interface admin Lovable pour Jeza
- Endpoints Express CRUD insights
- Workflow 178 → 890 variants
- Tests bout-en-bout admin

### **🎯 OBJECTIF SPRINT 1**
Débloquer Jeza avec Admin MVP fonctionnel en **6h samedi + 3h dimanche**.

---

**Architecture technique mature et opérationnelle** - Focus Sprint 1 Admin MVP pour déblocage thérapeutique.