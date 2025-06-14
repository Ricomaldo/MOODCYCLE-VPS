# 🌙 MoodCycle

**Application de suivi du cycle menstruel avec IA conversationnelle Claude**

MoodCycle est une application React Native qui accompagne les femmes dans la compréhension de leur cycle menstruel grâce à Melune, une IA bienveillante alimentée par Claude AI d'Anthropic.

> **📋 État actuel :** Couche 3 conversationnelle validée - Admin MVP en développement
> 
> **📊 Documents de suivi :** [TASKS.md](./TASKS.md) | [FOCUS-AGENT.md](./FOCUS-AGENT.md) | [TECHNICAL.md](./TECHNICAL.md)

## ✨ Fonctionnalités Implémentées

- 🗣️ **Chat conversationnel avec Claude** - IA personnalisée via PromptBuilder sophistiqué
- 📊 **Roue du cycle interactive** - Visualisation intuitive des phases menstruelles
- 🎭 **Système de personas intelligent** - 5 profils (Emma, Laure, Sylvie, Christine, Clara) avec algorithme de mapping
- 🎯 **178 insights personnalisés** - Base validée, expansion vers 890 variants en cours
- 🌙 **Onboarding conversationnel** - 10 écrans d'introduction avec calcul persona automatique
- 🏪 **Architecture offline-first** - Fonctionnement complet sans connexion
- 🧪 **Interfaces de debug complètes** - /debug/persona et /debug/insights-v2

## 🎯 OBJECTIFS ACTUELS - PHASE 1

### **Admin MVP (1-2 semaines) - EN COURS** 
```
⚙️ API-ADMIN FOUNDATION
├── 🔌 Endpoints CRUD insights (/api/admin/insights)    [⏳ À FAIRE]
├── 📊 Endpoint phases.json (/api/admin/phases)         [⏳ À FAIRE]  
├── 🔐 Auth simple (développeur + Jeza)                 [⏳ À FAIRE]
└── 📝 Interface admin React basique                    [⏳ À FAIRE]
   ├── Liste/édition des 178 insights actuels          [⏳ À FAIRE]
   ├── Création variants 5 personas                     [⏳ À FAIRE]
   └── Édition phases.json                              [⏳ À FAIRE]
```

**Objectif :** Débloquer le travail thérapeutique (178 → 890 insights personnalisés)

*Voir [TASKS.md](./TASKS.md) pour le suivi détaillé et la roadmap complète*

## 🏗️ Architecture Technologique

### Stack Principale
- **Framework** : React Native + Expo (SDK 53)
- **Navigation** : Expo Router (file-based routing)
- **Language** : TypeScript
- **UI** : React Native + Expo Linear Gradient + React Native SVG

### État & Données (Offline-First)
- **State Management** : Zustand avec persistence AsyncStorage
- **Cache Intelligent** : ChatService singleton + ContextFormatter optimisé
- **Backend Opérationnel** : Node.js/Express + Claude API (développement local)
- **Stockage Local** : AsyncStorage pour toutes les données utilisateur
- **Architecture** : 100% local-first, cloud optionnel

### Backend & API (Fonctionnel)
- **Serveur Express** : Développement local avec rate limiting et sécurité
- **IA Claude** : @anthropic-ai/sdk avec model claude-3-haiku-20240307
- **PromptBuilder** : Construction de prompts contextuels sophistiqués par persona
- **DeviceAuth** : Authentification JWT par device
- **Gestion Fallback** : Réponses personnalisées par persona en cas d'erreur

## 📁 Structure du Projet

```
MoodCycle/
├── 📋 docs/TASKS.md                 # Source de vérité - Suivi des tâches
├── 🎯 docs/FOCUS-AGENT.md          # Instructions agent de focus
├── 🔧 docs/TECHNICAL.md            # Documentation technique détaillée
├── 📝 docs/WORKFLOW.md             # Processus et branches Git
├── packages/app/                   # 📱 Application React Native
│   ├── app/                       # 🚀 Expo Router (Routes)
│   │   ├── onboarding/            # 10 écrans conversationnels
│   │   └── (tabs)/                # Navigation principale
│   ├── stores/                    # 🏪 Zustand Stores
│   ├── services/                  # 🔌 Services & Communication
│   ├── utils/                     # Algorithme mapping personas
│   ├── data/                      # Insights + phases.json
│   └── config/                    # Configuration endpoints
├── packages/api/                  # 🌐 Backend Node.js/Express
│   ├── src/
│   │   ├── server.js             # Configuration Express + middleware
│   │   ├── controllers/          # Logique métier conversations
│   │   ├── services/             # Claude API + PromptBuilder
│   │   └── middleware/           # Authentification JWT
│   └── package.json              # @anthropic-ai/sdk, express
└── packages/admin/                # 🎭 Interface d'administration
    └── [En développement]         # React interface pour Jeza
        ├── Gestion 178 insights  # → 890 variants
        ├── Édition phases.json   
        └── Configuration personas
```

## 🚀 Installation Rapide

### Démarrage Développement

```bash
# 1. Cloner le projet
git clone [votre-repo]/MoodCycle.git && cd MoodCycle

# 2. Backend API
cd packages/api && npm install
cp .env.example .env
# Ajouter CLAUDE_API_KEY=sk-ant-api03-your-key
npm run dev  # Port 4000

# 3. App Mobile (nouveau terminal)
cd ../packages/app && npm install  
npm start    # Puis 'i' pour iOS ou 'a' pour Android

# 4. Admin Interface (en développement)
cd ../packages/admin && npm install
npm run dev  # Port 3000
```

### Configuration Rapide
- **App Mobile** : Fonctionne offline avec fallbacks locaux
- **Backend** : Optionnel pour développement (fallbacks intégrés)
- **Claude API** : Nécessaire uniquement pour conversations IA

## 🏆 Roadmap & Status

### ✅ **Phases Terminées**
- **Couche 1-2-3** : Foundation + State + Backend Claude (Score: 8.5/10)
- **Architecture conversationnelle** : PromptBuilder sophistiqué opérationnel
- **Système personas** : 5 profils avec différenciation linguistique
- **Chat fonctionnel** : Claude API + fallbacks personnalisés

### 🎯 **Phase Actuelle : Admin MVP**
- **Priorité 1** : Interface admin pour déblocage travail thérapeutique
- **Workflow** : 178 insights → 890 variants personnalisés (5 personas)
- **Timeline** : 1-2 semaines

### 🚀 **Phases Suivantes**
- **App MVP Complet** : Écran Carnet + connexions API
- **Tests Utilisateurs** : Groupe enthousiaste prêt 
- **App Store** : Guidelines Apple + RevenueCat + déploiement

*Voir [TASKS.md](./TASKS.md) pour le détail complet et les métriques de succès*

## 🤝 Workflow Équipe

### **Développeur Principal**
- Focus Phase 1 : Admin MVP endpoints + interface
- Accompagnement : Agent focus via [FOCUS-AGENT.md](./FOCUS-AGENT.md)
- Éviter : Sur-ingénierie (architecture déjà excellente)

### **Jeza (Thérapeutique)**
- **Bloquée** : En attente interface admin
- **Travail à reprendre** : Variantage 178 insights → 890 (5 personas)
- **Device** : iPhone + MacBook (interface responsive requise)

### **Architecture Décisions**
- ✅ **Mono-repo** : Versions synchronisées
- ✅ **Local-first** : PersonaCalculator reste côté app
- ✅ **Migration progressive** : Fallbacks maintenus
- ✅ **Simplicité** : Pas de Phase 4 sophistication

## 📊 Métriques & Focus

### **Success Criteria Phase 1**
- [ ] Jeza peut éditer les 178 insights existants via interface
- [ ] Création de 5 variants par insight fonctionne
- [ ] App récupère insights via API (avec fallback local)
- [ ] Zero breaking changes côté app mobile

### **Questions de Focus Quotidien**
1. Cette tâche débloquerait-elle Jeza ou les tests utilisateurs ?
2. Est-ce que ça rapproche du MVP ou c'est de l'optimisation ?
3. La solution la plus simple fonctionnerait-elle ?
4. Jeza pourrait-elle reprendre son travail après ça ?

## 🧪 Développement

### Scripts par Module
```bash
# App Mobile - Développement
cd packages/app && npm start

# Backend API - Développement
cd packages/api && npm run dev

# Admin Interface - À créer
cd packages/admin && npm run dev
```

### Debug & Test
- **App** : Debug interfaces /debug/persona et /debug/insights-v2
- **API** : Rate limiting + auth device en local
- **Fallbacks** : Mode offline complet sans backend

## 📄 Documentation

| Document | Contenu | Usage |
|----------|---------|-------|
| [TASKS.md](./TASKS.md) | Suivi tâches + post-it focus | Source de vérité opérationnelle |
| [FOCUS-AGENT.md](./FOCUS-AGENT.md) | Instructions agent IA | Conversations de focus |
| [TECHNICAL.md](./TECHNICAL.md) | Architecture détaillée | Référence technique |
| [WORKFLOW.md](./WORKFLOW.md) | Processus + branches Git | Développement |

---

**🎯 Focus Actuel : Admin MVP → Déblocage travail thérapeutique → MVP complet → Tests utilisateurs**

*Architecture technique validée - Priorité absolue sur la finalisation contenus et expérience utilisateur*