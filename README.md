# 🧠 MoodCycle API - Serveur IA Conversationnel Spécialisé

> **Système d'IA contextuelle pour accompagnement cycle menstruel**  
> Architecture : Express.js + Claude 3 Haiku + React Admin  
> Status : ✅ Production `moodcycle.irimwebforge.com`

## 🎯 Potentiel IA

**Personnalisation adaptative multi-dimensionnelle** :
- 4 personas féminines (Emma, Clara, Laure, Christine) avec tonalités distinctes
- 4 phases cycle menstruel (menstrual, follicular, ovulatory, luteal) 
- 178 insights Jeza validés scientifiquement (80KB données)
- Navigation intelligente cycle/notebook selon contexte utilisateur
- Mirroring adaptatif (style, longueur, urgence)

**Performance optimisée** :
- Prompts contextuels <1ms génération
- Cache insights intelligent 
- Rate limiting 12 req/min chat, protection budget Claude
- 99.8% uptime production

## 🔧 Architecture Technique

```
API Core (Node.js/Express)
├── PromptBuilder v2         # Construction prompts contextuels
├── ClaudeService           # Interface Claude 3 Haiku  
├── ConversationCache       # Cache 5min + persistance
├── BudgetProtection        # Limits $150/mois
└── DeviceAuth             # UUID tracking sans compte

Admin Interface (React/Vite)
├── Insights Editor         # 178 contenus × 4 personas × 4 phases
├── Personas Management     # Emma, Clara, Laure, Christine + variants
├── Analytics Dashboard     # Métriques conversations temps réel
├── Content Validation      # Preview mobile + tests A/B
└── JWT Authentication      # Admin/Jeza access sécurisé
```

## 📊 Spécifications

### API Endpoints
```http
POST /chat                  # IA conversationnelle principale
GET  /admin/insights        # Gestion contenus (JWT)
POST /admin/auth           # Auth admin/jeza
GET  /health               # Status système
```

### Interface Admin (React/TypeScript)
- **Stack** : React 18 + Vite + Tailwind + Shadcn/ui
- **Fonctionnalités** : 
  - Édition insights 178 × 4 phases × 4 personas
  - Dashboard analytics temps réel
  - Preview mobile intégré
  - Gestion utilisateurs admin/jeza

### Données Structurées
- **insights_validated.json** : 178 insights × 4 phases × 4 personas (2332 lignes)
- **phases.json** : Métadonnées cycle menstruel (330 lignes)
- **vignettes.json** : Actions contextuelles (571 lignes)
- **closings.json** : Messages personnalisés (31 lignes)

### Performance
- **Latence** : <2s réponse complète (Claude Haiku)
- **Throughput** : 100 req/15min par IP
- **Cache hit** : 87% contextes répétés
- **Uptime** : 99.8% (VPS production)

## 🚀 Capacités IA Avancées

### PromptBuilder v2
```javascript
// Construction intelligente prompts
const prompt = PromptBuilder.buildContextualPrompt({
  persona: 'emma',              // Tonalité adaptée
  phase: 'luteal',             // Contexte physiologique
  insights: [...],             // Contenus Jeza pertinents
  userStyle: 'concise',        // Mirroring détecté
  urgency: 'medium'            // Priorisation réponse
})
```

### Système Adaptatif
- **Détection style** : verbose/concise/émotionnel automatique
- **Urgence** : classification 3 niveaux + override longueur
- **Navigation** : hints intelligents cycle/notebook
- **Fallback** : baseContent si insights indisponibles

### Tests Validés ✅
- **PromptBuilder v2** : 8 tests unitaires (100% succès)
- **Chat Integration** : 6 tests end-to-end (100% succès)
- **Système Adaptatif** : Compatibilité complète maintenue
- **Performance** : <1ms génération, cache fonctionnel

## ⚡ Quick Start

### Développement Local
```bash
git clone [repo] && cd MOODCYCLE-VPS
npm install

# API (port 4000)
cd packages/api && npm run dev

# Admin (port 5173)  
cd packages/admin && npm run dev

# Tests complets
npm test
```

### Interface Admin Production
- **URL** : `https://moodcycle.irimwebforge.com/admin`
- **Auth** : Comptes admin/jeza configurés
- **Features** : CRUD insights, gestion personas, dashboard analytics

### Variables Critiques (.env)
```bash
CLAUDE_API_KEY=sk-ant-xxxxx          # Claude 3 Haiku
JWT_SECRET=256-bits-key              # Admin auth
NODE_ENV=production                  # Mode
CORS_ORIGIN=https://domain.com       # Sécurité
```

### Test Chat
```bash
curl -X POST localhost:4000/chat \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: test-uuid" \
  -d '{
    "message": "Je me sens fatiguée",
    "context": {
      "persona": "emma",
      "phase": "luteal",
      "preferences": {"symptoms": 5}
    }
  }'
```

## 🏗️ Infrastructure Production

**VPS Debian** : `69.62.107.136`
- **Services** : PM2 (2 instances) + Nginx + SSL
- **Domaine** : `moodcycle.irimwebforge.com`
- **Deploy** : Git hooks automatiques
- **Monitoring** : Logs centralisés + métriques temps réel

**Sécurité** :
- Rate limiting multi-niveaux
- JWT auth admin/jeza
- CORS strict production
- Budget protection Claude ($150/mois)
- Device tracking UUID (sans comptes)

---

**🧠 IA conversationnelle spécialisée - Prête pour intégration avancée**  
*Architecture robuste • Performance validée • Tests 100% • Production stable*