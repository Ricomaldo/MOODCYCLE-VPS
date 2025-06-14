# 🚀 Guide de Démarrage Rapide - InsightsEditor

## 📋 Prérequis

- **Python 3.8+** pour les scripts
- **Navigateur moderne** pour l'interface web
- **Terminal/Command line** pour l'exécution

## ⚡ Démarrage en 5 Minutes

### 1. 🏁 Lancement Immédiat

```bash
# Se placer dans le dossier web
cd web

# Démarrer le serveur local
python3 -m http.server 8000

# Ouvrir dans le navigateur
open http://localhost:8000/personas.html
```

### 2. 🧪 Vérification des Chemins

```bash
# Test de validation complet
python3 validate_project.py

# Test des chemins de données
open http://localhost:8000/../test_paths.html
```

## 🎭 Interfaces Disponibles

### Interface Personas (Recommandée)
- **URL** : `http://localhost:8000/personas.html`
- **Fonctionnalités** : 5 personas, preview temps réel
- **Données** : Format enrichi avec variantes

### Interface Legacy  
- **URL** : `http://localhost:8000/`
- **Fonctionnalités** : Éditeur classique
- **Données** : Format original

### Test des Chemins
- **URL** : `http://localhost:8000/../test_paths.html`
- **Utilité** : Diagnostic des connexions de données

## 🛠️ Utilisation des Scripts

### Migration des Données

```bash
cd tools

# Migration vers format personas
python3 core/migrate_to_personas.py \
    --input ../data/source/insights-original.json \
    --output ../data/working/personas-generated.json

# Validation de l'intégrité
python3 core/validate_integrity.py \
    --file ../data/working/personas-generated.json
```

### Installation des Dépendances

```bash
cd tools
pip install -r requirements.txt
```

## 📊 Données Disponibles

| Fichier | Localisation | Description |
|---------|--------------|-------------|
| **Personas (actuel)** | `data/working/personas-generated.json` | 890 variantes (5×178) |
| **Legacy validé** | `data/working/insights-validated.json` | 178 insights originaux |
| **Source originale** | `data/source/insights-original.json` | Données MoodCycle |
| **Compilation** | `data/source/moodcycle-menstrual-insights-compilation.json` | Base complète |

## 🔧 Résolution de Problèmes

### ❌ Erreur 404 sur les Données

**Problème** : Les scripts JavaScript ne trouvent pas les fichiers JSON

**Solution** :
```bash
# Vérifier la structure
ls -la data/working/

# Tester les chemins
open http://localhost:8000/../test_paths.html
```

### ❌ Interface ne se Charge Pas

**Problème** : Erreurs JavaScript dans la console

**Solutions** :
1. Vérifier que le serveur est lancé depuis `web/`
2. Ouvrir la console développeur (F12)
3. Vérifier les erreurs de chemins

### ❌ Données Personas Manquantes

**Problème** : Interface personas affiche format legacy

**Solution** :
```bash
cd tools
python3 core/migrate_to_personas.py \
    --input ../data/working/insights-validated.json \
    --output ../data/working/personas-generated.json
```

## 📋 Checklist de Validation

### ✅ Structure
- [ ] Dossiers présents (docs, tools, web, data, tests)
- [ ] Scripts dans tools/core/
- [ ] Interfaces dans web/
- [ ] Données dans data/working/

### ✅ Fonctionnalités
- [ ] Serveur web démarre sans erreur
- [ ] Interface personas charge les données
- [ ] Navigation entre insights fonctionne
- [ ] Sélection persona met à jour l'affichage
- [ ] Validation d'insight sauvegarde correctement

### ✅ Données
- [ ] Fichiers JSON valides
- [ ] Format personas détecté
- [ ] 178 insights présents
- [ ] 5 variantes par insight

## 🎯 Prochaines Étapes

### Utilisation Normale
1. **Édition** : Modifier les insights via l'interface
2. **Validation** : Valider insight par insight
3. **Export** : Télécharger les modifications
4. **Sauvegarde** : Sauvegarder régulièrement

### Développement
1. **Tests** : Ajouter des tests unitaires
2. **CI/CD** : Automatiser la validation
3. **Monitoring** : Ajouter des logs
4. **Performance** : Optimiser le chargement

## 📞 Support

### 🔍 Diagnostic Automatique
```bash
python3 validate_project.py
```

### 📖 Documentation
- **Architecture** : [`ARCHITECTURE.md`](../ARCHITECTURE.md)
- **Réorganisation** : [`REORGANIZATION.md`](REORGANIZATION.md)
- **Changelog** : [`CHANGELOG.md`](CHANGELOG.md)

### 🐛 Debugging
1. **Logs navigateur** : F12 → Console
2. **Test chemins** : `test_paths.html`
3. **Validation structure** : `validate_project.py`

---

**Temps de setup** : ~5 minutes  
**Complexité** : Débutant  
**Status** : ✅ Production Ready 