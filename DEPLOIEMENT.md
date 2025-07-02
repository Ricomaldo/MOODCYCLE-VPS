# 📋 **MoodCycle Backend - Guide Complet**

> **Source de Vérité** - Tout ce que vous devez savoir pour maîtriser votre backend  
> Dernière mise à jour : 27/06/2025 - Post diagnostic conversation

---

## 🎯 **Vue d'Ensemble Architecture**

### **Structure Projet (Monorepo)**
```
MOODCYCLE-VPS/
├── packages/admin/          # Interface React Admin
└── packages/api/            # API Backend Node.js
```

### **Déploiement Séparé (Git Subtree)**
```bash
packages/admin  → repo admin.git       → /srv/www/internal/moodcycle-admin/
packages/api    → repo moodcycle-api.git → /srv/www/internal/moodcycle.irimwebforge.com/
```

---

## 🚀 **Commandes de Déploiement**

### **Déploiement Admin (React)**
```bash
# Depuis la racine du projet
npm run deploy:admin
# ou
git subtree push --prefix=packages/admin admin main
```

### **Déploiement API (Node.js)**
```bash
# Depuis la racine du projet  
npm run deploy:api
# ou
git subtree push --prefix=packages/api moodcycle-api main
```

### **⚠️ ATTENTION : Ne pas confondre !**
- **Fichier modifié dans `/admin`** → `deploy:admin`
- **Fichier modifié dans `/api`** → `deploy:api`

---

## 🏗️ **Architecture VPS Production**

### **Emplacements sur le VPS**
```
/srv/www/internal/
├── moodcycle.irimwebforge.com/     # API Backend
│   ├── current → releases/20250617132037/    # Symlink version active
│   ├── releases/                   # Historique déploiements
│   │   ├── 20250617132037/        # Version actuelle
│   │   ├── 20250617131649/        # Versions précédentes
│   │   └── [autres versions...]
│   └── shared/                    # Fichiers partagés
│       └── .env                   # Configuration commune
└── moodcycle-admin/               # Interface Admin React
    ├── current → releases/20250616203533/
    └── releases/
```

### **Services Actifs**
```bash
# PM2 (Process Manager)
ID │ Name           │ Status │ Restart │ Port
4  │ moodcycle-api  │ online │ 59      │ 4000

# Nginx (Reverse Proxy)
Port 443 (HTTPS) → moodcycle.irimwebforge.com
```

---

## 🔧 **Gestion PM2 (Process Manager)**

### **Commandes Essentielles**
```bash
# Status des services
pm2 list

# Détails service API
pm2 show moodcycle-api

# Redémarrer l'API
pm2 restart moodcycle-api

# Logs temps réel
pm2 logs moodcycle-api --lines 50

# Logs d'erreur uniquement
pm2 logs moodcycle-api --lines 20 --err
```

### **Variables d'Environnement PM2**
```bash
# Voir toutes les variables env du processus
pm2 env 4

# Variables critiques vérifiées
pm2 logs moodcycle-api | grep "PASSWORD exists"
```

---

## 🔐 **Configuration Variables d'Environnement**

### **Fichier Principal**
```bash
/srv/www/internal/moodcycle.irimwebforge.com/shared/.env
```

### **Variables Obligatoires**
```bash
NODE_ENV=production
PORT=4000
CLAUDE_API_KEY=sk-ant-api03-xxx...
JWT_SECRET=moodcycle_super_secret_key_production_2025
ADMIN_PASSWORD=onveutdupognon67!
JEZA_PASSWORD=onvaetreriche67!
```

### **Variables Optionnelles**
```bash
CLAUDE_MAX_TOKENS=500
DAILY_BUDGET_LIMIT=10
WEEKLY_BUDGET_LIMIT=50
MONTHLY_BUDGET_LIMIT=150
LOGS_PATH=/srv/www/internal/moodcycle.irimwebforge.com/current/logs
```

---

## 🌐 **Configuration Nginx**

### **Fichier Config**
```bash
/etc/nginx/sites-enabled/moodcycle.irimwebforge.com
```

### **Routes Importantes**
```nginx
# API Proxy vers PM2
location /api/ {
    proxy_pass http://localhost:4000/api/;
}



# Interface Admin
location /admin {
    alias /srv/www/internal/moodcycle.irimwebforge.com/current/dist;
}
```

### **Redémarrer Nginx**
```bash
# Tester config
sudo nginx -t

# Recharger
sudo systemctl reload nginx
```

---

## 📁 **Fichiers de Données Critiques**

### **Localisation**
```bash
/srv/www/internal/moodcycle-api/current/packages/api/src/data/
```

### **Fichiers Essentiels**
- `insights.json` (2332 lignes) - Contenus IA
- `phases.json` (330 lignes) - Métadonnées cycle
- `closings.json` (31 lignes) - Messages personnalisés
- `vignettes.json` (571 lignes) - Actions contextuelles

### **⚠️ Problème Résolu : insights.json**
Le fichier était manquant sur le VPS → **Déployer via `deploy:api`**

---

## 🎭 **URLs de Production**

### **Interface Admin**
```
https://moodcycle.irimwebforge.com/admin
```
- Login : `admin` / `jeza` avec mots de passe configurés
- Gestion contenus, insights, phases, closings, vignettes

### **API Backend**
```
Base: https://moodcycle.irimwebforge.com/api/

Endpoints:
- POST /api/chat                    # Chat principal
- GET  /api/health                  # Status API
- POST /api/admin/auth             # Login admin/jeza
- GET  /api/admin/insights         # Données insights
- POST /api/admin/insights         # Sauver insights
- GET  /api/admin/phases           # Données phases
- POST /api/admin/phases           # Sauver phases
```

---

## 🛠️ **Guide Dépannage (Junior Friendly)**

### **1. API ne répond pas**
```bash
# Vérifier PM2
pm2 list
# Si offline → pm2 restart moodcycle-api

# Vérifier logs
pm2 logs moodcycle-api --lines 20
```

### **2. Admin ne se connecte pas**
```bash
# Tester endpoint direct
curl -X POST https://moodcycle.irimwebforge.com/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"jeza","password":"onvaetreriche67!"}'
```

### **3. Erreur 500 Internal Server Error**
```bash
# Voir erreurs détaillées
pm2 logs moodcycle-api --lines 50 --err

# Vérifier fichiers données existent
ls -la /srv/www/internal/moodcycle-api/current/packages/api/src/data/
```

### **4. Erreur 404 sur routes admin**
```bash
# Vérifier config nginx
cat /etc/nginx/sites-enabled/moodcycle.irimwebforge.com

# Recharger si nécessaire
sudo nginx -t && sudo systemctl reload nginx
```

### **5. Variables d'environnement manquantes**
```bash
# Vérifier fichier .env
cat /srv/www/internal/moodcycle.irimwebforge.com/shared/.env

# Vérifier PM2 les voit
pm2 env 4 | grep -E "(CLAUDE|JWT|PASSWORD)"
```

---

## 📊 **Monitoring & Logs**

### **Logs Temps Réel**
```bash
# API (technique)
pm2 logs moodcycle-api --lines 30

# Conversations (business)
tail -f /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq .
```

### **Statistiques Rapides**
```bash
# Statut général
pm2 show moodcycle-api

# Métriques performance
pm2 monit

# Nombre conversations aujourd'hui
cat /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq 'select(.timestamp | startswith("2025-06-27"))' | wc -l
```

---

## 🔄 **Workflow Déploiement Standard**

### **Modification Admin**
1. Modifier fichiers dans `packages/admin/`
2. `npm run deploy:admin`
3. Vérifier : `https://moodcycle.irimwebforge.com/admin`

### **Modification API**
1. Modifier fichiers dans `packages/api/`
2. `npm run deploy:api`
3. Vérifier : `pm2 logs moodcycle-api`
4. Test : `curl https://moodcycle.irimwebforge.com/api/health`

### **Ajout Variables d'Environnement**
1. Éditer : `/srv/www/internal/moodcycle.irimwebforge.com/shared/.env`
2. Redémarrer : `pm2 restart moodcycle-api`
3. Vérifier : `pm2 env 4`

---

## 🚨 **Commandes d'Urgence (Démo)**

### **Reset Complet API**
```bash
pm2 restart moodcycle-api
pm2 logs moodcycle-api --lines 10
```

### **Test API Rapide**
```bash
curl https://moodcycle.irimwebforge.com/api/health
```

### **Test Login Admin**
```bash
curl -X POST https://moodcycle.irimwebforge.com/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"jeza","password":"onvaetreriche67!"}'
```

### **Vérifier Fichiers Données**
```bash
ls -la /srv/www/internal/moodcycle-api/current/packages/api/src/data/ | grep insights
```

---

## 📝 **Checklist Avant Démo**

- [ ] `pm2 list` → moodcycle-api **online**
- [ ] `curl .../api/health` → `{"status": "healthy"}`  
- [ ] Login admin fonctionne
- [ ] Interface admin accessible
- [ ] Logs propres (pas d'erreurs récentes)

---

## 🧠 **Résumé Technique**

**Architecture** : Monorepo → Git Subtree → VPS Debian  
**Runtime** : PM2 + Node.js 18.19.1  
**Proxy** : Nginx + SSL Let's Encrypt  
**Données** : JSON files (pas de BDD)  
**Auth** : JWT (admin/jeza)  
**IA** : Claude 3 Haiku via API  

**Points d'attention** :
- Ne pas confondre deploy admin vs api
- Variables .env dans `/shared/`
- Nginx redirige `/admin/*` vers `/api/admin/*`
- Fichiers JSON critiques dans `/src/data/`

---

**🎯 Avec ce guide, vous maîtrisez 100% de votre backend !**  
*Architecture claire • Commandes pratiques • Dépannage rapide • Production stable*
