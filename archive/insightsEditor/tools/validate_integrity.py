#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Vérification - Intégrité Personas
==========================================

Vérifie la cohérence et la qualité des insights avec structure personas.

Usage: python check_personas_integrity.py --file ../data/insights_personas_v2_improved.json
"""

import json
import argparse
from collections import Counter

EXPECTED_PERSONAS = ["emma", "laure", "sylvie", "christine", "clara"]

class PersonaIntegrityChecker:
    def __init__(self):
        self.stats = {
            "total_insights": 0,
            "valid_structure": 0,
            "unique_variants": 0,
            "persona_coverage": {},
            "issues": []
        }
    
    def check_insight_structure(self, insight: dict) -> bool:
        """Vérifie la structure d'un insight"""
        required_fields = ["id", "baseContent", "personaVariants", "targetPersonas", "status", "enrichedBy"]
        
        for field in required_fields:
            if field not in insight:
                self.stats["issues"].append(f"Insight {insight.get('id', 'unknown')}: Champ manquant '{field}'")
                return False
        
        # Vérifie les personas
        if not isinstance(insight["personaVariants"], dict):
            self.stats["issues"].append(f"Insight {insight['id']}: personaVariants n'est pas un dict")
            return False
        
        for persona in EXPECTED_PERSONAS:
            if persona not in insight["personaVariants"]:
                self.stats["issues"].append(f"Insight {insight['id']}: Persona manquant '{persona}'")
                return False
        
        return True
    
    def analyze_variant_diversity(self, insight: dict) -> dict:
        """Analyse la diversité des variantes"""
        variants = insight.get("personaVariants", {})
        unique_texts = set(variants.values())
        
        return {
            "total_variants": len(variants),
            "unique_variants": len(unique_texts),
            "diversity_ratio": len(unique_texts) / len(variants) if variants else 0,
            "duplicates": len(variants) - len(unique_texts)
        }
    
    def check_persona_quality(self, persona: str, content: str) -> list:
        """Vérifie la qualité d'une variante persona"""
        issues = []
        
        # Règles spécifiques par persona
        if persona == "emma":
            if "normal" not in content and "apprend" not in content:
                issues.append(f"Emma devrait contenir 'normal' ou 'apprend'")
        
        elif persona == "laure":
            if "optimis" not in content and "planning" not in content and "efficac" not in content:
                issues.append(f"Laure devrait contenir des termes d'efficacité")
        
        elif persona == "sylvie":
            if "transition" not in content and "changement" not in content:
                issues.append(f"Sylvie devrait évoquer la transition")
        
        elif persona == "christine":
            if "sagesse" not in content and "sacré" not in content and "histoire" not in content:
                issues.append(f"Christine devrait avoir une dimension spirituelle")
        
        elif persona == "clara":
            if "système" not in content and "processus" not in content and "physiologique" not in content:
                issues.append(f"Clara devrait être technique/scientifique")
        
        return issues
    
    def check_file(self, data: dict) -> dict:
        """Vérifie l'intégrité complète du fichier"""
        
        for phase, insights in data.items():
            if not isinstance(insights, list):
                self.stats["issues"].append(f"Phase {phase}: Doit être une liste d'insights")
                continue
            
            for insight in insights:
                self.stats["total_insights"] += 1
                
                # Structure de base
                if self.check_insight_structure(insight):
                    self.stats["valid_structure"] += 1
                
                # Diversité des variantes
                diversity = self.analyze_variant_diversity(insight)
                if diversity["diversity_ratio"] >= 0.6:  # Au moins 60% de variantes uniques
                    self.stats["unique_variants"] += 1
                
                # Qualité par persona
                for persona, content in insight.get("personaVariants", {}).items():
                    if persona not in self.stats["persona_coverage"]:
                        self.stats["persona_coverage"][persona] = {"count": 0, "quality_issues": 0}
                    
                    self.stats["persona_coverage"][persona]["count"] += 1
                    
                    quality_issues = self.check_persona_quality(persona, content)
                    if quality_issues:
                        self.stats["persona_coverage"][persona]["quality_issues"] += len(quality_issues)
                        for issue in quality_issues:
                            self.stats["issues"].append(f"Insight {insight.get('id', 'unknown')} - {persona}: {issue}")
        
        return self.stats
    
    def print_report(self):
        """Affiche le rapport de vérification"""
        print("\n" + "="*60)
        print("📊 RAPPORT D'INTÉGRITÉ PERSONAS")
        print("="*60)
        
        # Statistiques générales
        print(f"✅ Total insights: {self.stats['total_insights']}")
        print(f"🏗️  Structure valide: {self.stats['valid_structure']}/{self.stats['total_insights']}")
        print(f"🎭 Variantes diversifiées: {self.stats['unique_variants']}/{self.stats['total_insights']}")
        
        # Couverture par persona
        print(f"\n🎭 COUVERTURE PAR PERSONA:")
        for persona, data in self.stats["persona_coverage"].items():
            quality_rate = 100 - (data["quality_issues"] / data["count"] * 100) if data["count"] > 0 else 0
            print(f"   {persona.upper()}: {data['count']} variantes | Qualité: {quality_rate:.1f}%")
        
        # Issues critiques
        critical_issues = [issue for issue in self.stats["issues"] if "manquant" in issue or "n'est pas" in issue]
        if critical_issues:
            print(f"\n❌ PROBLÈMES CRITIQUES ({len(critical_issues)}):")
            for issue in critical_issues[:10]:
                print(f"   - {issue}")
            if len(critical_issues) > 10:
                print(f"   ... et {len(critical_issues) - 10} autres")
        
        # Issues de qualité
        quality_issues = [issue for issue in self.stats["issues"] if issue not in critical_issues]
        if quality_issues:
            print(f"\n⚠️  SUGGESTIONS D'AMÉLIORATION ({len(quality_issues)}):")
            for issue in quality_issues[:5]:
                print(f"   - {issue}")
            if len(quality_issues) > 5:
                print(f"   ... et {len(quality_issues) - 5} autres")
        
        # Score global
        structure_score = (self.stats["valid_structure"] / self.stats["total_insights"]) * 100 if self.stats["total_insights"] > 0 else 0
        diversity_score = (self.stats["unique_variants"] / self.stats["total_insights"]) * 100 if self.stats["total_insights"] > 0 else 0
        global_score = (structure_score + diversity_score) / 2
        
        print(f"\n🎯 SCORE GLOBAL: {global_score:.1f}/100")
        if global_score >= 90:
            print("🟢 Excellent! Prêt pour la production")
        elif global_score >= 75:
            print("🟡 Bon, quelques améliorations possibles")
        else:
            print("🔴 Nécessite des corrections avant utilisation")

def main():
    parser = argparse.ArgumentParser(description="Vérification intégrité personas")
    parser.add_argument("--file", required=True, help="Fichier JSON à vérifier")
    parser.add_argument("--verbose", action="store_true", help="Affichage détaillé")
    
    args = parser.parse_args()
    
    print("🔍 Vérification de l'intégrité des personas")
    print(f"📁 Fichier: {args.file}")
    
    checker = PersonaIntegrityChecker()
    
    try:
        with open(args.file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        stats = checker.check_file(data)
        checker.print_report()
        
        return 0 if stats["valid_structure"] == stats["total_insights"] else 1
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return 1

if __name__ == "__main__":
    exit(main()) 