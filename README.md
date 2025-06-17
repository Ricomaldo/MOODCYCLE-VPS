# 🔧 MoodCycle VPS - Backend Production

> **API Express + Interface Admin React - Architecture production déployée**  
> État : ✅ Opérationnel sur `moodcycle.irimwebforge.com`

## 🏗️ Architecture VPS

```
MOODCYCLE-VPS/
├── packages/
│   ├── api/             # 🔧 API Backend (Node.js/Express)
│   │   ├── src/         # Controllers + Services + Routes
│   │   ├── data/        # insights.json + phases.json
│   │   └── .env         # Claude API + JWT secrets
│   └── admin/           # 🖥️ Interface admin (React/Vite)
│       ├── src/         # Components + Pages + Services
│       └── dist/        # Build production
└── README.md
```

## 🚀 Quick Start Développement

### Installation
```bash
cd MOODCYCLE-VPS
npm install
```

### Démarrage Local
```bash
# API Backend (port 4000)
npm run dev:api

# Interface Admin (port 5173)  
npm run dev:admin

# Build Admin pour production
npm run build:admin
```

### URLs Développement
- **API** : `http://localhost:4000/health`
- **Admin** : `http://localhost:5173`
- **Swagger** : `http://localhost:4000/api-docs` (si activé)

## 🔌 API Endpoints Principaux

### Chat Public
```http
POST /chat
Content-Type: application/json
X-Device-ID: <device_uuid>

{
  "message": "Comment gérer ma fatigue aujourd'hui ?",
  "context": {
    "phase": "luteal", 
    "persona": "emma",
    "currentDate": "2024-01-15",
    "preferences": { "symptoms": 5, "moods": 4 }
  }
}
```

### Admin Authentication
```http
POST /admin/auth
Content-Type: application/json

{
  "username": "admin|jeza", 
  "password": "secure_password"
}
```

### Gestion Insights
```http
# Récupérer insights
GET /admin/insights
Authorization: Bearer <jwt_token>

# Sauvegarder insight
POST /admin/insights  
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "id": "insight_123",
  "persona": "emma", 
  "phase": "luteal",
  "content": "Texte personnalisé Emma",
  "variants": ["variant1", "variant2"]
}
```

### Système
```http
GET /health
# → { "status": "ok", "timestamp": "...", "uptime": 3600 }
```

## 🛡️ Sécurité & Configuration

### Variables d'Environnement (.env)
```bash
# Application
NODE_ENV=production
PORT=4000

# Claude IA  
CLAUDE_API_KEY=sk-ant-xxxxx
CLAUDE_MODEL=claude-3-haiku-20240307

# Authentication
JWT_SECRET=super-secret-256-bits-key
JWT_EXPIRES_IN=24h
ADMIN_PASSWORD=secure-admin-password
JEZA_PASSWORD=secure-jeza-password

# Paths
DATA_PATH=/srv/www/internal/moodcycle/shared/data
LOGS_PATH=/srv/www/internal/moodcycle/shared/logs

# Security
CORS_ORIGIN=https://moodcycle.irimwebforge.com
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100        # 100 req/15min
```

### Protection Budget Claude
```javascript
// Budget limits configurés
const BUDGET_LIMITS = {
  daily: 10,      // $10/jour
  weekly: 50,     // $50/semaine  
  monthly: 150    // $150/mois
}

// Rate limiting
const rateLimits = {
  chat: '12 req/min',     // Chat endpoint
  admin: '100 req/15min', // Admin endpoints
  global: '1000 req/hour' // Global API
}
```

## 🚀 Infrastructure Production VPS

### Serveur
- **Host** : VPS Debian `69.62.107.136`
- **Services** : PM2 + Nginx + Let's Encrypt SSL
- **Domaine** : `moodcycle.irimwebforge.com`

### Déploiement Automatique
```bash
# Git hooks configurés pour auto-deploy
cd MOODCYCLE-VPS

# Deploy API
git push api main         # → PM2 restart automatique

# Deploy Admin  
git push admin main       # → Build React + deploy static

# Backup GitHub
git push origin main      # → Sauvegarde code
```

### Structure Production
```
/srv/www/internal/moodcycle/
├── api/
│   ├── releases/2024-01-15/    # Versions API
│   └── current/ → latest/      # Symlink actuel
├── admin/
│   ├── releases/2024-01-15/    # Builds React
│   └── current/ → latest/      # Symlink actuel  
└── shared/
    ├── data/                   # insights.json + phases.json
    ├── logs/                   # PM2 + Nginx logs
    └── ssl/                    # Certificats Let's Encrypt
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'moodcycle-api',
    script: './src/server.js',
    instances: 2,
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
}
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/moodcycle
server {
    listen 443 ssl http2;
    server_name moodcycle.irimwebforge.com;
    
    # SSL certificates
    ssl_certificate /srv/www/internal/moodcycle/shared/ssl/cert.pem;
    ssl_certificate_key /srv/www/internal/moodcycle/shared/ssl/key.pem;
    
    # Admin interface (React SPA)
    location / {
        root /srv/www/internal/moodcycle/admin/current;
        try_files $uri $uri/ /index.html;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring Production

### Commandes Utiles
```bash
# Status services
ssh root@69.62.107.136 'pm2 status'

# Logs temps réel
ssh root@69.62.107.136 'pm2 logs moodcycle-api --lines 100'

# Restart API
ssh root@69.62.107.136 'pm2 restart moodcycle-api'

# Status Nginx
ssh root@69.62.107.136 'nginx -t && systemctl status nginx'

# Certificats SSL
ssh root@69.62.107.136 'certbot certificates'
```

### Health Check
```bash
# API santé
curl https://moodcycle.irimwebforge.com/api/health

# Admin interface
curl -I https://moodcycle.irimwebforge.com/

# Test chat endpoint
curl -X POST https://moodcycle.irimwebforge.com/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: test-device" \
  -d '{"message": "Hello Melune"}'
```

### Métriques Clés
- **Uptime API** : 99.8%
- **Temps réponse** : <2s (Claude Haiku)
- **Rate limit hits** : <5% des requêtes
- **Erreurs 5xx** : <0.1%
- **Taille logs** : <100MB/mois

## 🔧 Développement Local

### Setup Environnement
```bash
# 1. Clone repository
git clone https://github.com/votre-repo/MOODCYCLE-VPS.git
cd MOODCYCLE-VPS

# 2. Configuration API
cd packages/api
cp .env.example .env
# Éditer .env avec vos clés (CLAUDE_API_KEY, JWT_SECRET...)

# 3. Installation dépendances
npm install

# 4. Démarrage services
npm run dev:api     # Terminal 1 - Port 4000
npm run dev:admin   # Terminal 2 - Port 5173
```

### Tests API
```bash
# Test santé
curl http://localhost:4000/health

# Test auth admin
curl -X POST http://localhost:4000/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'

# Test chat (avec device ID)
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: dev-test-123" \
  -d '{"message": "Test Melune", "context": {"persona": "emma"}}'
```

## 🎭 Services Spécialisés

### ChatService.js
```javascript
// Gestion conversations Claude API
const response = await ClaudeService.sendMessage(
  message,           // Message utilisatrice
  systemPrompt,      // Prompt enrichi par PromptBuilder  
  deviceId           // Identification unique
)
```

### PromptBuilder.js  
```javascript
// Construction prompts contextuels
const prompt = PromptBuilder.buildContextualPrompt({
  persona: 'emma',
  userProfile: { age: 28, preferences: {...} },
  currentPhase: 'luteal',
  strongPreferences: ['gestion émotionnelle']
})
```

### ContextFormatter.js
```javascript
// Cache intelligent 5 minutes
const context = ContextFormatter.formatForAPI(onboardingData)
// → Cache hit 87% production
```

---

**🔧 Backend robuste pour personnalisation IA conversationnelle**  
*Architecture production validée - Performance 99.8% uptime* 