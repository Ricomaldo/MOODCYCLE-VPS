# Prompt Éditeur Web Mobile - Insights MoodCycle

Créer un éditeur web mobile-first pour validation de 240 insights MoodCycle par une éditrice.

## Architecture Projet
```
insight-editor/
├── index.html
├── style.css  
├── script.js
├── data/
│   └── insights.json (240 insights à valider)
└── progress/
    └── progress.json (état validation/reprendre travail)
```

## Fonctionnalités Requises

### Interface Mobile-First
- Design responsive optimisé téléphone
- Navigation tactile fluide
- Texte lisible sans zoom
- Boutons suffisamment grands

### Workflow Validation
- Affichage insight par insight (navigation séquentielle)
- Édition inline du contenu (textarea)
- 3 statuts par insight: "unread" / "editing" / "validated"
- Boutons: "Précédent" / "Suivant" / "Valider cet insight"
- Code couleur scores Jeza: 1-2=rouge, 3=orange, 4-5=vert

### Sauvegarde & Reprise
- Auto-save localStorage à chaque modification
- Reprise exacte où travail interrompu
- Export JSON final avec modifications
- Aucune perte données si fermeture navigateur

### Motivation & Progression
- Barre progression pourcentage (X/240 validés)
- Messages motivants selon avancement:
  - 0-25%: "Excellent début ! Continue !"
  - 26-50%: "Tu progresses bien !"
  - 51-75%: "Plus que la moitié !"
  - 76-99%: "Presque fini, courage !"
  - 100%: "Bravo ! Tous les insights validés !"

## Structure JSON Insights
```json
{
  "menstrual": [
    {
      "id": "M_symptoms_friendly_01",
      "content": "Texte insight à éditer...",
      "targetPreferences": ["symptoms"],
      "tone": "friendly",
      "phase": "menstrual", 
      "jezaApproval": 3,
      "status": "unread",
      "lastModified": null
    }
  ]
}
```

## Structure JSON Progress
```json
{
  "currentIndex": 0,
  "totalValidated": 0,
  "lastSession": "2025-01-01T10:30:00Z",
  "insights": {
    "M_symptoms_friendly_01": {
      "status": "validated",
      "content": "Contenu modifié...",
      "lastModified": "2025-01-01T10:30:00Z"
    }
  }
}
```

## Technologies
- HTML5 + CSS3 + JavaScript vanilla uniquement
- Aucune dépendance externe
- localStorage pour persistance
- Responsive design mobile-first

## Contraintes
- Utilisable via file:// ou serveur local
- Fonctionne hors ligne complet  
- Interface simple et intuitive
- Performance optimisée (240 insights)

Créer les 4 fichiers complets avec cette fonctionnalité.