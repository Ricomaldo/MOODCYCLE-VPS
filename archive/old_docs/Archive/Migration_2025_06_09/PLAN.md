## 🗺️ SÉQUENÇAGE D'IMPLÉMENTATION - Suite

### **✅ PHASE 1 : FONDATIONS (TERMINÉE)**
- ✅ Écran âge créé (`375-age.jsx`)
- ✅ Store mis à jour avec `ageRange`
- ✅ Navigation intégrée
- ✅ Bonus : Avatar amélioré avec validation interactive

---

### **🎯 PHASE 2 : ALGORITHME DE MAPPING (EN COURS)**

#### **2.1 - Créer la configuration des personas**
```javascript
// config/persona-mapping.js
- Profils de référence des 5 personas (Emma, Laure, Sylvie, Christine, Clara)
- Coefficients de pondération ajustables
- Seuils de correspondance
```

#### **2.2 - Implémenter l'algorithme de scoring**
```javascript
// utils/personaMapping.js
- calculatePersonaScores(userData) → scores
- 5 fonctions individuelles : calculateEmmaScore(), etc.
- Logique de mapping basée sur implementation-guide.md
```

#### **2.3 - Intégrer dans le store**
```javascript
// stores/useOnboardingStore.js
- Ajouter section persona: { assigned, scores, confidence }
- Fonction calculateAndAssignPersona()
- Persistance automatique
```

#### **2.4 - Créer interface de debug**
```javascript
// components/DevNavigation/PersonaDebug.jsx
- Affichage scores détaillés
- Bouton recalcul manuel
- Validation empirique
```

---

### **🔄 PHASE 3 : MIGRATION INSIGHTS**

#### **3.1 - Enrichir la base existante**
```javascript
// data/insights.json → modifier structure
- Ajouter targetPersonas: ["emma", "clara"] à chaque insight
- Mapper intelligemment selon contenu + préférences existantes
- Garder targetPreferences en fallback
```

#### **3.2 - Nouvelle logique de sélection**
```javascript
// data/insights-personalized-v2.js
- getPersonalizedInsightV2(phase, persona, preferences, usedInsights)
- Priorité : persona → phase → préférences → anti-répétition
- Fallback intelligent si pas de match persona
```

---

### **🚀 PHASE 4 : BASCULE FINALE**

#### **4.1 - Modifier les appels**
```javascript
// app/(tabs)/home/index.jsx
- Remplacer getPersonalizedInsight par V2
- Utiliser persona calculé au lieu des préférences directes
- Tester le fonctionnement complet
```

#### **4.2 - Nettoyage**
```javascript
- Supprimer ancien système insights-personalized.js
- Nettoyer imports obsolètes
- Validation anti-répétition avec personas
```

---

## **🎯 PROCHAINE ÉTAPE IMMÉDIATE :**

**Commencer PHASE 2.1** : Créer `config/persona-mapping.js` avec :
- Les 5 profils de référence (selon implementation-guide.md)
- Coefficients de pondération configurables
- Structure modulaire pour tests A/B futurs

**Voulez-vous que je commence par la création du fichier de configuration des personas ?**