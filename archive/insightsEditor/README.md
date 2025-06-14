# 🎭 InsightsEditor - Éditeur pour Jeza

> Éditeur d'insights menstruels avec génération automatique de variants personas

## 🚀 Démarrage

```bash
# Démarrer le serveur
cd web
python3 -m http.server 8000

# Obtenir l'IP locale pour Jeza
ifconfig | grep "inet " | grep -v 127.0.0.1
# → Connexion : http://IP_LOCALE:8000
```

## 📁 Structure

```
insightsEditor/
├── web/                           # Interface d'édition
├── tools/                         # Scripts d'export et validation
│   ├── simple_export.py           # Export avec variants personas  
│   ├── persona_config.py          # Configuration 5 personas
│   └── validate_integrity.py      # Validation données
├── data/                          # Données organisées
└── archive/                       # Historique
```

## 🎭 Personas

5 variants automatiques par insight :

| Persona | Âge | Style |
|---------|-----|-------|
| Emma | 16-25 | Découverte |
| Laure | 25-35 | Efficacité |
| Sylvie | 35-45 | Transition |
| Christine | 45+ | Sagesse |
| Clara | Tous | Scientifique |

## 🔄 Utilisation

### 1. Édition
- Interface web : `http://IP_LOCALE:8000`
- Édition directe du `source.json`

### 2. Export
```bash
python3 tools/simple_export.py
# Génère : insights_export_YYYY-MM-DD.json (890 variants)
```

### 3. Validation
```bash
python3 tools/validate_integrity.py source.json
```

## 📊 Données

- **178 insights** dans `source.json`
- **4 phases** : menstrual, follicular, ovulatory, luteal
- **6 catégories** : symptoms, moods, phyto, phases, lithotherapy, rituals
- **890 variants** après export (5 × 178)

---

**Workflow** : WiFi → Édition → Export → Intégration app