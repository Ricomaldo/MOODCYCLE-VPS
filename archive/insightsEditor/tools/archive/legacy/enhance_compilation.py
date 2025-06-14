import json
import copy

# Charger le fichier actuel
with open('data/moodcycle-menstrual-insights-compilation.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🔄 Équilibrage des phases et affinement du scoring...")

# Fonction pour affiner le scoring selon Jeza Gray
def refine_jeza_scoring(insight):
    content = insight['content']
    tone = insight['tone']
    category = insight['targetPreferences'][0]
    
    # Critères Jeza Gray pour les catégories spirituelles
    spiritual_categories = ['rituals', 'phases', 'moods', 'lithotherapy']
    
    if category not in spiritual_categories:
        return insight['jezaApproval']  # Garder le score actuel pour symptoms/phyto
    
    # Mots-clés spirituels positifs
    spiritual_keywords = [
        'sagesse', 'ancestrale', 'temple', 'sacré', 'intérieur', 'âme', 
        'messagère', 'rituel', 'transformation', 'renaissance', 'essence',
        'voyage', 'océan', 'lune', 'mystère', 'invisible', 'profondeur',
        'gardien', 'miroir', 'chuchote', 'danse', 'murmure', 'célèbre'
    ]
    
    # Mots-clés trop médicaux/techniques
    medical_keywords = [
        'hormonale', 'physiologique', 'contractions', 'utérines', 'œstrogènes',
        'métabolique', 'inflammation', 'processus', 'variations', 'optimal'
    ]
    
    spiritual_score = sum(1 for word in spiritual_keywords if word.lower() in content.lower())
    medical_score = sum(1 for word in medical_keywords if word.lower() in content.lower())
    
    # Système de scoring affiné
    if tone == 'inspiring':
        if spiritual_score >= 2 and '✨' in content:
            return 5
        elif spiritual_score >= 1:
            return 4
        else:
            return 3
    
    elif tone == 'friendly':
        if spiritual_score >= 1 and medical_score == 0:
            return 4
        elif spiritual_score >= 1 or ('💕' in content or '🌙' in content):
            return 3
        else:
            return 2
    
    elif tone == 'professional':
        if spiritual_score >= 1 and medical_score <= 1:
            return 4
        elif medical_score <= 2 and 'bienveillance' in content.lower():
            return 3
        elif medical_score > 2:
            return 2
        else:
            return 3
    
    return insight['jezaApproval']

# Appliquer l'affinement du scoring
print("📊 Affinement du scoring Jeza Gray...")
for phase in data:
    for category in data[phase]:
        for insight in data[phase][category]:
            old_score = insight['jezaApproval']
            new_score = refine_jeza_scoring(insight)
            if old_score != new_score:
                insight['jezaApproval'] = new_score
                print(f"  {insight['id']}: {old_score} → {new_score}")

# Nouveaux insights pour équilibrer les phases
additional_insights = {
    'follicular': {
        'symptoms': [
            {
                "id": "F_symptoms_friendly_03",
                "content": "Hey ! 💖 Ton corps retrouve sa pêche. Une petite danse pour célébrer ?",
                "targetPreferences": ["symptoms"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_symptoms_professional_02",
                "content": "La régénération tissulaire s'intensifie, accompagnée d'une restauration graduelle des réserves énergétiques.",
                "targetPreferences": ["symptoms"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_symptoms_professional_03",
                "content": "L'augmentation des œstrogènes favorise une optimisation des fonctions physiologiques et métaboliques.",
                "targetPreferences": ["symptoms"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_symptoms_inspiring_03",
                "content": "✨ Ton corps est un poème en mouvement. Chaque cellule murmure une histoire de renaissance.",
                "targetPreferences": ["symptoms"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 5
            }
        ],
        'moods': [
            {
                "id": "F_moods_friendly_02",
                "content": "Coucou ! 🌈 La créativité explose. Tes idées sont des feux d'artifice !",
                "targetPreferences": ["moods"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_moods_friendly_03",
                "content": "Hey ! 💡 Ton cerveau est en mode turbo créatif. Laisse les idées couler !",
                "targetPreferences": ["moods"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_moods_professional_02",
                "content": "L'équilibre hormonal actuel favorise une stabilité émotionnelle propice à l'expression créative.",
                "targetPreferences": ["moods"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_moods_professional_03",
                "content": "La dynamique émotionnelle actuelle suggère une période optimale pour l'exploration et l'innovation personnelle.",
                "targetPreferences": ["moods"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_moods_inspiring_02",
                "content": "✨ Tes émotions sont des vagues de création. Chaque sentiment est un pinceau, chaque pensée une toile.",
                "targetPreferences": ["moods"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 5
            },
            {
                "id": "F_moods_inspiring_03",
                "content": "🌈 Tu es un arc-en-ciel intérieur. Tes émotions dansent, libres et puissantes.",
                "targetPreferences": ["moods"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 4
            }
        ],
        'phyto': [
            {
                "id": "F_phyto_friendly_02",
                "content": "Salut ! 🌿 La cannelle va réveiller ton énergie. Un petit coup de boost naturel !",
                "targetPreferences": ["phyto"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_phyto_friendly_03",
                "content": "Hey ! 🍃 Le thym, c'est ton allié énergisant. Une tisane qui réveille !",
                "targetPreferences": ["phyto"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 2
            },
            {
                "id": "F_phyto_professional_02",
                "content": "La cannelle présente des propriétés stimulantes qui peuvent soutenir la dynamique énergétique.",
                "targetPreferences": ["phyto"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_phyto_professional_03",
                "content": "Le thym offre des propriétés tonifiantes qui peuvent accompagner le regain d'énergie de cette phase.",
                "targetPreferences": ["phyto"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_phyto_inspiring_02",
                "content": "✨ Les plantes murmurent les secrets de ta renaissance. Chaque feuille est un poème de vie.",
                "targetPreferences": ["phyto"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 5
            },
            {
                "id": "F_phyto_inspiring_03",
                "content": "🌱 Chaque herbe est une alchimiste. Elles transforment ta fatigue en énergie pure.",
                "targetPreferences": ["phyto"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 4
            }
        ],
        'phases': [
            {
                "id": "F_phases_friendly_02",
                "content": "Coucou ! 🌟 Ton corps est en mode reconstruction. Célèbre cette renaissance !",
                "targetPreferences": ["phases"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_phases_friendly_03",
                "content": "Hey ! 🌈 L'énergie remonte. Tu es un soleil qui se lève !",
                "targetPreferences": ["phases"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_phases_professional_02",
                "content": "La dynamique physiologique actuelle favorise une régénération cellulaire optimale.",
                "targetPreferences": ["phases"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_phases_professional_03",
                "content": "Cette phase marque une période de reconstruction et de préparation énergétique.",
                "targetPreferences": ["phases"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_phases_inspiring_02",
                "content": "✨ Tu es un océan en mouvement. Chaque vague est une promesse de renaissance.",
                "targetPreferences": ["phases"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 5
            },
            {
                "id": "F_phases_inspiring_03",
                "content": "🌱 La vie en toi est un poème. Chaque respiration est un vers de renouveau.",
                "targetPreferences": ["phases"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 4
            }
        ],
        'lithotherapy': [
            {
                "id": "F_lithotherapy_friendly_02",
                "content": "Coucou ! 💎 Le quartz rose va booster ta confiance. Un petit coup de pouce énergétique !",
                "targetPreferences": ["lithotherapy"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_lithotherapy_friendly_03",
                "content": "Hey ! 🔮 La pierre de soleil, c'est ton rayon de créativité !",
                "targetPreferences": ["lithotherapy"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 2
            },
            {
                "id": "F_lithotherapy_professional_02",
                "content": "Le quartz rose peut favoriser l'auto-compassion et l'équilibre émotionnel.",
                "targetPreferences": ["lithotherapy"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_lithotherapy_professional_03",
                "content": "La pierre de soleil offre un support énergétique propice à l'expression créative.",
                "targetPreferences": ["lithotherapy"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_lithotherapy_inspiring_02",
                "content": "✨ Chaque cristal est un miroir de ton âme. Le quartz rose chante ta beauté intérieure.",
                "targetPreferences": ["lithotherapy"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 5
            },
            {
                "id": "F_lithotherapy_inspiring_03",
                "content": "🔮 Les pierres sont des gardiennes de lumière. Elles dansent avec tes rêves.",
                "targetPreferences": ["lithotherapy"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 4
            }
        ],
        'rituals': [
            {
                "id": "F_rituals_friendly_02",
                "content": "Salut ! 🌟 Un petit mood board créatif ? Laisse libre cours à ton imagination !",
                "targetPreferences": ["rituals"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_rituals_friendly_03",
                "content": "Hey ! 🎨 Temps de créativité pure. Un dessin, un poème, ce que ton cœur désire !",
                "targetPreferences": ["rituals"],
                "tone": "friendly",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_rituals_professional_02",
                "content": "La pratique de la méditation créative peut favoriser l'émergence de nouvelles perspectives.",
                "targetPreferences": ["rituals"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 3
            },
            {
                "id": "F_rituals_professional_03",
                "content": "L'écriture intuitive peut devenir un outil de développement personnel et créatif.",
                "targetPreferences": ["rituals"],
                "tone": "professional",
                "phase": "follicular",
                "jezaApproval": 4
            },
            {
                "id": "F_rituals_inspiring_02",
                "content": "✨ Ton journal est un sanctuaire. Chaque mot est une clé vers ta sagesse intérieure.",
                "targetPreferences": ["rituals"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 5
            },
            {
                "id": "F_rituals_inspiring_03",
                "content": "🌈 La créativité est un rituel sacré. Tu es l'artiste de ta propre renaissance.",
                "targetPreferences": ["rituals"],
                "tone": "inspiring",
                "phase": "follicular",
                "jezaApproval": 5
            }
        ]
    }
}

# Ajouter les nouveaux insights à follicular
print("➕ Ajout d'insights pour équilibrer la phase folliculaire...")
for category, insights in additional_insights['follicular'].items():
    for insight in insights:
        if insight['id'] not in [i['id'] for i in data['follicular'][category]]:
            data['follicular'][category].append(insight)
            print(f"  Ajouté: {insight['id']}")

# Sauvegarder
with open('data/moodcycle-menstrual-insights-compilation.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n🎯 Récapitulatif des améliorations:")
print("✅ Scoring Jeza Gray affiné selon la cohérence spirituelle")
print("✅ Phase folliculaire équilibrée (ajout de ~30 insights)")
print("✅ Diversité tonale maintenue")
print("✅ Progression: 100 → ~130 insights")
print("\n📊 Exécution du check final...") 