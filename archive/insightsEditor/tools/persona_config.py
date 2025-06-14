"""
Configuration des personas pour le système InsightsEditor.

Ce module centralise toutes les définitions des personas utilisées 
pour la personnalisation des insights menstruels.
"""

from typing import Dict, List, Any

# Configuration des 5 personas principales
PERSONAS: Dict[str, Dict[str, Any]] = {
    "emma": {
        "name": "Emma",
        "description": "Découverte (16-25 ans)",
        "icon": "👩",
        "age_range": "16-25",
        "characteristics": [
            "Découverte de son cycle",
            "Apprentissage et exploration", 
            "Besoin de réassurance",
            "Vocabulaire accessible"
        ],
        "style_markers": [
            "normal", "apprend", "découvre", "explore",
            "ressent", "nouvelle", "première fois"
        ],
        "transformations": {
            "formal_to_casual": True,
            "add_encouragement": True,
            "simplify_terms": True,
            "add_learning_context": True
        },
        "tone": "encourageant et éducatif",
        "vocabulary_level": "accessible"
    },
    
    "laure": {
        "name": "Laure", 
        "description": "Efficacité (25-35 ans)",
        "icon": "👩‍💼",
        "age_range": "25-35",
        "characteristics": [
            "Vie active et professionnelle",
            "Recherche d'efficacité",
            "Gestion du temps optimisée",
            "Solutions pratiques"
        ],
        "style_markers": [
            "optimise", "planifie", "organise", "efficace",
            "productif", "stratégie", "méthode", "routine"
        ],
        "transformations": {
            "add_time_management": True,
            "focus_on_productivity": True,
            "practical_solutions": True,
            "goal_oriented": True
        },
        "tone": "pragmatique et orienté action",
        "vocabulary_level": "professionnel"
    },
    
    "sylvie": {
        "name": "Sylvie",
        "description": "Transition (35-45 ans)", 
        "icon": "👩‍🦳",
        "age_range": "35-45",
        "characteristics": [
            "Période de transition",
            "Changements corporels",
            "Adaptation nécessaire",
            "Expérience accumulée"
        ],
        "style_markers": [
            "adapte", "ajuste", "évolue", "change",
            "transition", "transformation", "nouveauté"
        ],
        "transformations": {
            "acknowledge_changes": True,
            "emphasize_adaptation": True,
            "validate_experience": True,
            "support_transition": True
        },
        "tone": "compréhensif et adaptatif",
        "vocabulary_level": "expérimenté"
    },
    
    "christine": {
        "name": "Christine",
        "description": "Sagesse (45+ ans)",
        "icon": "👵",
        "age_range": "45+",
        "characteristics": [
            "Sagesse et expérience",
            "Approche holistique",
            "Spiritualité et bien-être",
            "Transmission de savoir"
        ],
        "style_markers": [
            "sagesse", "expérience", "équilibre", "harmonie",
            "spirituel", "profond", "essence", "plénitude"
        ],
        "transformations": {
            "add_wisdom_perspective": True,
            "holistic_approach": True,
            "spiritual_elements": True,
            "long_term_view": True
        },
        "tone": "sage et bienveillant",
        "vocabulary_level": "riche et nuancé"
    },
    
    "clara": {
        "name": "Clara",
        "description": "Scientifique",
        "icon": "👩‍🔬",
        "age_range": "25-45",
        "characteristics": [
            "Approche analytique",
            "Précision scientifique",
            "Données et recherche",
            "Méthode rigoureuse"
        ],
        "style_markers": [
            "analyse", "mesure", "observe", "données",
            "recherche", "étude", "précis", "objectif"
        ],
        "transformations": {
            "add_scientific_precision": True,
            "include_data_references": True,
            "analytical_approach": True,
            "evidence_based": True
        },
        "tone": "précis et analytique",
        "vocabulary_level": "technique et scientifique"
    }
}

# Règles de validation par persona
VALIDATION_RULES: Dict[str, Dict[str, Any]] = {
    "emma": {
        "required_markers": ["normal", "apprend"],
        "forbidden_words": ["complexe", "technique", "avancé"],
        "min_encouragement": 1,
        "max_length": 200
    },
    "laure": {
        "required_markers": ["efficace", "optimise"],
        "required_elements": ["action", "méthode"],
        "focus_keywords": ["productivité", "organisation"],
        "max_length": 180
    },
    "sylvie": {
        "required_markers": ["adapte", "évolue"],
        "transition_keywords": ["changement", "nouvelle"],
        "max_length": 190
    },
    "christine": {
        "required_markers": ["sagesse", "équilibre"],
        "spiritual_elements": True,
        "min_depth": 2,
        "max_length": 220
    },
    "clara": {
        "required_markers": ["analyse", "données"],
        "scientific_terms": True,
        "precision_level": "high",
        "max_length": 200
    }
}

# Configuration des exports
EXPORT_CONFIG: Dict[str, Any] = {
    "include_base_content": True,
    "validate_personas": True,
    "required_fields": [
        "id", "baseContent", "personaVariants", 
        "targetPersonas", "status", "enrichedBy"
    ],
    "version": "2.0",
    "format": "personas-v2"
}

def get_persona_config(persona_id: str) -> Dict[str, Any]:
    """Récupère la configuration d'un persona spécifique."""
    return PERSONAS.get(persona_id, {})

def get_all_persona_ids() -> List[str]:
    """Retourne la liste de tous les IDs de personas."""
    return list(PERSONAS.keys())

def validate_persona_id(persona_id: str) -> bool:
    """Valide qu'un ID de persona existe."""
    return persona_id in PERSONAS 