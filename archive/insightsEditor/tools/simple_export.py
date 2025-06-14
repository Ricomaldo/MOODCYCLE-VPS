#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script Export Simple - InsightsEditor
====================================

Prend le fichier source unique (travail Jeza) et génère vraiment 5 variants personas VRAIMENT différents.

Usage:
    python tools/active/simple_export.py

Input:  insights_validated_2025-06-09.json (travail Jeza)
Output: insights_export_YYYY-MM-DD.json (format final app)
"""

import json
import re
from datetime import datetime
from pathlib import Path

# Configuration des personas avec leurs styles spécifiques
PERSONA_STYLES = {
    "emma": {
        "age": "16-25 ans, Découverte",
        "style": "encourageant, apprentissage",
        "markers": ["normal", "apprend", "découvre", "c'est okay"],
        "replacements": {
            "Ton corps fait un travail incroyable": "C'est normal, ton corps apprend à communiquer avec toi",
            "Tu mérites": "Tu apprends à te faire confiance",
            "processus": "ce que vit ton corps",
            "système": "corps",
            "optimise": "prends soin de",
            "efficacité": "bien-être"
        },
        "prefix_friendly": "Hey ! 💕 C'est normal que ",
        "prefix_professional": "Durant cette phase d'apprentissage, ",
        "prefix_inspiring": "✨ Ton corps t'enseigne "
    },
    
    "laure": {
        "age": "25-35 ans, Efficacité", 
        "style": "pragmatique, orienté action",
        "markers": ["optimise", "planifie", "efficace", "stratégie"],
        "replacements": {
            "Prends soin de toi": "Intègre cette pause bien-être dans ton planning",
            "écoute ton corps": "optimise ta récupération", 
            "Respire": "Optimise ta respiration",
            "Tu mérites": "C'est un investissement dans ta productivité",
            "repos": "pause régénératrice planifiée",
            "fatigue": "signal d'optimisation énergétique"
        },
        "prefix_friendly": "Pour optimiser ta journée, ",
        "prefix_professional": "Stratégie recommandée : ",
        "prefix_inspiring": "✨ Transforme ce moment en opportunité d'efficacité : "
    },
    
    "sylvie": {
        "age": "35-45 ans, Transition",
        "style": "compréhensif, adaptatif", 
        "markers": ["transition", "changement", "adaptation", "évolution"],
        "replacements": {
            "aujourd'hui": "en cette période de transformation",
            "Ton corps": "Ton corps en transition",
            "Tu mérites": "Tu apprends à t'adapter",
            "normal": "naturel dans cette phase",
            "processus": "évolution"
        },
        "prefix_friendly": "Durant cette transition, ",
        "prefix_professional": "Ton corps s'adapte : ",
        "prefix_inspiring": "✨ Cette transformation t'enseigne "
    },
    
    "christine": {
        "age": "45+ ans, Sagesse",
        "style": "sage, spirituel, bienveillant",
        "markers": ["sagesse", "histoire", "lignée", "sacré"],
        "replacements": {
            "Ton corps": "Ton corps sage",
            "douleur": "douleur sacrée", 
            "Tu mérites": "Tu portes la sagesse",
            "processus": "rituel ancestral",
            "aujourd'hui": "en ce jour béni"
        },
        "prefix_friendly": "Ma chère, ",
        "prefix_professional": "La sagesse féminine enseigne : ",
        "prefix_inspiring": "✨ Les femmes de ta lignée "
    },
    
    "clara": {
        "age": "Tous âges, Scientifique",
        "style": "précis, analytique, optimisé",
        "markers": ["système", "processus", "optimisation", "physiologique"],
        "replacements": {
            "bien-être": "optimisation physiologique",
            "énergie": "ressources métaboliques",
            "repos": "récupération optimisée",
            "Ton corps": "Ton système physiologique",
            "Tu mérites": "Les données indiquent"
        },
        "prefix_friendly": "Analyse recommandée : ",
        "prefix_professional": "Protocole optimal : ",
        "prefix_inspiring": "✨ L'intelligence de ton système "
    }
}

def apply_persona_transformation(content: str, persona: str, tone: str) -> str:
    """Applique une transformation spécifique à un persona"""
    if persona not in PERSONA_STYLES:
        return content
    
    style = PERSONA_STYLES[persona]
    result = content
    
    # Applique les remplacements spécifiques au persona
    for old, new in style["replacements"].items():
        if old.lower() in result.lower():
            # Remplacement case-insensitive mais préserve la case originale
            pattern = re.compile(re.escape(old), re.IGNORECASE)
            result = pattern.sub(new, result)
    
    # Ajustements spécifiques par persona + ton
    if persona == "emma":
        if "crampes" in result.lower():
            result = result.replace("crampes te parlent", "crampes te parlent ! 💕 C'est normal, ton corps apprend")
        if "mal de dos" in result.lower():
            result = result.replace("Mal de dos ?", "Mal de dos ? 🤗 C'est ton corps qui découvre son rythme.")
            
    elif persona == "laure":
        if "crampes" in result.lower():
            result = result.replace("💕 Ton corps", "💕 Optimise ta journée en t'accordant cette pause. Ton corps")
        if "planning" not in result and "efficac" not in result:
            # Ajoute une notion d'efficacité si absente
            if result.endswith("!"):
                result = result[:-1] + " - moment optimal pour prendre soin de toi !"
                
    elif persona == "sylvie":
        if "transition" not in result and "changement" not in result:
            result = result.replace("Ton corps", "Ton corps en transition")
            
    elif persona == "christine":
        if tone == "inspiring" and "✨" in result:
            result = result.replace("✨", "✨ Les femmes de ta lignée ")
        if "sagesse" not in result and "sacré" not in result:
            result = result.replace("douleur", "douleur qui porte une sagesse")
            
    elif persona == "clara":
        # Rend plus technique/scientifique
        result = result.replace("bien-être", "optimisation physiologique")
        result = result.replace("ton énergie", "tes ressources métaboliques")
        if "processus" not in result and "système" not in result:
            result = result.replace("Ton corps", "Ton système physiologique")
    
    return result

def generate_persona_variants(base_content: str, tone: str) -> dict:
    """Génère les 5 variants personas pour un insight"""
    variants = {}
    
    for persona in PERSONA_STYLES.keys():
        variant = apply_persona_transformation(base_content, persona, tone)
        
        # S'assurer que le variant est différent du contenu de base
        if variant == base_content:
            # Forcer une différenciation minimale
            style = PERSONA_STYLES[persona]
            prefix = style.get(f"prefix_{tone}", "")
            if prefix and not variant.startswith(prefix):
                variant = prefix + variant.lower()
        
        variants[persona] = variant
    
    return variants

def migrate_insight(insight: dict) -> dict:
    """Migre un insight vers le format personas"""
    base_content = insight.get("content", "")
    tone = insight.get("tone", "friendly")
    
    # Génère les variants
    variants = generate_persona_variants(base_content, tone)
    
    # Calcule le score ajusté (+1 si variants diversifiés)
    unique_variants = len(set(variants.values()))
    original_score = insight.get("jezaApproval", 3)
    new_score = min(5, original_score + 1) if unique_variants >= 4 else original_score
    
    return {
        "id": insight["id"],
        "baseContent": base_content,
        "personaVariants": variants,
        "targetPersonas": list(PERSONA_STYLES.keys()),
        "targetPreferences": insight.get("targetPreferences", []),
        "tone": tone,
        "phase": insight.get("phase", "menstrual"),
        "jezaApproval": new_score,
        "status": "enriched",
        "lastModified": insight.get("lastModified", datetime.now().isoformat() + "Z"),
        "enrichedBy": "simple-export-v1"
    }

def load_jeza_data():
    """Charge le fichier source Jeza"""
    source_file = Path("insights_validated_2025-06-09.json")
    if not source_file.exists():
        source_file = Path("data/current/insights_validated_2025-06-09.json") 
    
    if not source_file.exists():
        raise FileNotFoundError("Fichier source Jeza introuvable !")
    
    with open(source_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def export_final_format(jeza_data: dict) -> dict:
    """Exporte vers le format final de l'app"""
    
    # Métadonnées export
    export_info = {
        "exportDate": datetime.now().isoformat() + "Z",
        "source": "insights_validated_2025-06-09.json",
        "totalInsights": 0,
        "version": "1.0-simple-export"
    }
    
    # Structure finale
    final_data = {}
    total_insights = 0
    
    # Traite les insights par phase
    insights_by_phase = jeza_data.get("insights", {})
    for phase, insights_list in insights_by_phase.items():
        final_data[phase] = []
        
        for insight in insights_list:
            migrated = migrate_insight(insight)
            final_data[phase].append(migrated)
            total_insights += 1
    
    export_info["totalInsights"] = total_insights
    
    # Ajoute les métadonnées au début
    final_export = {"exportInfo": export_info}
    final_export.update(final_data)
    
    return final_export

def main():
    """Fonction principale"""
    print("🚀 Export Simple - InsightsEditor V1")
    print("=" * 50)
    
    try:
        # Charge les données Jeza
        print("📂 Chargement données Jeza...")
        jeza_data = load_jeza_data()
        
        # Export vers format final
        print("🎭 Génération variants personas...")
        final_data = export_final_format(jeza_data)
        
        # Sauvegarde
        timestamp = datetime.now().strftime("%Y-%m-%d")
        output_file = f"insights_export_{timestamp}.json"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Export terminé : {output_file}")
        print(f"📊 {final_data['exportInfo']['totalInsights']} insights traités")
        
        # Statistiques variants
        sample_insight = None
        for phase_insights in final_data.values():
            if isinstance(phase_insights, list) and phase_insights:
                sample_insight = phase_insights[0]
                break
        
        if sample_insight and "personaVariants" in sample_insight:
            variants = sample_insight["personaVariants"]
            unique_count = len(set(variants.values()))
            print(f"🎯 Exemple variants uniques : {unique_count}/5")
            
            # Affiche un échantillon
            print("\n📝 Échantillon variants (première insight) :")
            for persona, content in variants.items():
                preview = content[:60] + "..." if len(content) > 60 else content
                print(f"  {persona}: {preview}")
        
        return output_file
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

if __name__ == "__main__":
    main() 