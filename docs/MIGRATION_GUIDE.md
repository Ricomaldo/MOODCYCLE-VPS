# 🔄 Guide de Migration Git - Monorepo MoodCycle

> Étapes pour finaliser la migration vers le monorepo avec préservation de l'historique Git

## ✅ Structure complétée

La migration vers monorepo est **terminée** avec la structure suivante :

```
MoodCycle/
├── packages/
│   ├── app/           # ✅ Migré (ex-MoodCycleApp)
│   ├── api/           # ✅ Migré (ex-MoodCycleAPI)  
│   └── admin/         # 🆕 Prêt pour Lovable
├── docs/              # ✅ Documentation centralisée
├── archive/           # 📦 insightsEditor archivé
└── package.json       # ✅ Configuration monorepo
```

## 🔧 Finalisation Git

### Étape 1: Initialiser le dépôt monorepo

```bash
# Si pas déjà fait
git init
git add .
git commit -m "🎉 Initial monorepo structure

- Migrate MoodCycleApp → packages/app
- Migrate MoodCycleAPI → packages/api  
- Prepare packages/admin for Lovable
- Archive insightsEditor
- Setup npm workspaces"
```

### Étape 2: Configuration des branches

```bash
# Créer la branche develop
git checkout -b develop

# Créer la branche de sprint actuelle
git checkout -b feature/admin-mvp

# Revenir sur main pour le push initial
git checkout main
```

### Étape 3: Configurer le dépôt distant

```bash
# Ajouter le remote (remplacer URL par votre dépôt)
git remote add origin https://github.com/your-username/moodcycle.git

# Premier push
git push -u origin main

# Push des autres branches
git push -u origin develop
git push -u origin feature/admin-mvp
```

## 📋 Préservation de l'historique

### Option A: Historique simple (recommandée pour sprint)
L'historique commence avec la structure monorepo - **plus simple pour le développement actuel**.

### Option B: Historique complet (si nécessaire plus tard)
Si vous voulez préserver l'historique complet des projets individuels, utilisez `git subtree` :

```bash
# Exemple pour préserver l'historique App
git subtree add --prefix=packages/app https://github.com/your-username/MoodCycleApp.git main

# Exemple pour préserver l'historique API  
git subtree add --prefix=packages/api https://github.com/your-username/MoodCycleAPI.git main
```

## 🚀 Workflow actuel

### Branch active: `feature/admin-mvp`

```bash
git checkout feature/admin-mvp

# Votre développement Lovable
# Génération du projet dans packages/admin/
# Développement API endpoints
# Commits fréquents

git add .
git commit -m "feat(admin): Add Lovable generated admin interface"
git commit -m "feat(api): Add admin endpoints for user management"

# À la fin du sprint
git push origin feature/admin-mvp
# → PR vers develop
```

## 🔄 Scripts de développement

```bash
# Démarrer tout pour le développement admin
npm run start:all

# Tests des packages
npm run test

# Build complet
npm run build
```

## ✨ Prochaines étapes

1. **Maintenant**: Générer MoodCycleAdmin avec Lovable dans `packages/admin/`
2. **Sprint Admin**: Développer les endpoints API nécessaires
3. **Intégration**: Tests e2e entre Admin et API
4. **Production**: Déploiement des packages

---

**🎯 Monorepo prêt pour votre sprint Lovable de 6h ! 🚀**

*La structure est optimisée pour un développement rapide et une intégration fluide.* 