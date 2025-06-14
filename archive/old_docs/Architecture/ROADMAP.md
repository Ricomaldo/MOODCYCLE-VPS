# Roadmap Architecture - MoodCycle

> **Architecture future** - Post-MVP et évolutions prévues

## 🎯 **Vision d'Architecture Complète**

### Phase 1 : MVP Local ✅ (Terminé)
- [x] Système personas complet
- [x] Insights personnalisés V2
- [x] Architecture offline-first Zustand
- [x] Interfaces debug complètes

### Phase 2 : API Conversationnelle 🔄 (En planification)
- [ ] Middleware VPS pour conversations Melune
- [ ] Intégration Claude API 
- [ ] Chat intelligent avec contexte

### Phase 3 : Monétisation 💰 (Prévu)
- [ ] Intégration RevenueCat
- [ ] Système d'abonnements
- [ ] Paywall intelligent

### Phase 4 : Backend Optionnel ☁️ (Post-MVP)
- [ ] Supabase pour backup cloud
- [ ] Sync multi-appareils
- [ ] Authentification complète

## 🖥️ **Middleware VPS (Phase 2)**

### Infrastructure Prévue
```
middleware/ (sur VPS Hostinger)
├── server.js              # Express server principal
├── routes/
│   ├── conversation.js    # Route POST /api/conversation
│   ├── health.js          # Route GET /health
│   └── auth.js            # Validation tokens/quotas
├── services/
│   ├── claude-api.js      # Client API Claude
│   ├── context-builder.js # Enrichissement prompts
│   ├── rate-limiter.js    # Quotas utilisateur (10/jour)
│   └── logger.js          # Logs anonymisés
├── utils/
│   ├── validation.js      # Validation inputs
│   └── security.js        # Sanitization
└── config/
    ├── environment.js     # Variables d'environnement
    └── secrets.js         # Gestion secrets API
```

### Architecture Conversationnelle Prévue
1. **App mobile** → Requête avec contexte utilisateur (persona + phase + historique)
2. **Middleware VPS** → Enrichissement prompt + appel Claude API
3. **Claude API** → Réponse contextualisée selon persona
4. **Middleware VPS** → Validation/modération réponse
5. **App mobile** → Affichage réponse + sauvegarde locale

### Services App Mobile (à créer)
```
services/
├── middleware/
│   ├── claude-client.js    # Client vers middleware VPS
│   ├── conversation.js     # Gestion contexte conversationnel
│   └── auth-client.js      # Auth middleware (quotas/rate limiting)
├── local/ (existant)
│   ├── insights.js         # Sélection insights personnalisés
│   ├── cycle-calculator.js # Calculs cycle menstruel
│   └── persona-mapping.js  # Algorithme assignation personas
└── storage/ (à créer)
    ├── persistence.js      # AsyncStorage + SecureStore
    └── cache.js            # Cache conversations
```

## 💳 **Monétisation RevenueCat (Phase 3)**

### Intégration Prévue
```javascript
// services/monetization/ (à créer)
├── revenuecat-client.js    # SDK RevenueCat
├── subscription-manager.js # Gestion états abonnement
├── paywall-logic.js        # Logique d'affichage paywall
└── analytics.js            # Métriques conversion
```

### Points de Contrôle Prévus
- **Conversations Melune** : 10/jour (gratuit) → illimité (premium)
- **Insights avancés** : Accès variants personas selon abonnement
- **Export données** : Fonctionnalité premium uniquement
- **Carnet sagesse** : Sauvegarde limitée → illimitée
- **Notifications** : Basiques → personnalisées intelligentes

### Écrans Paywall
- **700-paywall.jsx** ✅ déjà créé dans onboarding
- **Paywall contextuel** dans app selon usage
- **Upgrade prompts** intelligents selon persona

## ☁️ **Backend Supabase (Phase 4)**

### Architecture Cloud Optionnelle
```
Supabase Backend (optionnel)
├── Authentication
│   ├── OAuth providers (Google, Apple)
│   ├── Magic links email
│   └── Biométrie mobile
├── Database (PostgreSQL)
│   ├── user_profiles        # Profils + personas
│   ├── cycle_data          # Données cycle
│   ├── conversations       # Historique chat anonymisé
│   ├── insights_history    # Insights consultés
│   └── subscriptions       # État abonnements
├── Realtime
│   ├── Multi-device sync   # Synchronisation appareils
│   └── Live notifications  # Push intelligent
├── Edge Functions
│   ├── persona-calculator  # Backup algorithme
│   ├── insight-recommender # Logique recommandations
│   └── conversation-proxy  # Proxy sécurisé Claude
└── Storage
    ├── Backup cycles       # Sauvegarde données cycle
    ├── Export reports      # Rapports générés
    └── Avatar assets       # Personnalisations Melune
```

### Migration Progressive
1. **Backup optionnel** : Utilisateur choisit cloud backup
2. **Auth douce** : Création compte pour sync multi-appareils
3. **Migration données** : Transfer AsyncStorage → Supabase
4. **Sync bidirectionnel** : Local-first avec sync cloud

## 🔧 **Configuration Environnements Future**

### App Mobile (.env) - Étendu
```bash
# Actuel
ENVIRONMENT=development|staging|production

# Phase 2 - Middleware VPS
VPS_MIDDLEWARE_URL=https://moodcycle-middleware.ton-vps.com
VPS_API_KEY=ton_api_key_vps

# Phase 3 - RevenueCat
REVENUECAT_API_KEY=ton_revenuecat_key
PAYWALL_CONFIG=basic|premium|enterprise

# Phase 4 - Supabase (optionnel)
SUPABASE_URL=https://ton-projet.supabase.co
SUPABASE_ANON_KEY=ton_anon_key
SUPABASE_SERVICE_KEY=ton_service_key
```

### Middleware VPS (.env)
```bash
# Claude API
CLAUDE_API_KEY=ton_claude_api_key
CLAUDE_MODEL=claude-3-7-sonnet-20250219

# Sécurité
JWT_SECRET=ton_jwt_secret
RATE_LIMIT_DAILY=10
ALLOWED_ORIGINS=exp://,https://moodcycle.app

# Monitoring
LOG_LEVEL=info
HEALTH_CHECK_INTERVAL=30000
ANALYTICS_ENDPOINT=https://analytics.moodcycle.app
```

## 🎯 **Principes Architecturaux Future**

### 1. Local-First Toujours
- **Fonctionnalités critiques** restent 100% locales
- **Cloud = enhancement** pas dépendance
- **Dégradation gracieuse** si services indisponibles

### 2. Privacy by Design
- **Données santé** ne quittent jamais l'appareil (sauf backup explicite)
- **Conversations** anonymisées côté middleware
- **Analytics** différentielles et anonymes

### 3. Monétisation Éthique
- **Freemium** avec valeur réelle gratuite
- **Premium** apporte vraie valeur ajoutée
- **Pas de manipulation** ou dark patterns

### 4. Évolutivité Progressive
- **Architecture modulaire** pour ajouts futurs
- **Migration douce** vers services cloud
- **Backward compatibility** toujours maintenue

## 📋 **TODO Architecture Future**

### Phase 2 : API Conversationnelle (3-4 semaines)
- [ ] Setup VPS Hostinger + Node.js/Express
- [ ] Intégration Claude API avec prompts personas
- [ ] Système quotas et rate limiting
- [ ] Client middleware dans app mobile
- [ ] Tests conversation bout-en-bout

### Phase 3 : Monétisation (2-3 semaines)
- [ ] Intégration SDK RevenueCat
- [ ] Configuration produits et prix
- [ ] Logique paywall contextuel
- [ ] Tests parcours achat complet
- [ ] Analytics conversion

### Phase 4 : Supabase (4-6 semaines) 
- [ ] Setup projet Supabase + schémas
- [ ] Migration progressive AsyncStorage
- [ ] Auth flow complet avec OAuth
- [ ] Sync bidirectionnel robust
- [ ] Tests multi-appareils

## 🚀 **Vision Long Terme**

### App Mature (6-12 mois)
- **IA conversationnelle** de niveau thérapeute
- **Prédictions cycle** ML avancées  
- **Communauté** femmes avec modération IA
- **Intégrations** wearables et health apps
- **Expansion** internationale et langues

### Platform (1-2 ans)
- **API publique** pour partenaires santé
- **White-label** pour professionnels
- **Recherche** anonymisée sur cycle menstruel
- **Impact** sociétal mesurable

---

**Roadmap évolutif** - Architecture pensée pour grandir intelligemment. 