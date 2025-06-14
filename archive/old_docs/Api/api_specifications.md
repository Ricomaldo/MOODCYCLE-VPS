# 📋 Spécifications Techniques MoodCycle API

## 🎯 Vue d'ensemble

**Objectif** : API Node.js/Express pour gérer les conversations avec Claude AI, intégrée à l'app React Native MoodCycle

**Port de développement** : 4000  
**Architecture** : RESTful API avec authentification device-based  
**Sécurité** : Rate limiting, validation inputs, protection clés API

## 🛠️ Infrastructure Technique

### Stack Technologique
- **Backend** : Node.js + Express.js
- **AI Integration** : Claude API (Anthropic)
- **Authentification** : JWT + Device ID
- **Validation** : express-validator
- **Sécurité** : helmet, cors, rate limiting
- **Environment** : dotenv pour configuration

### Structure Projet Recommandée
```
moodcycle-api/
├── src/
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Auth, validation, sécurité
│   ├── services/        # Claude API, prompt building
│   ├── utils/           # Helpers, formatters
│   └── routes/          # Définition endpoints
├── tests/               # Tests par couche
├── docs/                # Documentation API
└── config/              # Configuration environment
```

## 🔐 Architecture de Sécurité

### Authentification Device-Based
- **Device ID** : Fingerprint appareil + UUID unique
- **Session Token** : JWT 7 jours, auto-renouvelé
- **Stockage sécurisé** : Expo SecureStore côté client

### Rate Limiting Multi-Niveau
- **Global** : 50 requêtes/jour par device (gratuit)
- **Par minute** : 5 requêtes/minute
- **Claude API** : 10 requêtes/heure par device

### Validation et Sécurité
- Sanitisation inputs (anti-XSS)
- Validation format Device ID
- Headers sécurisés (helmet)
- CORS configuré pour mobile

## 📡 Endpoints API

### POST /api/chat
**Fonction** : Conversation avec Melune via Claude AI

**Headers requis**
```
Content-Type: application/json
X-Device-ID: [device-fingerprint]-[uuid]
X-App-Version: 1.0.0
Authorization: Bearer [jwt-token] (optionnel)
```

**Body - Couche 1 (Test)**
```json
{
  "message": "Bonjour Melune",
  "test": true
}
```

**Body - Couche 2 (Claude basique)**
```json
{
  "message": "Comment gérer mes crampes ?",
  "context": {
    "phase": "menstrual"
  }
}
```

**Body - Couche 3 (Personnalisé basique)**
```json
{
  "message": "Je me sens fatiguée",
  "context": {
    "persona": "emma",
    "phase": "follicular",
    "preferences": {
      "symptoms": 4,
      "moods": 3
    }
  }
}
```

**Body - Couche 4 (Sophistiqué)**
```json
{
  "message": "Aide-moi à comprendre mon cycle",
  "context": {
    "persona": "emma",
    "userProfile": {
      "prenom": "Marie",
      "ageRange": "18-25",
      "preferences": {...}
    },
    "conversationHistory": [...],
    "currentContext": {...}
  }
}
```

**Réponse Success**
```json
{
  "success": true,
  "data": {
    "message": "Réponse de Melune...",
    "metadata": {
      "persona": "emma",
      "tokensUsed": 150,
      "conversationId": "uuid",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  },
  "session": {
    "token": "nouveau-jwt-si-renouvele",
    "isNewSession": false
  }
}
```

**Réponse Error**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Limite quotidienne atteinte",
    "details": {
      "resetTime": "2024-01-16T00:00:00Z",
      "remaining": 0
    }
  }
}
```

## 🎭 Système de Personnalisation

### Personas Supportés
- **emma** : Novice curieuse (18-25 ans)
- **laure** : Professionnelle équilibrée (26-45 ans)
- **sylvie** : Femme en transition (46-55 ans)
- **christine** : Sage épanouie (55+ ans)
- **clara** : Enthousiaste connectée (26-35 ans)

### Données OnboardingStore Exploitées
```javascript
{
  userInfo: { prenom, ageRange },
  journeyChoice: { selectedOption, motivation },
  cycleData: { lastPeriodDate, averageCycleLength, currentPhase },
  preferences: { symptoms, moods, phyto, phases, lithotherapy, rituals },
  melune: { avatarStyle, communicationTone },
  persona: { assigned, confidence, scores }
}
```

## 🧠 Architecture des Prompts

### Couche 3 : Template Basique
```javascript
const basicPrompt = `
Tu es Melune, IA bienveillante pour le cycle féminin.
Utilisatrice: ${prenom}, ${ageRange}
Persona: ${persona}
Phase actuelle: ${phase}
Préférences fortes: ${strongPreferences.join(', ')}

Réponds avec empathie en ${communicationTone}.
Maximum 200 mots.
`;
```

### Couche 4 : Architecture Modulaire
- **Section 1** : Identité Melune (statique)
- **Section 2** : Adaptation persona (dynamique)
- **Section 3** : Contexte utilisatrice (dynamique)
- **Section 4** : Règles conversationnelles (statique)
- **Section 5** : Situation actuelle (dynamique)
- **Section 6** : Mémoire conversationnelle (dynamique)
- **Section 7** : Contraintes techniques (statique)

## 🔧 Configuration Environment

### Variables .env Requises
```bash
# Serveur
NODE_ENV=development
PORT=4000

# Sécurité
JWT_SECRET=your_super_long_secret_32_chars_min
CORS_ORIGINS=exp://,localhost:8081

# Claude API
CLAUDE_API_KEY=sk-ant-api03-your-key

# Rate Limiting
DAILY_LIMIT=50
HOURLY_LIMIT=10
MINUTE_LIMIT=5

# Monitoring
LOG_LEVEL=info
```

## 📊 Monitoring et Logs

### Métriques à Tracker
- Nombre de conversations par device
- Tokens consommés par requête
- Temps de réponse Claude API
- Erreurs d'authentification
- Rate limiting déclenchés

### Logs de Sécurité
- Tentatives d'accès invalides
- Device ID malformés
- Dépassements de rate limit
- Erreurs Claude API

## ✅ Critères de Validation par Couche

### Couche 1 : Infrastructure
- [ ] Endpoint /chat répond avec message test
- [ ] Authentification device-ID fonctionnelle
- [ ] Rate limiting en place
- [ ] CORS configuré pour React Native

### Couche 2 : Claude Integration
- [ ] Appel Claude API réussi
- [ ] Prompt statique fonctionnel
- [ ] Gestion erreurs Claude
- [ ] Réponse formatée correctement

### Couche 3 : Personnalisation Basique
- [ ] Injection données OnboardingStore
- [ ] Template prompt personnalisé
- [ ] Différenciation visible par persona
- [ ] Validation qualité conversationnelle

### Couche 4 : Architecture Sophistiquée
- [ ] Structure modulaire complète
- [ ] Traits linguistiques par persona
- [ ] Historique conversationnel
- [ ] Optimisation tokens
- [ ] Fallback gracieux

## 🚀 Déploiement

### Développement Local
- Port 4000 avec nodemon
- Variables d'environnement .env.local
- Tests unitaires par couche

### Production VPS
- HTTPS obligatoire
- Variables d'environnement sécurisées
- Monitoring et alertes
- Backup et rollback