#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Migration Script - Structure Personas v2
==========================================

Transforme la base d'insights MoodCycle vers le nouveau format avec 5 personas.
Génère automatiquement les variantes personnalisées pour chaque insight.

Usage:
    python migrate_to_personas.py --input ../data/insights_validated_2025-06-09.json --output ../data/insights_personas_v2.json

Author: InsightsEditor Migration Team
Version: 2.0
Date: 2025-06-09
"""

import json
import argparse
import re
from datetime import datetime
from pathlib import Path

# Configuration des personas
PERSONA_PROFILES = {
    "emma": {
        "markers": ["💕", "normal", "apprend", "découverte"],
        "replacements": {
            "Ton corps fait un travail incroyable": "C'est normal, ton corps apprend à communiquer avec toi",
            "processus physiologiques": "ce que vit ton corps",
            "variations hormonales": "les changements dans ton corps",
            "Tu mérites": "Tu apprends à te faire confiance",
            "système": "corps"
        },
        "prefixes": {
            "friendly": "Hey ! 💕 C'est normal que ",
            "professional": "Durant cette phase d'apprentissage, ",
            "inspiring": "✨ Ton corps t'enseigne "
        }
    },
    "laure": {
        "markers": ["efficacité", "optimise", "planning"],
        "replacements": {
            "Prends soin de toi": "Intègre cette pause bien-être dans ton planning", 
            "Un bon coussin": "Un coussin ergonomique",
            "écoute ton corps": "optimise ta récupération",
            "Respire": "Optimise ta respiration",
            "Tu mérites": "C'est un investissement dans ta productivité"
        },
        "prefixes": {
            "friendly": "Pour optimiser ta journée, ",
            "professional": "Stratégie recommandée : ",
            "inspiring": "✨ Transforme ce moment en opportunité d'efficacité : "
        }
    },
    "sylvie": {
        "markers": ["transition", "changement", "adaptation"],
        "replacements": {
            "Ton corps fait": "Ton corps traverse des changements",
            "C'est normal": "C'est une transition naturelle",
            "aujourd'hui": "en cette période de transition",
            "Tu mérites": "Accompagne-toi dans cette transformation"
        },
        "prefixes": {
            "friendly": "Durant cette période de changement, ",
            "professional": "Cette phase accompagne tes transformations : ",
            "inspiring": "✨ Ta métamorphose t'invite à "
        }
    },
    "christine": {
        "markers": ["sagesse", "sacré", "histoire", "sœurs"],
        "replacements": {
            "crampes": "crampes sacrées",
            "cycles": "cycles de sagesse",
            "Ton corps": "Ton temple corporel",
            "émotions": "émotions ancestrales",
            "Tu mérites": "Tu honores la lignée des femmes"
        },
        "prefixes": {
            "friendly": "La sagesse de tes ancêtres murmure : ",
            "professional": "L'expérience millénaire des femmes enseigne : ",
            "inspiring": "✨ Tes sœurs de toutes les époques te transmettent : "
        }
    },
    "clara": {
        "markers": ["processus", "optimisation", "système"],
        "replacements": {
            "Ton corps": "Ton système physiologique",
            "bouillotte": "thermothérapie locale",
            "crampes": "contractions utérines",
            "émotions": "indicateurs neurochimiques",
            "Tu mérites": "Le système recommande"
        },
        "prefixes": {
            "friendly": "Analyse recommandée : ",
            "professional": "Données physiologiques actuelles : ",
            "inspiring": "✨ Ton système complexe révèle : "
        }
    }
}

class PersonaMigrator:
    """Gestionnaire de migration vers le système personas"""
    
    def __init__(self):
        self.stats = {"migrated": 0, "variants": 0, "errors": []}
        
    def apply_persona_style(self, content: str, persona: str, tone: str) -> str:
        """Applique le style complet d'un persona"""
        profile = PERSONA_PROFILES[persona]
        result = content
        
        # Applique les remplacements spécifiques
        for old, new in profile["replacements"].items():
            if old in result:
                result = result.replace(old, new)
        
        # Ajoute une variation selon le persona et le ton
        if persona == "emma" and tone == "friendly":
            if "crampes" in result.lower():
                result = "Tes crampes te parlent ! 💕 C'est normal, ton corps apprend à te connaître. " + result.split("! ")[1] if "! " in result else result
        
        elif persona == "laure" and any(word in result.lower() for word in ["fatigue", "repos", "sieste"]):
            result = result.replace("fatigue", "signal d'optimisation énergétique")
            result = result.replace("sieste", "pause régénératrice planifiée")
            
        elif persona == "sylvie":
            if "aujourd'hui" in result:
                result = result.replace("aujourd'hui", "en cette période de transformation")
                
        elif persona == "christine" and tone == "inspiring":
            # Ajoute une dimension spirituelle
            if result.startswith("✨"):
                result = result.replace("✨", "✨ Les femmes de ta lignée ")
                
        elif persona == "clara":
            # Rend plus technique
            result = result.replace("bien-être", "optimisation physiologique")
            result = result.replace("énergie", "ressources métaboliques")
        
        return result
    
    def generate_variant(self, content: str, persona: str, tone: str = "friendly") -> str:
        """Génère une variante personnalisée pour un persona"""
        profile = PERSONA_PROFILES[persona]
        
        # Cas spéciaux par persona avec réécriture complète pour certains contenus
        if persona == "emma":
            if "crampes te parlent" in content:
                return "Tes crampes te parlent aujourd'hui ! 💕 C'est normal, ton corps apprend à communiquer avec toi. Une bouillotte chaude sera ton amie."
            elif "mal de dos" in content.lower():
                return "Mal de dos ? 🤗 C'est ton corps qui découvre son rythme. Un coussin moelleux et des respirations douces vont t'aider !"
                
        elif persona == "laure":
            if "crampes te parlent" in content:
                return "Tes crampes signalent une phase importante de ton cycle. 💕 Optimise ta journée en t'accordant cette pause avec une bouillotte chaude."
            elif "mal de dos" in content.lower():
                return "Mal de dos ? 🤗 Intègre cette pause bien-être dans ton planning. Coussin ergonomique + respiration ventrale = efficacité restaurée."
                
        elif persona == "sylvie":
            if "crampes te parlent" in content:
                return "Ces crampes sont un signal de ton corps en transition. 💕 Accueille-les avec bienveillance et une bouillotte bien chaude pour t'apaiser."
            elif "mal de dos" in content.lower():
                return "Mal de dos ? 🤗 Ton corps traverse des changements, c'est naturel. Un bon coussin et une respiration apaisante te soulageront."
                
        elif persona == "christine":
            if "crampes te parlent" in content:
                return "Tes crampes portent la sagesse de tes cycles passés. 💕 Honore cette douleur sacrée avec la chaleur réconfortante d'une bouillotte."
            elif "mal de dos" in content.lower():
                return "Mal de dos ? 🤗 Cette tension raconte l'histoire de tes cycles. Un coussin bienveillant et une respiration consciente l'apaiseront."
                
        elif persona == "clara":
            if "crampes te parlent" in content:
                return "Tes crampes indiquent le processus physiologique actuel. 💕 Optimise ta récupération avec une thermothérapie locale - bouillotte recommandée."
            elif "mal de dos" in content.lower():
                return "Mal de dos ? 🤗 Position ergonomique + support lombaire + respiration diaphragmatique = soulagement optimal de tes tensions."
        
        # Sinon, applique les transformations standards
        return self.apply_persona_style(content, persona, tone)
    
    def migrate_insight(self, insight: dict) -> dict:
        """Migre un insight vers la structure personas"""
        base_content = insight.get("content", "")
        tone = insight.get("tone", "friendly")
        
        # Génère les variantes
        variants = {}
        for persona in PERSONA_PROFILES.keys():
            variants[persona] = self.generate_variant(base_content, persona, tone)
            self.stats["variants"] += 1
        
        # Calcul du score Jeza (+1 pour personnalisation si variantes distinctes)
        original_score = insight.get("jezaApproval", 3)
        unique_variants = len(set(variants.values()))
        new_score = min(5, original_score + 1) if unique_variants >= 3 else original_score
        
        return {
            "id": insight["id"],
            "baseContent": base_content,
            "personaVariants": variants,
            "targetPersonas": list(PERSONA_PROFILES.keys()),
            "targetPreferences": insight.get("targetPreferences", []),
            "tone": insight.get("tone", "friendly"),
            "phase": insight.get("phase", "menstrual"),
            "jezaApproval": new_score,
            "status": "enriched",
            "lastModified": datetime.now().isoformat() + "Z",
            "enrichedBy": "persona-system-v2"
        }
    
    def migrate_data(self, data: dict) -> dict:
        """Migre toute la structure"""
        result = {}
        insights_section = data.get("insights", data)
        
        for phase, phase_data in insights_section.items():
            migrated_insights = []
            
            if isinstance(phase_data, dict):
                # Structure: phase -> catégorie -> insights
                for category, insights in phase_data.items():
                    for insight in insights:
                        migrated_insights.append(self.migrate_insight(insight))
                        self.stats["migrated"] += 1
            elif isinstance(phase_data, list):
                # Structure: phase -> insights
                for insight in phase_data:
                    migrated_insights.append(self.migrate_insight(insight))
                    self.stats["migrated"] += 1
            
            result[phase] = migrated_insights
        
        return result
    
    def save_data(self, data: dict, output_path: str):
        """Sauvegarde les données"""
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    """Fonction principale"""
    parser = argparse.ArgumentParser(
        description="Migration vers personas v2"
    )
    parser.add_argument(
        "--input", 
        required=True,
        help="Fichier JSON d'entrée"
    )
    parser.add_argument(
        "--output", 
        required=True,
        help="Fichier JSON de sortie"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulation sans sauvegarde"
    )
    
    args = parser.parse_args()
    
    print("🚀 Migration vers le système personas v2 (amélioré)")
    print(f"📁 Input: {args.input}")
    print(f"📁 Output: {args.output}")
    
    # Initialisation du migrateur
    migrator = PersonaMigrator()
    
    try:
        # Chargement
        with open(args.input, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Migration
        migrated_data = migrator.migrate_data(data)
        
        # Sauvegarde
        if not args.dry_run:
            migrator.save_data(migrated_data, args.output)
            print(f"✅ Migration terminée!")
        else:
            print("🔍 Mode dry-run: pas de sauvegarde")
        
        # Stats
        print(f"📊 {migrator.stats['migrated']} insights migrés")
        print(f"🎭 {migrator.stats['variants']} variantes générées")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 