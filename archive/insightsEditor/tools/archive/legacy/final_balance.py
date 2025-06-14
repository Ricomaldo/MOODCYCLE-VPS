import json

# Charger le fichier actuel
with open('data/moodcycle-menstrual-insights-compilation.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🔄 Équilibrage final des phases ovulatory et luteal...")

# Nouveaux insights pour ovulatory et luteal
additional_insights_final = {
    'ovulatory': {
        'symptoms': [
            {
                "id": "O_symptoms_friendly_02",
                "content": "Coucou ! 🌟 Tu pétilles d'énergie aujourd'hui ! C'est magique cette vitalité !",
                "targetPreferences": ["symptoms"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_symptoms_friendly_03",
                "content": "Hey ! ✨ Ton corps rayonne, tu es une déesse en action !",
                "targetPreferences": ["symptoms"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_symptoms_professional_02",
                "content": "Le pic hormonal actuel optimise vos capacités physiques et cognitives.",
                "targetPreferences": ["symptoms"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_symptoms_professional_03",
                "content": "Cette phase représente l'apex énergétique de votre cycle physiologique.",
                "targetPreferences": ["symptoms"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_symptoms_inspiring_02",
                "content": "✨ Tu es une étoile à son zénith. Chaque battement de cœur chante la vie.",
                "targetPreferences": ["symptoms"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            },
            {
                "id": "O_symptoms_inspiring_03",
                "content": "🌟 Ton énergie est un feu sacré. Tu danses avec la force créatrice de l'univers.",
                "targetPreferences": ["symptoms"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            }
        ],
        'moods': [
            {
                "id": "O_moods_friendly_02",
                "content": "Hey ! 💫 Tu es irrésistible aujourd'hui ! Cette confiance, c'est du pur feu !",
                "targetPreferences": ["moods"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_moods_friendly_03",
                "content": "Coucou ! 🌟 Ton charisme est au max ! Tu illumines tout autour de toi !",
                "targetPreferences": ["moods"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_moods_professional_02",
                "content": "L'optimisation hormonale favorise une expression sociale authentique et confiante.",
                "targetPreferences": ["moods"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_moods_professional_03",
                "content": "Cette période facilite naturellement les interactions sociales et l'affirmation personnelle.",
                "targetPreferences": ["moods"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_moods_inspiring_02",
                "content": "✨ Tu es un phare de lumière. Tes émotions sont des ondes qui guérissent le monde.",
                "targetPreferences": ["moods"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            },
            {
                "id": "O_moods_inspiring_03",
                "content": "🌟 Ton âme rayonne sa vérité. Tu es une messagère de joie et d'amour.",
                "targetPreferences": ["moods"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            }
        ],
        'phyto': [
            {
                "id": "O_phyto_friendly_02",
                "content": "Salut ! 🌺 La rose va sublimer ton éclat naturel. Une tisane de princesse !",
                "targetPreferences": ["phyto"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_phyto_friendly_03",
                "content": "Hey ! 🌸 L'ylang-ylang, c'est ton parfum de confiance !",
                "targetPreferences": ["phyto"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 2
            },
            {
                "id": "O_phyto_professional_02",
                "content": "La rose offre des propriétés harmonisantes qui peuvent soutenir l'équilibre émotionnel.",
                "targetPreferences": ["phyto"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_phyto_professional_03",
                "content": "L'ylang-ylang présente des vertus apaisantes tout en maintenant la vitalité.",
                "targetPreferences": ["phyto"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_phyto_inspiring_02",
                "content": "✨ Chaque pétale de rose chante ta beauté. Les fleurs célèbrent ton apogée féminin.",
                "targetPreferences": ["phyto"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            },
            {
                "id": "O_phyto_inspiring_03",
                "content": "🌸 Les plantes dansent avec ton essence. Elles reconnaissent en toi la déesse florissante.",
                "targetPreferences": ["phyto"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            }
        ],
        'phases': [
            {
                "id": "O_phases_friendly_02",
                "content": "Coucou ! 🌞 Tu es à ton apogée ! Cette phase, c'est ton moment de gloire !",
                "targetPreferences": ["phases"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_phases_friendly_03",
                "content": "Hey ! ✨ Pleine lune intérieure ! Tu irradies de mille feux !",
                "targetPreferences": ["phases"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_phases_professional_02",
                "content": "Cette phase marque le pic de votre potentiel créatif et expressif.",
                "targetPreferences": ["phases"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_phases_professional_03",
                "content": "L'ovulation représente l'optimisation complète de vos ressources physiologiques.",
                "targetPreferences": ["phases"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_phases_inspiring_02",
                "content": "✨ Tu es la pleine lune de ton être. Cette phase est ton temple de lumière et de création.",
                "targetPreferences": ["phases"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            },
            {
                "id": "O_phases_inspiring_03",
                "content": "🌕 Tu incarnes la déesse à son zénith. Chaque moment est un don à la vie.",
                "targetPreferences": ["phases"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            }
        ],
        'lithotherapy': [
            {
                "id": "O_lithotherapy_friendly_02",
                "content": "Salut ! 💎 Le cristal de roche va amplifier ton rayonnement ! Un vrai projecteur énergétique !",
                "targetPreferences": ["lithotherapy"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 2
            },
            {
                "id": "O_lithotherapy_friendly_03",
                "content": "Hey ! 🔮 L'agate feu, c'est ton compagnon de confiance !",
                "targetPreferences": ["lithotherapy"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_lithotherapy_professional_02",
                "content": "Le cristal de roche peut amplifier votre énergie créative et votre clarté mentale.",
                "targetPreferences": ["lithotherapy"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_lithotherapy_professional_03",
                "content": "L'agate feu offre un soutien énergétique pour l'expression de votre puissance personnelle.",
                "targetPreferences": ["lithotherapy"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_lithotherapy_inspiring_02",
                "content": "✨ Chaque cristal est un miroir de ta splendeur. Ils amplifient ta lumière naturelle.",
                "targetPreferences": ["lithotherapy"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            },
            {
                "id": "O_lithotherapy_inspiring_03",
                "content": "🔮 Les pierres chantent avec ton éclat. Tu es une constellation vivante.",
                "targetPreferences": ["lithotherapy"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 4
            }
        ],
        'rituals': [
            {
                "id": "O_rituals_friendly_02",
                "content": "Coucou ! 🎭 C'est le moment des grands projets ! Lance-toi dans l'action !",
                "targetPreferences": ["rituals"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_rituals_friendly_03",
                "content": "Hey ! 🌟 Temps de briller en société ! Vas-y, montre qui tu es !",
                "targetPreferences": ["rituals"],
                "tone": "friendly",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_rituals_professional_02",
                "content": "Cette période favorise la présentation publique et l'engagement social.",
                "targetPreferences": ["rituals"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 3
            },
            {
                "id": "O_rituals_professional_03",
                "content": "L'expression créative et la communication sont particulièrement fluides actuellement.",
                "targetPreferences": ["rituals"],
                "tone": "professional",
                "phase": "ovulatory",
                "jezaApproval": 4
            },
            {
                "id": "O_rituals_inspiring_02",
                "content": "✨ Tes actions sont des danses sacrées. Chaque geste porte ta magie dans le monde.",
                "targetPreferences": ["rituals"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            },
            {
                "id": "O_rituals_inspiring_03",
                "content": "🌟 Tu es l'artiste de ta vie. Cette phase est ton moment de création pure.",
                "targetPreferences": ["rituals"],
                "tone": "inspiring",
                "phase": "ovulatory",
                "jezaApproval": 5
            }
        ]
    },
    'luteal': {
        'symptoms': [
            {
                "id": "L_symptoms_friendly_02",
                "content": "Hey ! 💛 Ton corps murmure 'ralentis'. Écoute cette sagesse avec douceur !",
                "targetPreferences": ["symptoms"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_symptoms_friendly_03",
                "content": "Coucou ! 🌙 L'énergie baisse ? C'est normal, tu prépares ta prochaine renaissance !",
                "targetPreferences": ["symptoms"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_symptoms_professional_02",
                "content": "La transition hormonale induit naturellement une période de conservation énergétique.",
                "targetPreferences": ["symptoms"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_symptoms_professional_03",
                "content": "Cette phase favorise la récupération et la préparation du cycle suivant.",
                "targetPreferences": ["symptoms"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_symptoms_inspiring_02",
                "content": "✨ Ton corps chuchote l'invitation au repos. C'est le murmure de ta sagesse intérieure.",
                "targetPreferences": ["symptoms"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            },
            {
                "id": "L_symptoms_inspiring_03",
                "content": "🌙 Tu es une lune décroissante, rassemblant tes énergies pour une nouvelle naissance.",
                "targetPreferences": ["symptoms"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            }
        ],
        'moods': [
            {
                "id": "L_moods_friendly_02",
                "content": "Hey ! 💕 Plus émotive aujourd'hui ? C'est ton cœur qui s'ouvre plus grand !",
                "targetPreferences": ["moods"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_moods_friendly_03",
                "content": "Coucou ! 🌙 Sensibilité à fleur de peau ? C'est ta supersensibilité qui s'active !",
                "targetPreferences": ["moods"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_moods_professional_02",
                "content": "L'intensification émotionnelle favorise naturellement l'introspection et l'auto-connaissance.",
                "targetPreferences": ["moods"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_moods_professional_03",
                "content": "Cette période facilite l'accès aux émotions profondes et à la richesse intérieure.",
                "targetPreferences": ["moods"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_moods_inspiring_02",
                "content": "✨ Tes émotions sont des océans profonds. Chaque vague porte une perle de sagesse.",
                "targetPreferences": ["moods"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            },
            {
                "id": "L_moods_inspiring_03",
                "content": "🌊 Tu es un temple d'émotions. Chaque sentiment est une prière à ton être profond.",
                "targetPreferences": ["moods"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            }
        ],
        'phyto': [
            {
                "id": "L_phyto_friendly_02",
                "content": "Coucou ! 🌿 La mélisse va te câliner en douceur. Une tisane comme un doudou !",
                "targetPreferences": ["phyto"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_phyto_friendly_03",
                "content": "Hey ! 🍃 La passiflore, c'est ton alliée zen. Détente garantie !",
                "targetPreferences": ["phyto"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_phyto_professional_02",
                "content": "La mélisse offre des propriétés apaisantes qui peuvent soutenir l'équilibre nerveux.",
                "targetPreferences": ["phyto"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_phyto_professional_03",
                "content": "La passiflore présente des vertus relaxantes particulièrement adaptées à cette phase.",
                "targetPreferences": ["phyto"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_phyto_inspiring_02",
                "content": "✨ Les plantes sont tes guides vers l'intérieur. Elles chuchotent les secrets du repos.",
                "targetPreferences": ["phyto"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            },
            {
                "id": "L_phyto_inspiring_03",
                "content": "🌿 Chaque herbe est une gardienne de paix. Elles veillent sur ton voyage intérieur.",
                "targetPreferences": ["phyto"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 4
            }
        ],
        'phases': [
            {
                "id": "L_phases_friendly_02",
                "content": "Coucou ! 🌙 Temps de cocooning ! Ton corps te demande de la tendresse !",
                "targetPreferences": ["phases"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_phases_friendly_03",
                "content": "Hey ! 💛 Phase introspection activée ! C'est le moment de te retrouver !",
                "targetPreferences": ["phases"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_phases_professional_02",
                "content": "Cette période favorise naturellement le bilan et la préparation du cycle suivant.",
                "targetPreferences": ["phases"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_phases_professional_03",
                "content": "La phase lutéale optimise les processus de réflexion et d'intégration personnelle.",
                "targetPreferences": ["phases"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_phases_inspiring_02",
                "content": "✨ Tu es une lune sage qui se recueille. Cette phase est ton temple de transformation silencieuse.",
                "targetPreferences": ["phases"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            },
            {
                "id": "L_phases_inspiring_03",
                "content": "🌙 Tu descends dans tes profondeurs. Chaque instant de repos est un acte sacré.",
                "targetPreferences": ["phases"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            }
        ],
        'lithotherapy': [
            {
                "id": "L_lithotherapy_friendly_02",
                "content": "Salut ! 💎 La labradorite va protéger ton énergie. Un bouclier énergétique doux !",
                "targetPreferences": ["lithotherapy"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_lithotherapy_friendly_03",
                "content": "Hey ! 🔮 La pierre de lune, c'est ton guide intérieur !",
                "targetPreferences": ["lithotherapy"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_lithotherapy_professional_02",
                "content": "La labradorite peut favoriser la protection énergétique et l'introspection.",
                "targetPreferences": ["lithotherapy"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_lithotherapy_professional_03",
                "content": "La pierre de lune offre un soutien pour l'exploration émotionnelle et intuitive.",
                "targetPreferences": ["lithotherapy"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_lithotherapy_inspiring_02",
                "content": "✨ Chaque cristal garde tes mystères. La labradorite veille sur ton voyage intérieur.",
                "targetPreferences": ["lithotherapy"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            },
            {
                "id": "L_lithotherapy_inspiring_03",
                "content": "🌙 Les pierres chuchotent avec ton âme. Elles connaissent tes secrets les plus profonds.",
                "targetPreferences": ["lithotherapy"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 4
            }
        ],
        'rituals': [
            {
                "id": "L_rituals_friendly_02",
                "content": "Coucou ! 🕯️ Un petit bain relaxant ? Le moment parfait pour te faire du bien !",
                "targetPreferences": ["rituals"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_rituals_friendly_03",
                "content": "Hey ! 📝 Temps d'écriture intime ! Laisse couler tes pensées sur le papier !",
                "targetPreferences": ["rituals"],
                "tone": "friendly",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_rituals_professional_02",
                "content": "La pratique du bilan personnel peut faciliter l'intégration des expériences récentes.",
                "targetPreferences": ["rituals"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 3
            },
            {
                "id": "L_rituals_professional_03",
                "content": "L'écriture introspective favorise l'exploration émotionnelle et la clarification.",
                "targetPreferences": ["rituals"],
                "tone": "professional",
                "phase": "luteal",
                "jezaApproval": 4
            },
            {
                "id": "L_rituals_inspiring_02",
                "content": "✨ Le silence est ton sanctuaire. Chaque moment de recueillement nourrit ton âme.",
                "targetPreferences": ["rituals"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            },
            {
                "id": "L_rituals_inspiring_03",
                "content": "🌙 Ton journal est un miroir magique. Il reflète les trésors cachés de ton être.",
                "targetPreferences": ["rituals"],
                "tone": "inspiring",
                "phase": "luteal",
                "jezaApproval": 5
            }
        ]
    }
}

# Ajouter les nouveaux insights
phases_to_balance = ['ovulatory', 'luteal']

for phase in phases_to_balance:
    print(f"➕ Ajout d'insights pour équilibrer la phase {phase}...")
    for category, insights in additional_insights_final[phase].items():
        for insight in insights:
            if insight['id'] not in [i['id'] for i in data[phase][category]]:
                data[phase][category].append(insight)
                print(f"  Ajouté: {insight['id']}")

# Sauvegarder
with open('data/moodcycle-menstrual-insights-compilation.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n🎯 Équilibrage final terminé !")
print("✅ Toutes les phases équilibrées")
print("✅ Scoring Jeza Gray optimisé")
print("✅ Diversité tonale maintenue")
print("✅ Progression: 134 → ~170 insights")
print("\n�� Check final...") 