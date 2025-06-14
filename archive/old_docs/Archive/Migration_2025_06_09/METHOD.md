## Stratégie de Nettoyage avec Cursor

### 1. Audit de l'Existant (15 min)

**Prompt pour Cursor :**
```
AUDIT : Analyse l'implémentation actuelle des insights personnalisés.

Fichiers à examiner :
- stores/useOnboardingStore.js  
- data/insights-personalized.js
- app/(tabs)/home/index.jsx
- Tout appel à getPersonalizedInsight()

QUESTIONS :
1. Où est utilisée la logique de sélection par préférences ?
2. Y a-t-il des imports/exports à nettoyer ?
3. Quels sont les points d'entrée à modifier ?
4. Y a-t-il des fonctions obsolètes à supprimer ?

FORMAT : Liste précise des modifications requises
```

### 2. Plan de Refactoring (20 min)

**Prompt pour Cursor :**
```
REFACTORING PLAN : Prépare la migration vers système personas.

OBJECTIF : Remplacer sélection par préférences par sélection par personas

ÉTAPES :
1. Identifier toutes les fonctions qui utilisent 'preferences' pour sélection
2. Marquer comme @deprecated les fonctions obsolètes
3. Créer structure persona dans useOnboardingStore
4. Proposer migration progressive (ancien + nouveau en parallèle)

CONTRAINTE : Ne pas casser l'app pendant la migration
```

### 3. Migration Progressive (Phase 1)

**Prompt pour Cursor :**
```
IMPLÉMENTATION PHASE 1 : Ajouter système personas sans casser l'existant

ACTIONS :
1. Ajouter section 'persona' dans useOnboardingStore
2. Créer config/persona-mapping.js avec données de simulation
3. Implémenter calculatePersonaScores() dans utils/
4. Ajouter calculateAndAssignPersona() dans store
5. Créer PersonaDebug dans DevNavigation

RÈGLE : Garder l'ancien système fonctionnel en parallèle
CODE : Implémentation complète demandée
```

### 4. Test et Validation (Phase 1 bis)

**Prompt pour Cursor :**
```
TEST PERSONAS : Valider l'algorithme avec données simulées

DONNÉES TEST : 
- Emma: {journeyChoice: 'body_disconnect', ageRange: '18-25', preferences: {symptoms: 2, moods: 4...}}
- Laure: {journeyChoice: 'hiding_nature', ageRange: '26-40', preferences: {symptoms: 3, moods: 4...}}
[etc. pour les 5 personas]

ACTIONS :
1. Créer fonction testPersonaMapping()
2. Injecter les 5 profils simulés
3. Vérifier que chaque profil = bon persona assigné
4. Afficher scores détaillés pour validation
```

### 5. Migration des Insights (Phase 2)

**Prompt pour Cursor :**
```
MIGRATION INSIGHTS : Enrichir base existante avec targetPersonas

STRATÉGIE : Analyser contenu + préférences pour mapper vers personas

LOGIQUE :
- symptoms + tone friendly → emma, sylvie
- phases + tone professional → laure  
- lithotherapy + tone inspiring → christine
- rituels + expertise → clara

ACTION : 
1. Analyser les 178 insights existants
2. Ajouter champ targetPersonas intelligemment
3. Créer nouvelle fonction getPersonalizedInsightV2()
4. Garder ancien système en fallback
```

### 6. Bascule et Nettoyage Final (Phase 3)

**Prompt pour Cursor :**
```
FINALISATION : Basculer vers nouveau système et nettoyer

ACTIONS :
1. Remplacer appels getPersonalizedInsight() par V2
2. Tester fonctionnement complet
3. Supprimer code obsolète (ancien système)
4. Mettre à jour imports/exports
5. Validation anti-répétition avec personas

VALIDATION : App fonctionnelle avec vraie personnalisation personas
```

## Avantages de cette Approche

- **Migration progressive** : Pas de casse pendant le dev
- **Tests continus** : Validation à chaque étape  
- **Rollback possible** : Ancien système garde comme backup
- **Traçabilité** : Debug facile avec PersonaDebug

**Prêt à commencer par l'audit ?** Cursor va identifier précisément ce qu'il faut nettoyer.