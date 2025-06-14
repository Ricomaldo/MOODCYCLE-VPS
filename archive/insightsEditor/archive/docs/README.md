# 🎯 InsightsEditor - Migration Système Personas

## Vue d'ensemble du Projet

Ce projet gère la migration de la base d'insights MoodCycle vers un système enrichi avec **5 personas** pour une personnalisation avancée des conseils menstruels.

## 📁 Structure du Projet

```
insightsEditor/
├── insights_generator/          # 🔧 Outils de génération et migration
│   ├── moodcycle-menstrual-insights-compilation.json  # Base originale
│   ├── final_balance_optimized.py                     # Générateur optimisé
│   ├── enhance_compilation.py                         # Enrichissement
│   └── migrate_to_personas.py                         # 🆕 Script de migration
├── data/                        # 📊 Données pour l'éditeur web
│   ├── insights.json                                  # Version courante
│   └── insights_validated_2025-06-09.json            # Version éditée (176/178)
├── index.html                   # 🌐 Éditeur web
├── script.js                    # Logic de l'éditeur
└── style.css                    # Styles
```

## 🎭 Les 5 Personas

| Persona | Profil | Style | Vocabulaire |
|---------|--------|-------|------------|
| **Emma** | 16-25 ans, découverte | Encourageant, découverte | Accessible, bienveillant |
| **Laure** | 25-35 ans, active | Efficacité, planning | Structuré, orienté action |
| **Sylvie** | 35-45 ans, transition | Adaptation, changement | Évolutif, compréhensif |
| **Christine** | 45+ ans, sagesse | Spiritualité, transmission | Poétique, inspirant |
| **Clara** | Tous âges, scientifique | Précision, analyse | Technique, optimisé |

## 🔄 Évolution de la Structure

### Structure Actuelle
```json
{
  "menstrual": {
    "symptoms": [
      {
        "id": "M_symptoms_friendly_01",
        "content": "Tes crampes te parlent...",
        "targetPreferences": ["symptoms"],
        "tone": "friendly",
        "phase": "menstrual",
        "jezaApproval": 3
      }
    ]
  }
}
```

### Structure Cible (Personas)
```json
{
  "menstrual": [
    {
      "id": "M_symptoms_friendly_01",
      "baseContent": "Tes crampes te parlent...",
      "personaVariants": {
        "emma": "Tes crampes te parlent aujourd'hui ! 💕 C'est normal, ton corps apprend...",
        "laure": "Tes crampes signalent une phase importante. 💕 Optimise ta journée...",
        "sylvie": "Ces crampes sont un signal de ton corps en transition...",
        "christine": "Tes crampes portent la sagesse de tes cycles passés...",
        "clara": "Tes crampes indiquent le processus physiologique actuel..."
      },
      "targetPersonas": ["emma", "laure", "sylvie", "christine", "clara"],
      "targetPreferences": ["symptoms"],
      "tone": "friendly",
      "phase": "menstrual",
      "jezaApproval": 4,
      "status": "enriched",
      "lastModified": "2025-06-09T15:30:00.000Z",
      "enrichedBy": "persona-system-v2"
    }
  ]
}
```

## 🚀 Roadmap de Migration

### Phase 1 - Infrastructure ✅
- [x] Analyse de l'existant (178 insights, 176 validés)
- [x] Documentation du projet
- [x] Script de migration `migrate_to_personas.py`

### Phase 2 - Migration des Données ✅
- [x] Transformation structure plate → personas
- [x] Génération automatique des 5 variantes par insight
- [x] Mise à jour scores Jeza (personnalisation = +1 point)
- [x] Tests de cohérence

### Phase 3 - Adaptation Éditeur ✅
- [x] Support dual-format (ancien/nouveau)
- [x] Interface de sélection persona
- [x] Mode preview par persona
- [x] Export nouvelle structure

### Phase 4 - Finalisation
- [ ] Migration complète base de données
- [ ] Tests utilisateur
- [ ] Documentation finale

## 🛠️ Scripts Utilitaires

### Migration
```bash
cd insights_generator
python migrate_to_personas.py --input data/insights_validated_2025-06-09.json --output data/insights_personas_v2.json
```

### Vérification
```bash
python check_personas_integrity.py --file data/insights_personas_v2.json
```

## 📊 Métriques Actuelles

- **Total insights**: 178
- **Insights validés**: 176 (98.9%)
- **Phases couvertes**: 4 (menstrual, follicular, ovulatory, luteal)
- **Types de contenu**: 6 (symptoms, moods, phyto, phases, lithotherapy, rituals)
- **Tons disponibles**: 3 (friendly, professional, inspiring)

## 🎯 Objectifs Post-Migration

- **5 variantes** par insight = 890 contenus personnalisés
- **Sélection intelligente** par persona utilisateur
- **Scores Jeza** améliorés (personnalisation)
- **Compatibilité ascendante** maintenue

## 🔧 Développement

### Environnement
- Python 3.8+
- JavaScript ES6+
- JSON pour stockage données

### Tests
```bash
# Test de migration
python -m pytest tests/test_migration.py

# Test de cohérence
python check_compilation.py
```

---

*Projet maintenu par l'équipe InsightsEditor - Migration Personas v2* 