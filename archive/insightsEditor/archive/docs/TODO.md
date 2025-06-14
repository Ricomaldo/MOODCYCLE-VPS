# 📋 TODO - InsightsEditor V1 - NETTOYAGE PRIORITAIRE

## 🚨 SITUATION ACTUELLE
- **Interface** : `web/index.html` est **PARFAITE** ✅ 
- **Vrai problème** : BORDEL dans les données et scripts obsolètes 💀
- **Risque** : Le prochain dev va tout casser avec ce chaos
- **Priorité** : NETTOYAGE DRASTIQUE avant tout développement

---

## 🎯 OBJECTIF V1 - SIMPLIFICATION MAXIMALE

**GARDER** :
- `web/index.html` (interface parfaite)
- `insights_validated_2025-06-09.json` (travail Jeza)  
- Export simple vers format final

**SUPPRIMER** :
- Fichiers redondants/obsolètes (90% des données actuelles)
- Scripts legacy qui ne marchent pas
- Toute la complexité inutile

---

## 📋 TÂCHES PRIORITAIRES - NETTOYAGE

### 🔥 **CRITIQUE - NETTOYER LE BORDEL** ⏰ **2h**

#### 1. **Audit Complet des Données** ⏰ **30min**
- [ ] **Analyser** tous les JSON :
  - `data/source/insights-original.json` vs `moodcycle-menstrual-insights-compilation.json` (identiques ?)
  - `data/working/personas-generated.json` vs `data/exports/insights_personas_v2.json` (doublons ?)
  - `data/working/insights-validated.json` vs `insights_validated_2025-06-09.json` (lequel garder ?)
- [ ] **Identifier** LE fichier source unique à garder
- [ ] **Documenter** pourquoi chaque fichier existe

#### 2. **Nettoyage Brutal des Données** ⏰ **45min**
- [ ] **Créer** `data/archive/` pour tout l'historique
- [ ] **Déplacer** vers archive :
  - `data/source/` (complet - garder pour référence)
  - `data/working/personas-generated.json` (variants bugués)
  - `data/exports/insights_personas_v2.json` (variants identiques)
- [ ] **Garder UNIQUEMENT** :
  - `insights_validated_2025-06-09.json` (travail Jeza)
  - `insights.example.json` (format cible)
- [ ] **Créer** `data/current/` avec SEULEMENT les fichiers utiles

#### 3. **Nettoyage Scripts Obsolètes** ⏰ **45min**
- [ ] **Analyser** `tools/legacy/` : Quels scripts servent encore ?
  - `final_balance_optimized.py` → Archive
  - `enhance_compilation.py` → Archive  
  - `complete_consolidate.py` → Archive
  - (tous les autres) → Archive
- [ ] **Analyser** `tools/core/` :
  - `migrate_to_personas.py` → Corriger OU remplacer
  - `validate_integrity.py` → Garder si utile
- [ ] **Créer** `tools/active/` avec SEULEMENT les scripts fonctionnels
- [ ] **Archiver** `tools/legacy/` complètement

### 🟡 **SIMPLIFICATION CODE** ⏰ **2h**

#### 4. **Script Export Simple et Fonctionnel** ⏰ **1h30**
- [ ] **Créer** `tools/active/simple_export.py` :
  ```python
  # INPUT: insights_validated_2025-06-09.json (Jeza)
  # OUTPUT: insights_export_YYYY-MM-DD.json (format final)
  # FONCTION: Génération 5 variants VRAIMENT différents
  ```
- [ ] **Tester** que les variants sont différents (pas comme actuellement)
- [ ] **Valider** le format de sortie correspond à `insights.example.json`

#### 5. **Interface → Export Integration** ⏰ **30min**
- [ ] **Modifier** `web/index.html` pour :
  - Charger `insights_validated_2025-06-09.json` 
  - Export direct vers format final
  - Bouton "Export Final" → télécharge `insights_export_YYYY-MM-DD.json`
- [ ] **Supprimer** toute référence aux fichiers obsolètes

### 🟢 **DOCUMENTATION SIMPLE** ⏰ **1h**

#### 6. **README.md Ultra-Simple** ⏰ **30min**
- [ ] **Réécrire** avec workflow simplifié :
  ```markdown
  ## Fichiers Importants
  - insights_validated_2025-06-09.json (source Jeza)
  - web/index.html (interface)
  - tools/active/simple_export.py (export)

  ## Workflow
  1. cd web && python -m http.server 8000
  2. Éditer via http://localhost:8000
  3. Export → insights_export_YYYY-MM-DD.json
  ```

#### 7. **Structure Projet Finale** ⏰ **30min**
- [ ] **Documenter** la structure finale :
  ```
  insightsEditor/
  ├── insights_validated_2025-06-09.json  # SOURCE UNIQUE
  ├── web/index.html                       # INTERFACE PARFAITE  
  ├── tools/active/simple_export.py       # EXPORT SIMPLE
  └── data/
      ├── current/                         # Fichiers actifs
      └── archive/                         # Historique/Legacy
  ```

---

## 🗓️ PLANNING URGENT - 1 JOUR

### **MATIN** (3h) - Nettoyage Brutal
- Audit données (30min) ✅
- Archivage masse (1h) ✅  
- Nettoyage scripts (1h) ✅
- Structure simple (30min) ✅

### **APRÈS-MIDI** (2h) - Fonctionnel Simple
- Script export corrigé (1h30) ✅
- Integration interface (30min) ✅

**→ RÉSULTAT : Projet PROPRE, SIMPLE, FONCTIONNEL**

---

## ⚠️ RÈGLES DE NETTOYAGE

1. **RIEN ne se supprime** → Tout va dans `archive/`
2. **Garder SEULEMENT** ce qui est utilisé par l'interface actuelle
3. **UN SEUL fichier source** : `insights_validated_2025-06-09.json`
4. **UN SEUL script export** : `tools/active/simple_export.py`
5. **Interface index.html** ne bouge PAS (elle est parfaite)

---

## 🎯 CRITÈRES DE SUCCÈS

- [ ] **Data** : 1 fichier source, 1 fichier cible, stop
- [ ] **Scripts** : 1 script export fonctionnel, stop  
- [ ] **Interface** : Marche avec les fichiers propres
- [ ] **Documentation** : 5 lignes max dans README
- [ ] **Workflow** : Démarre en 30 secondes, export en 1 clic
- [ ] **Maintenance** : Le prochain dev comprend en 5 minutes

---

## 📞 TESTS DE VALIDATION

```bash
# Test 1 : Structure simple
ls -la  # → Doit voir seulement les fichiers essentiels

# Test 2 : Interface fonctionne
cd web && python -m http.server 8000
# → http://localhost:8000 doit marcher immédiatement

# Test 3 : Export fonctionne  
python tools/active/simple_export.py
# → Doit générer insights_export_2025-XX-XX.json

# Test 4 : Variants différents
grep -A 5 "emma" insights_export_*.json
grep -A 5 "clara" insights_export_*.json
# → Doit montrer des textes DIFFÉRENTS
```

---

**FOCUS** : Préparation pour le prochain dev  
**RÈGLE D'OR** : Simple = Maintenable = Pas de bugs  
**DEADLINE** : 1 jour MAX

---

## 🎯 CRITÈRES DE SUCCÈS V1

- [ ] Jeza peut se connecter facilement via WiFi
- [ ] Interface simple et responsive (tablette)
- [ ] Génération variants personas VRAIMENT différents
- [ ] Export fichier horodaté fonctionnel
- [ ] Documentation à jour et claire
- [ ] Workflow testé de bout en bout
- [ ] Pas de fichiers redondants/confus
- [ ] Intégration projet final fluide

---

## 📞 SUPPORT MIRANDA

### Connexion WiFi
```bash
# Sur ton Mac/PC
ifconfig | grep "inet "
# → Note l'IP : 192.168.1.X

# Partage : http://192.168.1.X:8000/editor-simple.html
```

### Problèmes Fréquents
- **Connexion impossible** : Vérifier firewall
- **Interface lente** : Vérifier WiFi/4G
- **Export ne fonctionne pas** : Vérifier localStorage/downloads
- **Variants identiques** : Bug script → à corriger priorité 1

---

*Ce TODO sera mis à jour au fur et à mesure des avancées* 📝 