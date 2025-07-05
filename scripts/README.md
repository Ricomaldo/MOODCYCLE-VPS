# 🛠️ Scripts de Déploiement et Diagnostic MoodCycle API

## 📋 **Vue d'ensemble**

Ce dossier contient les scripts pour gérer le déploiement et le diagnostic de l'API MoodCycle en production.

## 📁 **Structure**

```
scripts/
├── README.md                    # Cette documentation
├── deploy-with-pm2-fix.sh      # Script de déploiement avec fix PM2
├── diagnose-pm2.sh             # Script de diagnostic PM2
└── test-endpoints.sh           # Script de test des endpoints
```

## 🚀 **Scripts de Déploiement**

### `deploy-with-pm2-fix.sh`

**Objectif :** Déployer l'API en résolvant automatiquement les problèmes de chemin PM2.

**Problème résolu :** PM2 qui pointe vers d'anciennes releases au lieu du symlink `current`.

**Utilisation :**
```bash
./scripts/deploy-with-pm2-fix.sh
```

**Étapes :**
1. Déploiement du code via `npm run deploy:api`
2. Vérification du symlink `current`
3. Redémarrage PM2 avec `ecosystem.config.js`
4. Vérification du statut PM2
5. Tests des endpoints

**Prérequis :**
- Accès SSH configuré vers le serveur
- `jq` installé localement
- `ecosystem.config.js` présent sur le serveur

## 🔍 **Scripts de Diagnostic**

### `diagnose-pm2.sh`

**Objectif :** Diagnostiquer rapidement les problèmes de configuration PM2.

**Utilisation :**
```bash
./scripts/diagnose-pm2.sh
```

**Vérifications :**
- Statut PM2
- Chemins de script (doit utiliser `/current/`)
- Symlink `current`
- Releases disponibles
- Fonctionnement des endpoints

**Sortie :** Diagnostic complet avec solutions proposées.

### `test-endpoints.sh`

**Objectif :** Tester tous les endpoints sécurisés en production.

**Utilisation :**
```bash
./scripts/test-endpoints.sh
```

**Tests :**
- Santé de l'API (`/api/health`)
- Endpoints sécurisés avec `X-Device-ID`
- Sécurité (refus sans `X-Device-ID`)
- Endpoints admin (authentification requise)

## 🔧 **Configuration PM2**

### `ecosystem.config.js`

Configuration PM2 qui utilise le symlink `current` pour éviter les problèmes de chemin :

```javascript
module.exports = {
  apps: [{
    name: "moodcycle-api",
    script: "./src/server.js",
    cwd: "/srv/www/internal/moodcycle-api/current", // ✅ Utilise current
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "production",
      PORT: 4000
    },
    autorestart: true,
    max_memory_restart: "1G"
  }]
};
```

## 🧪 **Tests Automatisés**

### Tests Jest

Les tests Jest sont disponibles dans `MOODCYCLE-VPS/packages/api/src/tests/`:

```bash
# Lancer tous les tests
npm test

# Tests spécifiques aux endpoints
npm test -- --testNamePattern="endpoints"
```

## 🚨 **Résolution de Problèmes**

### Problème : PM2 pointe vers une ancienne release

**Symptômes :**
- Endpoints retournent 404
- `pm2 show moodcycle-api` montre un chemin vers `/releases/YYYYMMDDHHMMSS/`

**Solution :**
```bash
./scripts/diagnose-pm2.sh  # Identifier le problème
./scripts/deploy-with-pm2-fix.sh  # Résoudre automatiquement
```

### Problème : Endpoints sécurisés ne fonctionnent pas

**Vérifications :**
1. `X-Device-ID` header présent
2. Middleware `deviceAuth` activé
3. Routes bien déclarées dans `server.js`

**Tests :**
```bash
./scripts/test-endpoints.sh
```

## 📞 **Support**

En cas de problème :
1. Lancer `./scripts/diagnose-pm2.sh`
2. Vérifier les logs : `ssh root@69.62.107.136 'pm2 logs moodcycle-api --lines 50'`
3. Redémarrer si nécessaire : `ssh root@69.62.107.136 'pm2 restart moodcycle-api'`

## 📚 **Références**

- [Documentation PM2](https://pm2.keymetrics.io/)
- [Guide de déploiement](../DEPLOIEMENT.md)
- [Architecture API](../packages/api/README.md) 