# MoodCycle Monorepo 🌙

> Écosystème complet MoodCycle - App mobile, API et interface admin

## Vue d'ensemble

MoodCycle est une application de suivi du cycle menstruel avec intelligence artificielle, développée en monorepo pour une meilleure cohérence et gestion des versions.

## Structure du projet

```
MoodCycle/
├── packages/
│   ├── app/           # 📱 Application mobile (React Native/Expo)
│   ├── api/           # 🔧 API Backend (Node.js/Express)
│   └── admin/         # 🖥️ Interface admin (React/Lovable) - À créer
├── docs/              # 📚 Documentation
├── archive/           # 📦 Projets archivés
└── package.json       # ⚙️ Configuration monorepo
```

## Packages

### 📱 App (packages/app)
- **Tech**: React Native, Expo, TypeScript
- **Package**: `moodcycle`
- **Features**: Suivi cycle, IA conversationnelle, insights personnalisés
- **Status**: ✅ **Fonctionnel** - Expo Metro running
- **Run**: `npm start` ou `npm run dev:app`

### 🔧 API (packages/api)  
- **Tech**: Node.js, Express, Anthropic AI
- **Package**: `moodcycleapi`
- **Features**: Endpoints RESTful, authentification, IA backend
- **Status**: ✅ **Fonctionnel** - Port 4000, `/api/chat` testé
- **Run**: `npm run start:api` ou `npm run dev:api`

### 🖥️ Admin (packages/admin)
- **Tech**: React, Tailwind CSS, Vite, TypeScript (Lovable)
- **Package**: `moodcycle-admin` (à créer)
- **Features**: Dashboard, gestion insights (178 → 890 variants)
- **Status**: 🚧 **En cours** - Sprint MVP
- **Run**: `npm run start:admin` (après création)

## Quick Start

```bash
# Installation complète
npm install

# Démarrer l'API (Backend)
npm run start:api      # ✅ Testé et fonctionnel

# Démarrer l'app mobile
npm start              # ✅ Testé et fonctionnel

# Démarrer API + Admin simultanément (future)
npm run start:all

# Build tous les packages
npm run build
```

## Scripts disponibles

| Script | Description | Status |
|--------|-------------|--------|
| `npm start` | Lance l'app mobile (Expo) | ✅ |
| `npm run start:api` | Lance l'API (nodemon, port 4000) | ✅ |
| `npm run start:admin` | Lance l'interface admin | 🚧 |
| `npm run start:all` | Lance API + Admin | 🚧 |
| `npm run dev:api` | Alias pour l'API | ✅ |
| `npm run dev:app` | Alias pour l'App | ✅ |
| `npm run build` | Build tous les packages | ✅ |
| `npm run test` | Tests de tous les packages | ✅ |

## État actuel du projet

### ✅ **Fonctionnel**
- ✅ Monorepo npm workspaces configuré
- ✅ API Node.js/Express (port 4000)
- ✅ App React Native/Expo
- ✅ Scripts workspaces corrigés
- ✅ Authentification API (device-based)
- ✅ Endpoint `/api/chat` avec IA Claude
- ✅ Variables d'environnement (`.env`)

### 🚧 **En cours**
- 🚧 Interface Admin (sprint MVP)
- 🚧 Endpoints API pour insights/phases
- 🚧 Système d'authentification Admin/Jeza

### 📋 **Données actuelles**
- 📊 **Base source**: `archive/insightsEditor/data/current/insights_validated.json` (178 insights)
- 📱 **App utilise**: `packages/app/data/insights.json` (16 insights enrichis)
- 🎯 **Objectif**: 178 insights → 890 variants (5 personas)

## Développement

### Tests serveurs réussis 🎉
```bash
# API testée et fonctionnelle
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: test-device" \
  -d '{"message": "Bonjour", "context": {"phase": "menstrual", "persona": "emma"}}'

# Réponse: {"success":true,"data":{"message":"Bonjour ! Comment puis-je vous aider..."}}
```

### Workflow Git

```bash
# Branches principales
main                    # 🚀 Production
develop                 # 🔄 Intégration
feature/admin-mvp       # 🎯 Sprint actuel ⭐
feature/app-notebook    # 📝 Développement app
```

### Architecture post-sprint

**Actuellement :**
- App → Fichiers locaux (`insights.json`, `phases.json`, `persona-closings.js`)

**Après sprint :**
- App → API endpoints + fallbacks locaux
- Admin → API pour édition insights
- API → Source de vérité unifiée

### Variables d'environnement

#### API (`.env`)
```bash
NODE_ENV=development
PORT=4000
CLAUDE_API_KEY=your_key
JWT_SECRET=your_secret
ADMIN_PASSWORD=your_password
JEZA_PASSWORD=your_password
```

**⚠️ Sécurité MVP** : Configuration actuelle pour développement uniquement. Voir `docs/TECHNICAL.md` section "Sécurité TODO Production" pour hardening avant mise en production.

#### Admin (`.env.local`)
```bash
VITE_API_URL=http://localhost:4000
```

## Troubleshooting

### ❌ "No workspaces found"
**Problème**: `npm run start:api` → `No workspaces found: --workspace=api`

**Solution**: Les workspaces utilisent le nom du package, pas du dossier :
```json
// ❌ Incorrect
"start:api": "npm run dev --workspace=api"

// ✅ Correct  
"start:api": "npm run dev --workspace=moodcycleapi"
```

### 🔧 Noms des packages
- `packages/app/` → `moodcycle`
- `packages/api/` → `moodcycleapi`  
- `packages/admin/` → `moodcycle-admin` (futur)

## 🚀 Déploiement Production

### Infrastructure VPS
- **Serveur**: 69.62.107.136 (Hostinger)
- **Domaine**: moodcycle.irimwebforge.com
- **SSL**: Let's Encrypt automatique
- **Process Manager**: PM2 pour l'API Node.js

### Architecture Production
```
moodcycle.irimwebforge.com/
├── /                  # Interface Admin (React statique)
├── /api/              # API Node.js (proxy vers localhost:4000)
└── SSL automatique    # HTTPS obligatoire
```

### Déploiement API (Node.js + PM2)
```bash
# Sur le serveur VPS
cd /srv/www/internal/moodcycle/api/current
npm install --production
pm2 start src/server.js --name moodcycle-api
pm2 save && pm2 startup
```

### Configuration Nginx
```nginx
server {
    server_name moodcycle.irimwebforge.com;
    
    # Admin Interface
    location / {
        root /srv/www/internal/moodcycle/admin/current;
        try_files $uri $uri.html $uri/ /index.html;
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Documentation

- 📋 [Admin Sprint](admin_sprint_specs.md) - Spécifications admin MVP
- 🏗️ [Technical](docs/TECHNICAL.md) - Architecture technique  
- 🔄 [Workflow](docs/WORKFLOW.md) - Processus Git et CI/CD

## Technologies

- **Frontend**: React Native (App), React + Vite (Admin)
- **Backend**: Node.js, Express, dotenv
- **AI**: Anthropic Claude SDK
- **Tools**: Expo, Vite, Lovable, npm workspaces
- **Languages**: TypeScript, JavaScript
- **Infrastructure**: VPS Hostinger, Nginx, PM2, Let's Encrypt

## Sprint Admin MVP

### 🎯 Objectif
Créer interface Lovable pour Jeza :
- ✅ Authentification simple
- ✅ Édition insights (178 → 890 variants)  
- ✅ Preview temps réel
- ✅ Validation workflow

### 📊 Data Flow
1. **Source**: `insights_validated.json` (178 insights)
2. **Édition**: Interface admin → API
3. **Export**: API → `insights.json` pour app
4. **Fallback**: App garde copie locale

---

**🚀 Made with ❤️ by IrimWebForge**

*Monorepo structure optimized for rapid development and deployment* 