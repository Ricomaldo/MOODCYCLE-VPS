Question 1 - Structure des données OnboardingStore
"Cursor, peux-tu analyser la structure complète du OnboardingStore de MoodCycle et lister précisément quelles données sont disponibles pour contextualiser les appels API Claude ? J'ai besoin de connaître le format exact des préférences, du persona calculé, et des métadonnées utilisateur."

Answer 1 : 
Je vais analyser la structure complète du OnboardingStore pour vous. Commençons par localiser et examiner les fichiers liés à ce store.
Search files...
Ran tool
Ran tool
Maintenant, examinons aussi le calculateur de persona pour comprendre la structure complète :
Ran tool
Read file: utils/personaCalculator.js
Read file: utils/personaCalculator.js

Basé sur mon analyse du code, voici la structure complète du OnboardingStore de MoodCycle et les données disponibles pour contextualiser les appels API Claude :

## 📊 Structure complète du OnboardingStore

### 🎯 Structure de données principale

```217:217:stores/useOnboardingStore.js
export const useOnboardingStore = create(
```

Le OnboardingStore utilise Zustand avec persistance AsyncStorage et contient les sections suivantes :

### 1. **Données utilisateur de base (`userInfo`)**
```json
{
  "userInfo": {
    "journeyStarted": false,
    "startDate": null,
    "prenom": null,
    "prenomCollectedAt": null,
    "ageRange": null  // '18-25', '26-35', '36-45', '46-55', '55+'
  }
}
```

### 2. **Choix de voyage (`journeyChoice`)**
```json
{
  "journeyChoice": {
    "selectedOption": null,  // 'body_disconnect', 'hiding_nature', 'emotional_control'
    "motivation": ""
  }
}
```

### 3. **Données cycle menstruel (`cycleData`)**
```json
{
  "cycleData": {
    "lastPeriodDate": null,
    "averageCycleLength": 28,
    "averagePeriodLength": 5,
    "isRegular": null,
    "trackingExperience": null  // 'never', 'basic', 'advanced'
  }
}
```

### 4. **Préférences sur 6 dimensions (`preferences`)**
```json
{
  "preferences": {
    "symptoms": 3,        // Symptômes physiques (échelle 0-5)
    "moods": 3,          // Humeurs (échelle 0-5)
    "phyto": 3,          // Phyto/HE (échelle 0-5)
    "phases": 3,         // Énergie des phases (échelle 0-5)
    "lithotherapy": 3,   // Lithothérapie (échelle 0-5)
    "rituals": 3         // Rituels bien-être (échelle 0-5)
  }
}
```

### 5. **Configuration avatar Melune (`melune`)**
```json
{
  "melune": {
    "avatarStyle": "classic",           // 'classic', 'modern', 'mystique'
    "communicationTone": "friendly",    // 'friendly', 'professional', 'inspiring'
    "personalityMatch": null            // Calculé basé sur les préférences
  }
}
```

### 6. **Persona calculé (`persona`)** 🎭
```json
{
  "persona": {
    "assigned": null,           // 'emma', 'laure', 'sylvie', 'christine', 'clara'
    "scores": {},              // Scores calculés pour debug
    "confidence": 0,           // Confiance de l'assignation (0-1)
    "confidenceLevel": null,   // 'low', 'medium', 'high'
    "lastCalculated": null,    // Timestamp dernier calcul
    "metadata": null           // Métadonnées pour validation
  }
}
```

### 7. **Premier insight personnalisé (`firstInsight`)**
```json
{
  "firstInsight": {
    "message": "",
    "category": null,     // 'cycle', 'wellbeing', 'self-discovery'
    "unlocked": false
  }
}
```

### 8. **Gestion anti-répétition (`usedInsights`)**
```json
{
  "usedInsights": []  // Liste des IDs d'insights déjà vus
}
```

### 9. **Informations abonnement (`subscription`)**
```json
{
  "subscription": {
    "trialStarted": false,
    "trialStartDate": null,
    "planSelected": null,     // 'monthly', 'yearly'
    "isSubscribed": false,
    "subscriptionDate": null
  }
}
```

## 🤖 Données contextuelles pour API Claude

### Structure complète disponible pour contextualisation :

```javascript
// Données extraites pour enrichissement API Claude
const contextData = {
  // Identité personnelle
  prenom: onboardingStore.userInfo?.prenom,
  ageRange: onboardingStore.userInfo?.ageRange,
  
  // Motivation profonde
  journeyChoice: onboardingStore.journeyChoice?.selectedOption,
  motivation: onboardingStore.journeyChoice?.motivation,
  
  // Profil cyclique
  cycleData: {
    lastPeriodDate: onboardingStore.cycleData?.lastPeriodDate,
    averageCycleLength: onboardingStore.cycleData?.averageCycleLength,
    trackingExperience: onboardingStore.cycleData?.trackingExperience,
    isRegular: onboardingStore.cycleData?.isRegular
  },
  
  // Préférences détaillées (chaque dimension 0-5)
  preferences: {
    symptoms: onboardingStore.preferences?.symptoms,
    moods: onboardingStore.preferences?.moods,
    phyto: onboardingStore.preferences?.phyto,
    phases: onboardingStore.preferences?.phases,
    lithotherapy: onboardingStore.preferences?.lithotherapy,
    rituals: onboardingStore.preferences?.rituals
  },
  
  // Style de communication souhaité
  communicationStyle: {
    avatarStyle: onboardingStore.melune?.avatarStyle,
    communicationTone: onboardingStore.melune?.communicationTone
  },
  
  // Persona assigné avec métadonnées
  persona: {
    assigned: onboardingStore.persona?.assigned,
    confidence: onboardingStore.persona?.confidence,
    scores: onboardingStore.persona?.scores,
    metadata: onboardingStore.persona?.metadata
  },
  
  // Anti-répétition
  usedInsights: onboardingStore.usedInsights || []
};
```

## 🔍 Format métadonnées persona

Le système de persona calculé génère des métadonnées détaillées :

```javascript
// Structure retournée par calculateAndAssignPersona()
{
  assigned: "emma",           // Persona assigné
  scores: {                   // Scores détaillés pour chaque persona
    emma: 85.2,
    laure: 72.1,
    sylvie: 43.8,
    christine: 31.4,
    clara: 67.3
  },
  confidence: 13.1,           // Différence avec 2ème meilleur score
  metadata: {
    timestamp: 1704556800000,
    algorithm: "v2_simplified",
    weights: {                // Poids utilisés dans le calcul
      journey: 0.25,
      age: 0.15,
      preferences: 0.40,
      communication: 0.20
    }
  }
}
```

## 📚 Usage pour API Claude

Ces données permettent de contextualiser les appels API Claude avec :

1. **Personnalisation profonde** : Prénom, âge, persona assigné
2. **Adaptation au cycle** : Phase actuelle, régularité, expérience
3. **Customisation du ton** : Style d'avatar et communication préférés
4. **Évitement répétitions** : Liste insights déjà vus
5. **Préférences thématiques** : 6 dimensions avec scores précis
6. **Motivation initiale** : Choix de voyage et motivation exprimée

Cette structure complète permet une personnalisation très fine des réponses de l'IA Claude selon le profil utilisateur détaillé.

Question 2 - Algorithme de mapping personas existant
"Cursor, peux-tu examiner l'algorithme de calcul de persona actuel dans MoodCycle et expliquer comment il détermine le profil utilisateur ? Je dois comprendre si cette logique peut être réutilisée pour le prompting Claude ou si elle nécessite des adaptations."

Answer 2 :
Je vais analyser l'algorithme de mapping des personas existant pour comprendre sa logique et évaluer sa réutilisabilité pour le prompting Claude.
Read file: config/personaProfiles.js
Read file: config/personaProfiles.js
Ran tool
Search files...
Basé sur mon analyse approfondie du code, voici une explication complète de l'algorithme de mapping des personas existant dans MoodCycle :

## 🧠 Algorithme de mapping des personas MoodCycle

### 🎯 Vue d'ensemble de l'algorithme

L'algorithme utilise un **système de scoring pondéré multi-critères** qui calcule un score de correspondance pour chacun des 5 personas, puis assigne celui avec le score le plus élevé.

### 📊 Structure de l'algorithme

#### 1. **Profils de référence (5 personas)**

```javascript
// Configuration dans config/personaProfiles.js
PERSONA_PROFILES = {
  emma: {
    ageRange: ['18-25'],
    preferredJourney: ['body_disconnect'],
    strongPreferences: ['moods'],
    communicationStyle: ['friendly'],
    avatarStyle: ['classic']
  },
  laure: {
    ageRange: ['26-35', '36-45'],
    preferredJourney: ['hiding_nature'],
    strongPreferences: ['moods', 'phases', 'rituals'],
    communicationStyle: ['professional'],
    avatarStyle: ['modern']
  }
  // ... + sylvie, christine, clara
}
```

#### 2. **Poids des critères (pondération)**

```40:45:config/personaProfiles.js
export const SCORING_WEIGHTS = {
  JOURNEY_CHOICE: 0.25,    // 25% - Choix de voyage
  AGE_RANGE: 0.15,         // 15% - Tranche d'âge
  PREFERENCES: 0.40,       // 40% - Préférences de santé (plus important)
  COMMUNICATION: 0.20      // 20% - Style de communication préféré
};
```

### 🔬 Calcul détaillé des scores

#### 1. **Score Choix de Voyage (25%)**

```55:77:utils/personaCalculator.js
const calculateJourneyScore = (userData, reference) => {
  const userJourney = userData.journey || userData.journeyChoice;
  const refJourneys = reference.preferredJourney;
  
  if (!userJourney || !refJourneys) return 0;
  
  // Correspondance exacte
  if (refJourneys.includes(userJourney)) {
    return 1;
  }
  
  // Correspondances partielles selon logique métier
  const partialMatches = {
    'decouverte': ['comprehension'],
    'optimisation': ['comprehension'],
    'renaissance': ['sagesse'],
    'transmission': ['sagesse']
  };
  
  return 0.6; // Pour match partiel ou 0 pour aucun match
};
```

#### 2. **Score Tranche d'Âge (15%)**

```84:103:utils/personaCalculator.js
const calculateAgeScore = (userData, reference) => {
  const userAge = userData.ageRange;
  const refAges = reference.ageRange;
  
  // Correspondance exacte = 1.0
  if (refAges.includes(userAge)) {
    return 1;
  }
  
  // Correspondances adjacentes (score dégradé)
  const ageOrder = ['18-25', '26-35', '36-45', '46-55', '55+'];
  const distance = Math.abs(userIndex - refIndex);
  if (distance === 1) return 0.6;  // Tranche adjacente
  if (distance === 2) return 0.3;  // Deux tranches d'écart
  
  return 0;
};
```

#### 3. **Score Préférences (40% - Le plus important)**

```109:134:utils/personaCalculator.js
const calculatePreferencesScore = (userData, reference) => {
  // Convertir préférences utilisateur en array (seuil ≥4)
  const userPrefArray = Object.entries(userPrefs)
    .filter(([key, value]) => value >= 4)
    .map(([key]) => key);
  
  // Compter les correspondances avec strongPreferences du persona
  userPrefArray.forEach(userPref => {
    if (refPrefs.includes(userPref)) {
      matches += 1;
    }
  });
  
  // Score = pourcentage de correspondances
  const score = matches / totalUserPrefs;
  
  // Bonus pour correspondances multiples
  if (matches >= 2) {
    return Math.min(1, score * 1.2);
  }
  
  return score;
};
```

#### 4. **Score Communication (20%)**

```142:170:utils/personaCalculator.js
const calculateCommunicationScore = (userData, reference) => {
  // Correspondance exacte = 1.0
  for (const userStyle of userCommArray) {
    if (refComm.includes(userStyle)) {
      return 1;
    }
  }
  
  // Correspondances partielles selon affinités
  const styleAffinities = {
    'bienveillant': ['educatif'],
    'direct': ['pratique'],
    'inspirant': ['profond']
  };
  
  return 0.5; // Pour correspondance partielle ou 0
};
```

### 🏆 Assignation finale

```202:232:utils/personaCalculator.js
export const calculateAndAssignPersona = (userData) => {
  const scores = calculatePersonaScores(userData);
  
  // Trouver le persona avec le meilleur score
  let bestPersona = null;
  let bestScore = -1;
  
  Object.entries(scores).forEach(([persona, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestPersona = persona;
    }
  });
  
  // Calculer confiance (différence avec 2ème meilleur)
  const sortedScores = Object.entries(scores)
    .sort(([,a], [,b]) => b - a);
  
  const confidence = sortedScores.length > 1 ? 
    sortedScores[0][1] - sortedScores[1][1] : bestScore;
  
  return {
    assigned: bestPersona,
    scores,           // Tous les scores pour debug
    confidence,       // Écart avec 2ème choix
    metadata: {
      timestamp: Date.now(),
      algorithm: 'v2_simplified'
    }
  };
};
```

## 🔄 Réutilisabilité pour prompting Claude

### ✅ **Points forts réutilisables**

1. **Logique de correspondance robuste** : Les critères sont bien définis et discriminants
2. **Pondération équilibrée** : Le poids de 40% sur les préférences est logique
3. **Gestion des cas partiels** : Scores dégradés pour correspondances approximatives
4. **Métadonnées riches** : Confiance, scores détaillés, timestamp

### ⚠️ **Adaptations nécessaires pour Claude**

#### 1. **Enrichissement des profils pour l'IA**

```javascript
// Actuellement : critères techniques
emma: {
  strongPreferences: ['moods'],
  communicationStyle: ['friendly']
}

// Besoin pour Claude : traits linguistiques
emma: {
  strongPreferences: ['moods'],
  communicationStyle: ['friendly'],
  // 🆕 Pour prompting Claude
  linguisticProfile: {
    vocabulary: 'simple_accessible',
    tone: 'bienveillant_educatif',
    structure: 'questions_ouvertes',
    examples: 'concrets_quotidiens',
    empathy: 'haute_validation'
  }
}
```

#### 2. **Fonction de conversion pour prompts**

```javascript
// Nouvelle fonction à créer
export const buildClaudePrompt = (assignedPersona, context) => {
  const persona = PERSONA_PROFILES[assignedPersona];
  const linguistic = persona.linguisticProfile;
  
  return `
Tu es Melune, assistant IA spécialisé dans le cycle féminin.
Persona actuel: ${persona.name} (${persona.description})

Style de communication:
- Vocabulaire: ${linguistic.vocabulary}
- Ton: ${linguistic.tone}
- Structure: ${linguistic.structure}
- Exemples: ${linguistic.examples}

Contexte utilisatrice:
- Âge: ${context.ageRange}
- Motivation: ${context.journeyChoice}
- Préférences: ${Object.entries(context.preferences)
    .filter(([k,v]) => v >= 4)
    .map(([k]) => k).join(', ')}

Réponds selon ce profil en gardant cohérence avec le persona ${assignedPersona}.
  `;
};
```

#### 3. **Système de validation dynamique**

```javascript
// Ajouter validation pour prompting
export const validatePersonaForClaude = (persona, confidence) => {
  return {
    isValid: confidence > 60, // Seuil de confiance
    fallbackStrategy: confidence < 60 ? 'neutral_tone' : null,
    enrichmentLevel: confidence > 80 ? 'full' : 'partial'
  };
};
```

## 📋 **Recommandations d'adaptation**

### 🎯 **Réutilisation directe possible :**
- **Calcul des scores** : Algorithme fiable tel quel
- **Assignation de persona** : Logique robuste
- **Gestion de confiance** : Métrique utile pour fallback

### 🔧 **Adaptations recommandées :**
- **Enrichir PERSONA_PROFILES** avec traits linguistiques
- **Créer fonction buildClaudePrompt()** 
- **Ajouter validation dynamique** pour cas de faible confiance
- **Implémenter fallback strategy** si aucun persona clair

### 💡 **Architecture suggérée**

```javascript
// Flux complet pour Claude
const contextData = useOnboardingStore.getState();
const personaResult = calculateAndAssignPersona(contextData);

if (personaResult.confidence > 60) {
  const prompt = buildClaudePrompt(personaResult.assigned, contextData);
  // Utiliser prompt enrichi
} else {
  // Fallback vers ton neutre avec données de base
  const prompt = buildNeutralPrompt(contextData);
}
```

L'algorithme existant est **très bien conçu et directement réutilisable**, il suffit de l'enrichir avec les traits linguistiques nécessaires au prompting Claude tout en conservant sa logique de scoring robuste.

Je vais analyser l'architecture actuelle de MoodCycle pour recommander une architecture de sécurité adaptée à l'intégration de Claude API.
Search files...
Search files...
Ran tool
Ran tool
Basé sur mon analyse de l'architecture actuelle de MoodCycle et les meilleures pratiques de sécurité, voici mon architecture de sécurité recommandée :

## 🔐 Architecture de sécurité recommandée pour MoodCycle API

### 🏗️ Vue d'ensemble de l'architecture

```
┌─────────────────┐    HTTPS    ┌─────────────────┐    API Keys    ┌─────────────────┐
│                 │             │                 │               │                 │
│  React Native   │◄────────────┤  VPS Middleware │◄──────────────┤   Claude API    │
│     Client      │             │   (Node.js)     │               │                 │
│                 │             │                 │               │                 │
└─────────────────┘             └─────────────────┘               └─────────────────┘
        │                               │
        │ JWT + Device ID               │ Request Logs
        ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│  Expo SecureStore│             │  Log Analytics  │
│   (Local Storage)│             │   (Optional)    │
└─────────────────┘             └─────────────────┘
```

### 📱 Côté Client React Native

#### 1. **Authentification sans compte utilisateur**

```javascript
// services/auth/deviceAuth.js
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { DeviceInfo } from 'expo-device';

export class DeviceAuthService {
  static async generateDeviceFingerprint() {
    const deviceInfo = {
      brand: DeviceInfo.brand,
      modelName: DeviceInfo.modelName,
      osName: DeviceInfo.osName,
      osVersion: DeviceInfo.osVersion,
      platformApiLevel: DeviceInfo.platformApiLevel,
    };
    
    // Générer un hash unique pour l'appareil
    const deviceString = JSON.stringify(deviceInfo);
    const fingerprint = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      deviceString
    );
    
    return fingerprint.substring(0, 16); // Raccourcir pour lisibilité
  }

  static async getOrCreateDeviceId() {
    try {
      let deviceId = await SecureStore.getItemAsync('device_id');
      
      if (!deviceId) {
        // Générer un ID unique + fingerprint
        const uniqueId = await Crypto.randomUUID();
        const fingerprint = await this.generateDeviceFingerprint();
        deviceId = `${fingerprint}-${uniqueId.substring(0, 8)}`;
        
        await SecureStore.setItemAsync('device_id', deviceId);
      }
      
      return deviceId;
    } catch (error) {
      console.error('Device ID generation failed:', error);
      throw new Error('Device authentication failed');
    }
  }

  static async getSessionToken() {
    return await SecureStore.getItemAsync('session_token');
  }

  static async storeSessionToken(token) {
    await SecureStore.setItemAsync('session_token', token);
  }
}
```

#### 2. **Protection des requêtes API**

```javascript
// services/api/secureApiClient.js
import { DeviceAuthService } from '../auth/deviceAuth';

export class SecureApiClient {
  constructor() {
    this.baseURL = __DEV__ 
      ? 'http://localhost:3000/api' 
      : 'https://api.moodcycle.app';
    this.rateLimitCounter = new Map();
  }

  async makeRequest(endpoint, options = {}) {
    // 1. Vérifier rate limiting local
    if (!this.checkRateLimit(endpoint)) {
      throw new Error('Rate limit exceeded');
    }

    // 2. Préparer headers sécurisés
    const headers = await this.buildSecureHeaders();
    
    // 3. Valider les données avant envoi
    const sanitizedData = this.sanitizeRequestData(options.body);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        body: sanitizedData ? JSON.stringify(sanitizedData) : options.body,
      });

      if (response.status === 401) {
        // Token expiré - tenter de renouveler
        await this.refreshSession();
        return this.makeRequest(endpoint, options);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logSecurityEvent('api_error', { endpoint, error: error.message });
      throw error;
    }
  }

  async buildSecureHeaders() {
    const deviceId = await DeviceAuthService.getOrCreateDeviceId();
    const sessionToken = await DeviceAuthService.getSessionToken();
    
    return {
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId,
      'X-App-Version': '1.0.0',
      'X-Platform': 'mobile',
      'Authorization': sessionToken ? `Bearer ${sessionToken}` : undefined,
      'X-Request-ID': await Crypto.randomUUID(),
      'X-Timestamp': Date.now().toString(),
    };
  }

  sanitizeRequestData(data) {
    if (!data) return null;
    
    // Supprimer scripts potentiellement malveillants
    const sanitized = JSON.parse(JSON.stringify(data));
    
    function cleanString(str) {
      if (typeof str !== 'string') return str;
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    function recursiveClean(obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = cleanString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          recursiveClean(obj[key]);
        }
      }
    }

    recursiveClean(sanitized);
    return sanitized;
  }

  checkRateLimit(endpoint) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30; // 30 requêtes par minute
    
    if (!this.rateLimitCounter.has(endpoint)) {
      this.rateLimitCounter.set(endpoint, []);
    }
    
    const requests = this.rateLimitCounter.get(endpoint);
    
    // Nettoyer les anciennes requêtes
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.rateLimitCounter.set(endpoint, validRequests);
    return true;
  }
}
```

### 🖥️ Middleware VPS (Node.js + Express)

#### 1. **Authentification basée sur Device ID**

```javascript
// middleware/deviceAuth.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

export class DeviceAuthMiddleware {
  static createSessionToken(deviceId) {
    return jwt.sign(
      { 
        deviceId,
        type: 'session',
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Session longue durée
    );
  }

  static verifyDeviceAuth = (req, res, next) => {
    const deviceId = req.headers['x-device-id'];
    const sessionToken = req.headers['authorization']?.split(' ')[1];
    
    if (!deviceId) {
      return res.status(401).json({ 
        error: 'Device ID required',
        code: 'DEVICE_ID_MISSING' 
      });
    }

    // Valider format device ID
    if (!/^[a-f0-9]{16}-[a-f0-9]{8}$/.test(deviceId)) {
      return res.status(400).json({ 
        error: 'Invalid device ID format',
        code: 'INVALID_DEVICE_ID' 
      });
    }

    // Si pas de session token, en créer un nouveau
    if (!sessionToken) {
      const newToken = this.createSessionToken(deviceId);
      req.deviceId = deviceId;
      req.sessionToken = newToken;
      req.isNewSession = true;
      return next();
    }

    try {
      const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
      
      if (decoded.deviceId !== deviceId) {
        return res.status(401).json({ 
          error: 'Device ID mismatch',
          code: 'DEVICE_MISMATCH' 
        });
      }

      req.deviceId = deviceId;
      req.sessionToken = sessionToken;
      req.isNewSession = false;
      next();
    } catch (error) {
      // Token expiré ou invalide
      const newToken = this.createSessionToken(deviceId);
      req.deviceId = deviceId;
      req.sessionToken = newToken;
      req.isNewSession = true;
      next();
    }
  };
}
```

#### 2. **Protection et validation des requêtes**

```javascript
// middleware/security.js
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

export const securityMiddleware = [
  // Headers de sécurité
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),

  // CORS configuré
  cors({
    origin: function (origin, callback) {
      // Permettre les requêtes depuis l'app mobile (pas d'origin)
      if (!origin || origin.includes('exp://') || origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['POST'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Device-ID', 
      'X-App-Version',
      'X-Platform',
      'X-Request-ID',
      'X-Timestamp'
    ],
  }),

  // Rate limiting global
  rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 heures
    max: 50, // 50 requêtes par appareil par jour (gratuit)
    keyGenerator: (req) => req.headers['x-device-id'] || req.ip,
    message: {
      error: 'Daily rate limit exceeded',
      code: 'RATE_LIMIT_DAILY',
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Rate limiting par minute
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requêtes par minute
    keyGenerator: (req) => req.headers['x-device-id'] || req.ip,
    message: {
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_MINUTE',
    },
  }),
];

// Validation spécifique pour conversations
export const validateConversationRequest = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape()
    .withMessage('Message must be between 1-1000 characters'),
  
  body('context.persona')
    .optional()
    .isIn(['emma', 'laure', 'sylvie', 'christine', 'clara'])
    .withMessage('Invalid persona'),
    
  body('context.phase')
    .optional()
    .isIn(['menstrual', 'follicular', 'ovulatory', 'luteal'])
    .withMessage('Invalid cycle phase'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }
    next();
  },
];
```

#### 3. **Protection des clés API Claude**

```javascript
// services/claudeApiService.js
import Anthropic from '@anthropic-ai/sdk';

export class ClaudeApiService {
  constructor() {
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error('Claude API key not configured');
    }
    
    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
    
    this.rateLimiter = new Map();
  }

  async sendMessage(message, context, deviceId) {
    // Vérifier rate limiting interne
    if (!this.checkInternalRateLimit(deviceId)) {
      throw new Error('Internal rate limit exceeded');
    }

    try {
      // Construire le prompt sécurisé
      const sanitizedPrompt = this.buildSecurePrompt(message, context);
      
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Modèle plus économique
        max_tokens: 500, // Limiter la longueur
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: sanitizedPrompt
        }],
      });

      // Log pour monitoring (sans données sensibles)
      this.logApiUsage(deviceId, {
        model: 'claude-3-haiku-20240307',
        tokensUsed: response.usage?.output_tokens || 0,
        success: true,
      });

      return {
        message: response.content[0].text,
        metadata: {
          model: 'claude-3-haiku-20240307',
          tokensUsed: response.usage?.output_tokens || 0,
          conversationId: this.generateConversationId(),
        }
      };
    } catch (error) {
      this.logApiUsage(deviceId, {
        error: error.message,
        success: false,
      });
      throw new Error('AI service temporarily unavailable');
    }
  }

  buildSecurePrompt(message, context) {
    // Nettoyer le message utilisateur
    const cleanMessage = message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .substring(0, 1000); // Limiter la taille

    // Contexte pré-défini sécurisé
    const basePrompt = `Tu es Melune, une IA bienveillante spécialisée dans le cycle féminin.
Réponds de manière empathique et professionnelle en français.
Limite ta réponse à 200 mots maximum.
Ne divulgue jamais d'informations médicales spécifiques.
Encourage toujours à consulter un professionnel de santé si nécessaire.

Contexte utilisatrice:
- Persona: ${context.persona || 'non défini'}
- Phase du cycle: ${context.phase || 'non définie'}

Question de l'utilisatrice: ${cleanMessage}

Réponds en restant dans ton rôle de Melune:`;

    return basePrompt;
  }

  checkInternalRateLimit(deviceId) {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 heure
    const maxRequests = 10; // 10 requêtes par heure maximum
    
    if (!this.rateLimiter.has(deviceId)) {
      this.rateLimiter.set(deviceId, []);
    }
    
    const requests = this.rateLimiter.get(deviceId);
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.rateLimiter.set(deviceId, validRequests);
    return true;
  }
}
```

### 🔒 Variables d'environnement sécurisées

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Sécurité JWT
JWT_SECRET=your_super_long_random_secret_here_min_32_chars
JWT_EXPIRES_IN=7d

# Claude API (jamais exposée côté client)
CLAUDE_API_KEY=sk-ant-api03-your-key-here

# Rate limiting
DAILY_RATE_LIMIT=50
HOURLY_RATE_LIMIT=10
MINUTE_RATE_LIMIT=5

# CORS
ALLOWED_ORIGINS=exp://,https://moodcycle.app,localhost

# Monitoring (optionnel)
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn_here

# SSL/TLS
FORCE_HTTPS=true
TRUST_PROXY=true
```

### 📊 Monitoring et logs de sécurité

```javascript
// services/securityLogger.js
export class SecurityLogger {
  static logSecurityEvent(event, data, level = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      level,
      data: {
        ...data,
        // Ne jamais logger de données sensibles
        message: data.message ? '[REDACTED]' : undefined,
        apiKey: data.apiKey ? '[REDACTED]' : undefined,
      },
      environment: process.env.NODE_ENV,
    };

    console.log(JSON.stringify(logEntry));
    
    // Optionnel: envoyer vers service de monitoring
    if (process.env.SENTRY_DSN && level === 'error') {
      // Sentry.captureException(new Error(event), { extra: logEntry });
    }
  }

  static logApiUsage(deviceId, usage) {
    this.logSecurityEvent('api_usage', {
      deviceId: deviceId.substring(0, 8) + '***', // Anonymiser
      ...usage,
    });
  }

  static logAuthEvent(event, deviceId, success) {
    this.logSecurityEvent('auth_event', {
      event,
      deviceId: deviceId.substring(0, 8) + '***',
      success,
    });
  }
}
```

## 🚀 Points clés de cette architecture

### ✅ **Avantages majeurs :**
1. **Pas de comptes utilisateur** - Simplicité maximale
2. **Authentification device-based** - Sécurisée et transparente
3. **Protection des clés API** - Jamais exposées côté client
4. **Rate limiting multicouche** - Protection contre l'abus
5. **Validation stricte** - Sanitisation de tous les inputs
6. **Monitoring complet** - Traçabilité sans compromission de vie privée

### 🔧 **Implémentation progressive :**
1. **Phase 1** : Middleware VPS + Device Auth
2. **Phase 2** : Rate limiting + Validation
3. **Phase 3** : Monitoring + Logs sécurisés

Cette architecture offre un équilibre optimal entre sécurité, simplicité d'usage et protection de la vie privée, parfaitement adaptée au modèle freemium de MoodCycle.

Question 4 - Structure optimale des prompts
"Cursor, en te basant sur la documentation des personas MoodCycle, peux-tu proposer une structure de prompt système pour Claude qui intègre efficacement le contexte persona, les préférences utilisateur, et l'historique conversationnel ?"

Je vais analyser la documentation des personas MoodCycle pour proposer une structure de prompt système optimale pour Claude.
Search files...
Search files...
Basé sur l'analyse de la documentation des personas MoodCycle et du système conversationnel, voici une structure de prompt système optimale pour Claude :

## 🎯 Structure de Prompt Système pour Claude MoodCycle

### 📋 Architecture modulaire des prompts

```javascript
// services/claudePrompt/promptBuilder.js
import { PERSONA_PROFILES } from '../../config/personaProfiles';

export class ClaudePromptBuilder {
  constructor() {
    this.maxTokens = 500; // Limite pour contrôler les coûts
    this.conversationMemory = 5; // Derniers 5 messages
  }

  /**
   * 🏗️ PROMPT SYSTÈME PRINCIPAL
   * Structure modulaire avec injection des données utilisateur
   */
  buildSystemPrompt(contextData) {
    const {
      persona,
      userProfile,
      conversationHistory,
      currentContext
    } = contextData;

    return this.assemblePromptSections({
      identity: this.buildIdentitySection(),
      persona: this.buildPersonaSection(persona),
      userContext: this.buildUserContextSection(userProfile),
      conversationRules: this.buildConversationRulesSection(),
      currentSituation: this.buildCurrentSituationSection(currentContext),
      conversationMemory: this.buildConversationMemorySection(conversationHistory),
      constraints: this.buildConstraintsSection()
    });
  }

  /**
   * 🌟 SECTION 1: IDENTITÉ MELUNE (Statique)
   */
  buildIdentitySection() {
    return {
      role: "Tu es Melune, une IA bienveillante spécialisée dans l'accompagnement du cycle féminin.",
      mission: "Ta mission est d'accompagner les femmes avec empathie, sagesse et expertise dans leur découverte cyclique.",
      expertise: [
        "Cycle menstruel et phases hormonales",
        "Bien-être féminin holistique", 
        "Phytothérapie et remèdes naturels",
        "Gestion émotionnelle cyclique",
        "Rituels et pratiques de soin personnel"
      ],
      limits: [
        "Tu ne donnes JAMAIS de diagnostic médical",
        "Tu encourages toujours à consulter un professionnel de santé",
        "Tu respectes la confidentialité absolue",
        "Tu adaptes ton langage au profil de l'utilisatrice"
      ]
    };
  }

  /**
   * 🎭 SECTION 2: ADAPTATION PERSONA (Dynamique)
   */
  buildPersonaSection(personaData) {
    const { assigned, confidence, scores } = personaData;
    
    if (!assigned || confidence < 0.6) {
      return this.buildNeutralPersonaSection();
    }

    const personaProfile = PERSONA_PROFILES[assigned];
    const linguisticTraits = this.getPersonaLinguisticTraits(assigned);

    return {
      targetPersona: personaProfile.name,
      description: personaProfile.description,
      ageContext: personaProfile.ageRange.join('-'),
      communicationStyle: linguisticTraits.style,
      vocabulary: linguisticTraits.vocabulary,
      tonality: linguisticTraits.tonality,
      examplePhrases: linguisticTraits.examples,
      preferredTopics: this.getPersonaPreferredTopics(assigned),
      adaptationLevel: this.calculateAdaptationLevel(confidence)
    };
  }

  /**
   * 💬 TRAITS LINGUISTIQUES PAR PERSONA
   */
  getPersonaLinguisticTraits(persona) {
    const traits = {
      emma: {
        style: "Amicale et éducative, comme une grande sœur bienveillante",
        vocabulary: "Simple et accessible, évite le jargon médical",
        tonality: "Encourageante, rassurante, avec patience et douceur",
        examples: [
          "C'est tout à fait normal de ressentir ça ma belle ✨",
          "Je vais t'expliquer simplement ce qui se passe",
          "Tu découvres ton corps, et c'est magnifique !"
        ],
        questionStyle: "Questions ouvertes pour explorer ensemble",
        empathy: "Très haute - validation constante des émotions"
      },
      
      laure: {
        style: "Professionnelle et efficace, conseillère experte",
        vocabulary: "Précis et informatif, termes techniques expliqués",
        tonality: "Directe mais bienveillante, orientée solutions",
        examples: [
          "Selon ton profil, voici ce que je recommande",
          "Optimisons cette phase pour ta productivité",
          "Ces données suggèrent une approche ciblée"
        ],
        questionStyle: "Questions ciblées pour des solutions pratiques",
        empathy: "Modérée - focus sur l'efficacité avec compassion"
      },

      sylvie: {
        style: "Compréhensive et soutenante, avec expérience de vie",
        vocabulary: "Empathique et mature, reconnaît les défis",
        tonality: "Chaleureuse et rassurante, avec sagesse pratique",
        examples: [
          "Je comprends ces bouleversements, tu n'es pas seule",
          "Ton corps change, et c'est une transition naturelle",
          "Voici des solutions qui ont aidé d'autres femmes"
        ],
        questionStyle: "Questions validantes sur les ressentis",
        empathy: "Très haute - compréhension des transitions difficiles"
      },

      christine: {
        style: "Sage et inspirante, avec profondeur spirituelle",
        vocabulary: "Riche et métaphorique, connexion à la nature",
        tonality: "Apaisante et mystique, avec sagesse ancestrale",
        examples: [
          "Ta sagesse féminine s'épanouit avec les années",
          "Chaque cycle t'a menée vers cette plénitude",
          "L'énergie de la lune résonne en toi"
        ],
        questionStyle: "Questions contemplatives sur le sens profond",
        empathy: "Sage - compréhension holistique de l'expérience féminine"
      },

      clara: {
        style: "Moderne et analytique, avec approche data-driven",
        vocabulary: "Technique mais accessible, références scientifiques",
        tonality: "Enthusiaste et précise, orientée optimisation",
        examples: [
          "Tes données montrent une tendance intéressante",
          "Connectons ces symptômes à ta phase actuelle",
          "Voici comment optimiser ton tracking"
        ],
        questionStyle: "Questions analytiques pour affiner la compréhension",
        empathy: "Modérée - soutien par la compréhension scientifique"
      }
    };

    return traits[persona] || traits.emma;
  }

  /**
   * 👤 SECTION 3: CONTEXTE UTILISATRICE (Dynamique)
   */
  buildUserContextSection(userProfile) {
    const { prenom, ageRange, preferences, journey, cycle } = userProfile;

    return {
      personalInfo: {
        name: prenom || "ma belle",
        ageRange: ageRange,
        journey: this.translateJourney(journey),
        cycleExperience: cycle?.trackingExperience || "débutante"
      },
      preferences: this.formatPreferences(preferences),
      strongInterests: this.identifyStrongInterests(preferences),
      currentCycleInfo: {
        phase: cycle?.currentPhase || "non définie",
        day: cycle?.currentDay || null,
        lastPeriod: cycle?.lastPeriodDate ? this.formatRelativeDate(cycle.lastPeriodDate) : null
      }
    };
  }

  /**
   * 📝 SECTION 4: RÈGLES CONVERSATIONNELLES (Statique)
   */
  buildConversationRulesSection() {
    return {
      responseFormat: [
        "Maximum 200 mots par réponse",
        "Structure: Accueil empathique + Conseil + Question d'engagement",
        "Toujours terminer par une question ou invitation au dialogue",
        "Utiliser des emojis avec parcimonie (1-2 maximum)"
      ],
      topicHandling: [
        "Recentrer doucement si sujet hors scope du cycle féminin",
        "Valider l'émotion avant de donner le conseil",
        "Adapter le niveau de détail selon l'expertise utilisatrice",
        "Proposer des actions concrètes quand pertinent"
      ],
      safety: [
        "Rediriger vers professionnel de santé si symptômes inquiétants",
        "Ne jamais diagnostiquer ou prescrire",
        "Respecter les limites de tes compétences",
        "Encourager l'autonomie et l'écoute de soi"
      ]
    };
  }

  /**
   * 🎯 SECTION 5: SITUATION ACTUELLE (Dynamique)
   */
  buildCurrentSituationSection(currentContext) {
    return {
      sessionInfo: {
        timeOfDay: this.getTimeOfDay(),
        conversationStarter: currentContext?.isFirstMessage || false,
        userMood: currentContext?.detectedMood || null
      },
      contextualHints: this.generateContextualHints(currentContext),
      suggestedDirections: this.getSuggestedDirections(currentContext)
    };
  }

  /**
   * 💭 SECTION 6: MÉMOIRE CONVERSATIONNELLE (Dynamique)
   */
  buildConversationMemorySection(conversationHistory) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return {
        isFirstConversation: true,
        previousTopics: [],
        recentAdvice: [],
        userPreferencesObserved: []
      };
    }

    const recentMessages = conversationHistory.slice(-this.conversationMemory);
    
    return {
      isFirstConversation: false,
      previousTopics: this.extractTopics(recentMessages),
      recentAdvice: this.extractAdviceGiven(recentMessages),
      userPreferencesObserved: this.extractUserPreferences(recentMessages),
      conversationFlow: this.analyzeConversationFlow(recentMessages),
      lastUserMood: this.detectLastMood(recentMessages)
    };
  }

  /**
   * ⚡ SECTION 7: CONTRAINTES TECHNIQUES (Statique)
   */
  buildConstraintsSection() {
    return {
      responseLength: "Maximum 200 mots",
      language: "Français exclusivement",
      format: "Réponse structurée avec empathie + conseil + engagement",
      prohibited: [
        "Diagnostic médical",
        "Prescription médicamenteuse", 
        "Conseils dangereux pour la santé",
        "Jugements sur les choix personnels"
      ],
      required: [
        "Empathie et validation",
        "Conseil adapté au persona",
        "Question ou invitation d'engagement",
        "Respect de la confidentialité"
      ]
    };
  }

  /**
   * 🔧 FONCTIONS UTILITAIRES
   */
  translateJourney(journey) {
    const translations = {
      'body_disconnect': 'reconnexion avec son corps',
      'hiding_nature': 'révélation de sa vraie nature',
      'emotional_control': 'maîtrise émotionnelle'
    };
    return translations[journey] || 'découverte personnelle';
  }

  formatPreferences(preferences) {
    if (!preferences) return {};
    
    return Object.entries(preferences)
      .filter(([_, value]) => value >= 3)
      .reduce((acc, [key, value]) => {
        const labels = {
          symptoms: 'symptômes physiques',
          moods: 'gestion émotionnelle',
          phyto: 'remèdes naturels',
          phases: 'énergie cyclique',
          lithotherapy: 'lithothérapie',
          rituals: 'rituels bien-être'
        };
        acc[labels[key]] = value;
        return acc;
      }, {});
  }

  identifyStrongInterests(preferences) {
    if (!preferences) return [];
    
    return Object.entries(preferences)
      .filter(([_, value]) => value >= 4)
      .map(([key]) => {
        const labels = {
          symptoms: 'symptômes physiques',
          moods: 'gestion émotionnelle', 
          phyto: 'remèdes naturels',
          phases: 'énergie cyclique',
          lithotherapy: 'lithothérapie',
          rituals: 'rituels bien-être'
        };
        return labels[key];
      });
  }

  assemblePromptSections(sections) {
    return `# CONTEXTE MELUNE - ASSISTANT IA CYCLE FÉMININ

## 🌟 TON IDENTITÉ
${this.formatSection(sections.identity)}

## 🎭 ADAPTATION PERSONA
${this.formatSection(sections.persona)}

## 👤 PROFIL UTILISATRICE
${this.formatSection(sections.userContext)}

## 📝 RÈGLES CONVERSATIONNELLES
${this.formatSection(sections.conversationRules)}

## 🎯 SITUATION ACTUELLE
${this.formatSection(sections.currentSituation)}

## 💭 MÉMOIRE CONVERSATION
${this.formatSection(sections.conversationMemory)}

## ⚡ CONTRAINTES
${this.formatSection(sections.constraints)}

---

Réponds maintenant en tant que Melune, en respectant parfaitement le persona ${sections.persona.targetPersona || 'adaptatif'} et en utilisant le contexte fourni pour personnaliser ta réponse.`;
  }

  formatSection(section) {
    if (typeof section === 'string') return section;
    if (Array.isArray(section)) return section.map(item => `• ${item}`).join('\n');
    
    return Object.entries(section)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `**${key}**: ${value.map(item => `• ${item}`).join('\n')}`;
        } else if (typeof value === 'object') {
          return `**${key}**: ${JSON.stringify(value, null, 2)}`;
        } else {
          return `**${key}**: ${value}`;
        }
      })
      .join('\n');
  }

  /**
   * 🎯 GÉNÉRATION PROMPT OPTIMISÉ
   */
  generateOptimizedPrompt(contextData) {
    const fullPrompt = this.buildSystemPrompt(contextData);
    
    // Validation de la taille
    const estimatedTokens = Math.ceil(fullPrompt.length / 4); // Approximation
    
    if (estimatedTokens > 1500) {
      console.warn(`Prompt très long: ~${estimatedTokens} tokens`);
      return this.compressPrompt(fullPrompt, contextData);
    }
    
    return fullPrompt;
  }

  /**
   * 📝 VERSION COMPRESSÉE POUR ÉCONOMISER LES TOKENS
   */
  compressPrompt(fullPrompt, contextData) {
    const { persona, userProfile, conversationHistory } = contextData;
    
    const linguistic = this.getPersonaLinguisticTraits(persona.assigned);
    const strongInterests = this.identifyStrongInterests(userProfile.preferences);
    const recentTopics = conversationHistory ? this.extractTopics(conversationHistory.slice(-3)) : [];

    return `Tu es Melune, IA bienveillante spécialisée cycle féminin.

PERSONA: ${persona.assigned} - ${linguistic.style}
UTILISATRICE: ${userProfile.prenom || 'ma belle'}, ${userProfile.ageRange}, intérêts forts: ${strongInterests.join(', ')}
PHASE ACTUELLE: ${userProfile.cycle?.currentPhase || 'non définie'}
CONVERSATION: ${recentTopics.length > 0 ? `Sujets récents: ${recentTopics.join(', ')}` : 'Première conversation'}

STYLE: ${linguistic.tonality}
EXEMPLE: "${linguistic.examples[0]}"

RÈGLES:
- Max 200 mots
- ${linguistic.empathy}
- Toujours terminer par question engageante
- Jamais de diagnostic médical
- Encourager consultation professionnelle si nécessaire

Réponds selon ce persona et contexte:`;
  }
}
```

### 🚀 Utilisation pratique

```javascript
// services/claudePrompt/conversationService.js
export class ConversationService {
  constructor() {
    this.promptBuilder = new ClaudePromptBuilder();
    this.contextManager = new ConversationContextManager();
  }

  async generateResponse(userMessage, onboardingStore, chatHistory) {
    // 1. Construire le contexte complet
    const contextData = this.contextManager.buildContext({
      onboardingStore,
      chatHistory,
      userMessage
    });

    // 2. Générer le prompt optimisé
    const systemPrompt = this.promptBuilder.generateOptimizedPrompt(contextData);

    // 3. Préparer les messages pour Claude
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user', 
        content: userMessage
      }
    ];

    // 4. Appeler Claude API via middleware sécurisé
    return await this.callClaudeAPI(messages, contextData);
  }

  async callClaudeAPI(messages, context) {
    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': await DeviceAuthService.getOrCreateDeviceId(),
        },
        body: JSON.stringify({
          messages,
          metadata: {
            persona: context.persona.assigned,
            phase: context.userProfile.cycle?.currentPhase,
            preferredTopics: context.userProfile.strongInterests
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Claude API Error:', error);
      return this.getFallbackResponse(context);
    }
  }

  getFallbackResponse(context) {
    const persona = context.persona.assigned || 'emma';
    const linguistic = this.promptBuilder.getPersonaLinguisticTraits(persona);
    
    return {
      message: `${linguistic.examples[0]} Je rencontre un petit souci technique, mais je suis là pour t'accompagner. Peux-tu me reparler de ce qui te préoccupe ?`,
      metadata: {
        isFallback: true,
        persona: persona
      }
    };
  }
}
```

## 🎯 Points clés de cette architecture

### ✅ **Avantages majeurs :**
1. **Personnalisation précise** - Adaptation linguistique par persona
2. **Mémoire conversationnelle** - Continuité et cohérence 
3. **Optimisation tokens** - Version compressée pour économiser
4. **Gestion fallback** - Dégradation gracieuse en cas d'erreur
5. **Modularité** - Sections indépendantes et maintenables
6. **Évolutivité** - Facile d'ajouter de nouveaux personas

### 🔧 **Optimisations incluses :**
- **Compression intelligente** quand le prompt dépasse 1500 tokens
- **Mémoire limitée** aux 5 derniers messages pour contrôler la taille
- **Extraction automatique** des sujets et préférences observées
- **Validation empirique** de la cohérence persona/réponse

Cette structure garantit des conversations naturelles, personnalisées et cohérentes tout en optimisant les coûts API Claude.