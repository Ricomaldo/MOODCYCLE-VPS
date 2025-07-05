# 🧪 Tests MoodCycle API

## 📋 **Vue d'ensemble**

Ce dossier contient tous les tests pour l'API MoodCycle, incluant les tests d'endpoints sécurisés, de performance et de fonctionnalité.

## 🗂️ **Structure des Tests**

```
tests/
├── README.md                           # Cette documentation
├── endpoints-security.test.js          # Tests de sécurité des endpoints
├── endpoints-performance.test.js       # Tests de performance
├── run-all-tests.js                   # Runner de tests existant
└── [autres tests existants...]
```

## 🔧 **Configuration**

### **Prérequis**
- Node.js 18+
- Jest installé (`npm install`)
- Accès réseau à l'API en production

### **Variables d'environnement**
```bash
# URL de l'API à tester (par défaut: production)
API_BASE_URL=https://moodcycle.irimwebforge.com

# Environnement de test
NODE_ENV=test
```

## 🚀 **Lancement des Tests**

### **Tests d'Endpoints (Jest)**

```bash
# Tous les tests d'endpoints
npm run test:endpoints-all

# Tests de sécurité uniquement
npm run test:endpoints

# Tests de performance uniquement
npm run test:performance
```

### **Tests Existants**

```bash
# Tous les tests existants
npm test

# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests spécifiques
npm run test:chat
npm run test:adaptive
```

### **Scripts Shell**

```bash
# Tests complets avec scripts shell
../../scripts/test-endpoints.sh

# Diagnostic PM2
../../scripts/diagnose-pm2.sh
```

## 📊 **Types de Tests**

### **1. Tests de Sécurité (`endpoints-security.test.js`)**

**Objectif :** Valider la sécurité des endpoints avec `deviceAuth`.

**Tests inclus :**
- ✅ Refus d'accès sans `X-Device-ID`
- ✅ Autorisation avec `X-Device-ID` valide
- ✅ Structure des données retournées
- ✅ Cohérence entre endpoints
- ✅ Validation des IDs uniques
- ✅ Headers appropriés

**Exemple d'exécution :**
```bash
npm run test:endpoints
```

### **2. Tests de Performance (`endpoints-performance.test.js`)**

**Objectif :** Valider les performances et la stabilité.

**Métriques testées :**
- ⚡ Temps de réponse individuels
- 🔄 Gestion de la charge concurrente
- 📊 Stabilité des performances
- 🚫 Rapidité des erreurs

**Seuils de performance :**
- Health: < 200ms
- Insights: < 1000ms
- Phases: < 500ms
- Closings: < 300ms
- Vignettes: < 800ms

**Exemple d'exécution :**
```bash
npm run test:performance
```

### **3. Tests Shell (`test-endpoints.sh`)**

**Objectif :** Tests complets avec curl et validation bash.

**Avantages :**
- Tests sans dépendances Node.js
- Validation en conditions réelles
- Intégration facile en CI/CD

## 📈 **Interprétation des Résultats**

### **Tests de Sécurité**

```
✅ PASS - GET /api/insights - REFUSE sans X-Device-ID
✅ PASS - GET /api/insights - AUTORISE avec X-Device-ID
```

- **PASS** : Test réussi
- **FAIL** : Test échoué (vérifier logs)

### **Tests de Performance**

```
🏥 Health check: 45ms (seuil: 200ms)
💡 Insights: 234ms (seuil: 1000ms)
🔄 3 requêtes insights concurrentes: 156.33ms/req
```

- **Temps < Seuil** : Performance excellente
- **Temps > Seuil** : Performance dégradée

### **Codes de Sortie**

- `0` : Tous les tests passent
- `1` : Au moins un test échoue

## 🔍 **Débogage**

### **Test qui échoue**

1. **Vérifier l'API :**
   ```bash
   curl -s "https://moodcycle.irimwebforge.com/api/health"
   ```

2. **Diagnostic PM2 :**
   ```bash
   ../../scripts/diagnose-pm2.sh
   ```

3. **Logs détaillés :**
   ```bash
   npm run test:endpoints -- --verbose
   ```

### **Performance dégradée**

1. **Vérifier la charge serveur :**
   ```bash
   ssh root@69.62.107.136 'top -n 1'
   ```

2. **Logs PM2 :**
   ```bash
   ssh root@69.62.107.136 'pm2 logs moodcycle-api --lines 50'
   ```

3. **Redémarrer si nécessaire :**
   ```bash
   ssh root@69.62.107.136 'pm2 restart moodcycle-api'
   ```

## 🤖 **Intégration CI/CD**

### **GitHub Actions (exemple)**

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test-endpoints:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:endpoints-all
        env:
          API_BASE_URL: https://moodcycle.irimwebforge.com
```

### **Tests en local avant déploiement**

```bash
# 1. Tests avant déploiement
npm run test:endpoints-all

# 2. Déploiement
../../scripts/deploy-with-pm2-fix.sh

# 3. Tests après déploiement
npm run test:endpoints-all
```

## 📚 **Ressources**

- [Documentation Jest](https://jestjs.io/docs/getting-started)
- [Supertest Guide](https://github.com/visionmedia/supertest)
- [Scripts de déploiement](../../scripts/README.md)
- [Guide PM2](../../../DEPLOIEMENT.md)

## 🆘 **Support**

En cas de problème :
1. Vérifier cette documentation
2. Lancer `../../scripts/diagnose-pm2.sh`
3. Consulter les logs PM2
4. Contacter l'équipe de développement