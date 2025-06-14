# 🔄 WORKFLOW - Processus de Travail MoodCycle

*Processus Git, déploiement et collaboration pour Sprint MVP*

## 🌿 Stratégie Branches Git

### **Structure Mono-Repo Validée**
```
MoodCycle/
├── packages/app/     # React Native (dépôt sync)
├── packages/api/     # Node.js (local → push weekend)
└── packages/admin/   # Lovable (nouveau weekend)
```

### **Branches Principales**
```bash
main                  # Production stable
├── develop          # Intégration continue
├── feature/admin-mvp # Sprint 1 - Admin Lovable + API endpoints
├── feature/app-notebook # Sprint 2 - Finalisation app
└── hotfix/*         # Corrections urgentes
```

### **Workflow Sprint Actuel**
```bash
# Sprint 1 - Admin MVP Weekend
git checkout -b feature/admin-mvp

# Samedi - API endpoints
cd packages/api
git add src/controllers/adminController.js
git commit -m "feat: admin CRUD insights endpoints"

# Samedi soir - Interface Lovable  
cd ../packages/admin
git add . 
git commit -m "feat: Lovable admin interface MVP"

# Dimanche - Intégration
git commit -m "feat: connexion Lovable → API Express"
git push origin feature/admin-mvp
```

## 👩‍⚕️ Workflow Jeza (Contenu Thérapeutique)

### **État Actuel**
- ✅ **178 insights génériques** validés et approuvés
- ⏳ **Variantage 5 personas** en attente d'interface admin
- 🎯 **Objectif Sprint 1** : Déblocage complet workflow Jeza

### **Processus Validation Contenu**
```
1. Jeza édite insights via interface admin
   ├── Version Emma (novice curieuse)
   ├── Version Laure (professionnelle)  
   ├── Version Sylvie (transition)
   ├── Version Christine (sage)
   └── Version Clara (analytique)

2. Preview automatique formule rendu
   [intro phase variantée] + [prenom] + [insight varianté] + [closing varianté]

3. Sauvegarde automatique API
   POST /api/admin/insights

4. Mise à disposition app
   GET /api/insights (avec fallback local)
```

### **Workflow Jeza Post-Admin**
```bash
# Jeza accède via admin.irimwebforge.com
# Auth simple : login/password partagé

1. Login interface admin Lovable
2. Sélection insight de base (1-178)
3. Édition 5 variants personas
4. Preview rendu final app
5. Validation + Sauvegarde API
6. Répéter pour 178 insights → 890 variants
```

### **Timeline Jeza (Post Sprint 1)**
- **Semaine 1** : Prise en main interface + 20 premiers insights
- **Semaine 2-3** : Variantage accéléré (50 insights/semaine)
- **Semaine 4** : Finalisation + validation cohérence globale

## 🚀 Processus de Déploiement

### **Environnements**
```
Développement Local:
├── App: Expo Go + simulateur iOS
├── API: localhost:4000 (npm run dev)
└── Admin: localhost:3000 (Lovable)

Production VPS Hostinger:
├── App: Reste local (pas de déploiement Sprint 1)
├── API: PM2 moodcycle-api (port 4000)
└── Admin: moodcycle.irimwebforge.com (statique)
```

### **Déploiement API Production**
```bash
# Connexion VPS Hostinger
ssh user@69.62.107.136
cd /srv/www/internal/moodcycle/api/current

# Deploy API après Sprint 1
git pull origin feature/admin-mvp
npm install --production
pm2 restart moodcycle-api

# Variables environnement production
CLAUDE_API_KEY=sk-ant-api03-***
PORT=4000
NODE_ENV=production
```

### **Déploiement Admin Lovable**
```bash
# Build local
cd packages/admin
npm run build

# Deploy automatique via Git hooks
git push production main
# → Deploy vers /srv/www/internal/moodcycle/admin/current

# Configuration API endpoint
REACT_APP_API_URL=https://moodcycle.irimwebforge.com/api
```

### **App React Native (Sprint 2)**
```bash
# Configuration API production
cd packages/app
echo "REACT_APP_API_URL=https://moodcycle.irimwebforge.com/api" > .env.production

# Build test
npx expo build:ios --release-channel production-test
```

## 🧪 Tests et Validation

### **Tests Sprint 1 - Admin MVP**
```bash
# Tests API endpoints
curl -X GET http://localhost:4000/api/admin/insights
curl -X POST http://localhost:4000/api/admin/insights \
  -H "Authorization: Bearer test-token" \
  -d '{"insight": "test", "persona": "emma"}'

# Tests interface Lovable
# Test manuel: création/édition insight
# Test workflow: 1 insight complet → 5 variants
```

### **Tests Sprint 2 - App Finalisée**  
```bash
# Tests bout-en-bout
cd packages/app

# Test connexion API insights
npm run test:insights

# Test écran Carnet
npm run test:notebook

# Test personas + insights personnalisés
npm run test:personalization
```

### **Validation Utilisatrices (Sprint 3)**
```
Groupe test enthousiaste (pré-identifié):
├── 5-8 femmes volontaires  
├── Test via TestFlight iOS
├── Feedback questionnaire structuré
├── Session observation UX (optionnel)
└── Itérations selon retours
```

### **Critères de Validation MVP**
- [ ] Jeza peut créer 890 insights via admin (5 × 178)
- [ ] App récupère insights personnalisés API + fallback
- [ ] Écran Carnet fonctionnel + sauvegarde AsyncStorage
- [ ] Test utilisatrices concluant (satisfaction > 4/5)
- [ ] Prêt soumission App Store (guidelines Apple respectées)

## 📊 Métriques & Suivi

### **Sprint 1 - Admin MVP**
```
Objectifs mesurables:
├── API endpoints opérationnels (4/4)
├── Interface admin fonctionnelle (100%)
├── Workflow Jeza testé (1 insight complet)
└── Temps total ≤ 9h (6h samedi + 3h dimanche)
```

### **Sprint 2 - App MVP**
```
Objectifs mesurables:
├── Écran Carnet implémenté
├── 890 insights disponibles via API
├── Tests bout-en-bout validés  
└── Performance app maintenue
```

### **Sprint 3 - Tests & Production**
```
Objectifs mesurables:
├── Groupe test recruté (5+ utilisatrices)
├── Feedback positif (≥4/5 satisfaction)
├── Guidelines Apple respectées
└── Soumission App Store réalisée
```

## 🔧 Outils & Commandes

### **Commandes Essentielles**
```bash
# Démarrage développement
cd MoodCycle

# Commandes disponibles (package.json racine)
npm start           # Lance l'app mobile
npm run start:api   # Lance l'API en dev
npm run start:admin # Lance l'admin (après Lovable)
npm run start:all   # Lance API + Admin
npm run build       # Build tous les packages
npm run test        # Test tous les packages

# Développement par package
cd packages/app && npm start
cd packages/api && npm run dev
cd packages/admin && npm run dev
```

### **Debug & Monitoring**
```bash
# Logs API production
ssh user@69.62.107.136 "pm2 logs moodcycle-api"

# Status PM2
ssh user@69.62.107.136 "pm2 status"

# Debug app locale
cd packages/app && npx expo start --debug

# Monitoring admin (Nginx logs)
ssh user@69.62.107.136 "tail -f /var/log/nginx/access.log"
```

---

*Workflow optimisé pour Sprint MVP weekend - Admin Lovable + API Express + Déblocage Jeza*