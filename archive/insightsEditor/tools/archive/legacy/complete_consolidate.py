import json

# Charger le fichier existant
with open('data/moodcycle-menstrual-insights-compilation.json', 'r', encoding='utf-8') as f:
    all_insights = json.load(f)

print("Fichier actuel chargé")

# Ajouter les insights phyto manquants pour menstrual
menstrual_phyto_missing = [
    {
        "id": "M_phyto_friendly_01",
        "content": "Coucou ! 🌿 La camomille sera ton amie aujourd'hui. Une tisane chaude et hop, du réconfort en perspective !",
        "targetPreferences": ["phyto"],
        "tone": "friendly",
        "phase": "menstrual",
        "jezaApproval": 3
    },
    {
        "id": "M_phyto_friendly_02",
        "content": "Salut ! 🍃 La sauge t'offre son réconfort. Une infusion magique qui te fait du bien, tu veux essayer ?",
        "targetPreferences": ["phyto"],
        "tone": "friendly",
        "phase": "menstrual",
        "jezaApproval": 3
    },
    {
        "id": "M_phyto_friendly_03",
        "content": "Hey ! 🌱 Le gingembre, c'est ton super-héros du moment. Une tisane épicée qui réchauffe et soulage !",
        "targetPreferences": ["phyto"],
        "tone": "friendly",
        "phase": "menstrual",
        "jezaApproval": 2
    },
    {
        "id": "M_phyto_professional_01",
        "content": "L'extrait de gingembre présente des propriétés anti-inflammatoires significatives, particulièrement recommandé lors des dysménorrhées avec une intention de soulagement doux.",
        "targetPreferences": ["phyto"],
        "tone": "professional",
        "phase": "menstrual",
        "jezaApproval": 3
    },
    {
        "id": "M_phyto_professional_02",
        "content": "La camomille offre des propriétés apaisantes qui peuvent accompagner naturellement les variations physiologiques menstruelles.",
        "targetPreferences": ["phyto"],
        "tone": "professional",
        "phase": "menstrual",
        "jezaApproval": 4
    }
]

# Ajouter les phyto manquants
existing_ids = {insight['id'] for insight in all_insights['menstrual']['phyto']}
for insight in menstrual_phyto_missing:
    if insight['id'] not in existing_ids:
        all_insights['menstrual']['phyto'].insert(0, insight)

# Ajouter follicular
all_insights['follicular'] = {
    "symptoms": [
        {
            "id": "F_symptoms_friendly_01",
            "content": "Hey ! 💕 Ton corps se réveille doucement. L'énergie revient, tu sens ce petit picotement de vie ?",
            "targetPreferences": ["symptoms"],
            "tone": "friendly",
            "phase": "follicular",
            "jezaApproval": 4
        },
        {
            "id": "F_symptoms_friendly_02",
            "content": "Coucou ! 🌱 La fatigue commence à s'éloigner. Tu peux célébrer ce petit regain d'énergie !",
            "targetPreferences": ["symptoms"],
            "tone": "friendly",
            "phase": "follicular",
            "jezaApproval": 3
        },
        {
            "id": "F_symptoms_professional_01",
            "content": "La phase folliculaire s'accompagne d'une restauration progressive de l'énergie physiologique, marquant un nouveau cycle de régénération.",
            "targetPreferences": ["symptoms"],
            "tone": "professional",
            "phase": "follicular",
            "jezaApproval": 4
        },
        {
            "id": "F_symptoms_inspiring_01",
            "content": "✨ Ton corps est un jardin en éveil. Chaque cellule murmure une promesse de renaissance et de croissance.",
            "targetPreferences": ["symptoms"],
            "tone": "inspiring",
            "phase": "follicular",
            "jezaApproval": 5
        },
        {
            "id": "F_symptoms_inspiring_02",
            "content": "🌱 Tu es un bourgeon qui s'ouvre. La vie en toi danse, prépare ses plus beaux mouvements.",
            "targetPreferences": ["symptoms"],
            "tone": "inspiring",
            "phase": "follicular",
            "jezaApproval": 5
        }
    ],
    "moods": [
        {
            "id": "F_moods_friendly_01",
            "content": "Hey ! 💖 La créativité revient en force. Prête à danser avec tes idées ?",
            "targetPreferences": ["moods"],
            "tone": "friendly",
            "phase": "follicular",
            "jezaApproval": 4
        },
        {
            "id": "F_moods_professional_01",
            "content": "L'augmentation des œstrogènes favorise naturellement une stabilité émotionnelle et une dynamique créative.",
            "targetPreferences": ["moods"],
            "tone": "professional",
            "phase": "follicular",
            "jezaApproval": 3
        },
        {
            "id": "F_moods_inspiring_01",
            "content": "✨ Tes émotions sont des rivières qui s'élargissent. La vie en toi chante ses possibles, ses promesses.",
            "targetPreferences": ["moods"],
            "tone": "inspiring",
            "phase": "follicular",
            "jezaApproval": 5
        }
    ],
    "phyto": [
        {
            "id": "F_phyto_friendly_01",
            "content": "Coucou ! 🌿 La menthe poivrée va booster ta pêche. Une tisane qui réveille !",
            "targetPreferences": ["phyto"],
            "tone": "friendly",
            "phase": "follicular",
            "jezaApproval": 3
        },
        {
            "id": "F_phyto_professional_01",
            "content": "Le basilic offre des propriétés stimulantes qui peuvent soutenir naturellement votre regain d'énergie.",
            "targetPreferences": ["phyto"],
            "tone": "professional",
            "phase": "follicular",
            "jezaApproval": 4
        },
        {
            "id": "F_phyto_inspiring_01",
            "content": "✨ Chaque plante est une alchimiste. Le romarin chante la vie qui se réveille en toi.",
            "targetPreferences": ["phyto"],
            "tone": "inspiring",
            "phase": "follicular",
            "jezaApproval": 5
        }
    ],
    "phases": [
        {
            "id": "F_phases_friendly_01",
            "content": "Hey ! 🌱 L'énergie monte. Tu sens cette petite flamme qui recommence à briller ?",
            "targetPreferences": ["phases"],
            "tone": "friendly",
            "phase": "follicular",
            "jezaApproval": 4
        },
        {
            "id": "F_phases_professional_01",
            "content": "La phase folliculaire représente un moment optimal de reconstruction et de préparation physiologique.",
            "targetPreferences": ["phases"],
            "tone": "professional",
            "phase": "follicular",
            "jezaApproval": 3
        },
        {
            "id": "F_phases_inspiring_01",
            "content": "✨ Tu es un bourgeon qui s'ouvre. La vie en toi prépare ses plus beaux mouvements, ses plus grandes danses.",
            "targetPreferences": ["phases"],
            "tone": "inspiring",
            "phase": "follicular",
            "jezaApproval": 5
        }
    ],
    "lithotherapy": [
        {
            "id": "F_lithotherapy_friendly_01",
            "content": "Salut ! 💎 Le citrine va booster ta créativité. Un petit rayon de soleil minéral !",
            "targetPreferences": ["lithotherapy"],
            "tone": "friendly",
            "phase": "follicular",
            "jezaApproval": 3
        },
        {
            "id": "F_lithotherapy_professional_01",
            "content": "Le quartz clair peut favoriser la clarté mentale et soutenir les processus créatifs.",
            "targetPreferences": ["lithotherapy"],
            "tone": "professional",
            "phase": "follicular",
            "jezaApproval": 4
        },
        {
            "id": "F_lithotherapy_inspiring_01",
            "content": "✨ Chaque cristal est un miroir de ton âme. Le citrine chante la lumière qui grandit en toi.",
            "targetPreferences": ["lithotherapy"],
            "tone": "inspiring",
            "phase": "follicular",
            "jezaApproval": 5
        }
    ],
    "rituals": [
        {
            "id": "F_rituals_friendly_01",
            "content": "Coucou ! 🌟 Un petit brainstorming créatif ? Laisse tes idées danser !",
            "targetPreferences": ["rituals"],
            "tone": "friendly",
            "phase": "follicular",
            "jezaApproval": 4
        },
        {
            "id": "F_rituals_professional_01",
            "content": "La pratique de la visualisation peut soutenir l'émergence de nouvelles perspectives et intentions.",
            "targetPreferences": ["rituals"],
            "tone": "professional",
            "phase": "follicular",
            "jezaApproval": 3
        },
        {
            "id": "F_rituals_inspiring_01",
            "content": "✨ Ton journal est un jardin. Chaque mot que tu y sèmes est une graine de devenir.",
            "targetPreferences": ["rituals"],
            "tone": "inspiring",
            "phase": "follicular",
            "jezaApproval": 5
        }
    ]
}

# Ajouter ovulatory
all_insights['ovulatory'] = {
    "symptoms": [
        {
            "id": "O_symptoms_friendly_01",
            "content": "Hey ! ✨ Ton énergie est au top ! Tu rayonnes, c'est magique !",
            "targetPreferences": ["symptoms"],
            "tone": "friendly",
            "phase": "ovulatory",
            "jezaApproval": 4
        },
        {
            "id": "O_symptoms_professional_01",
            "content": "Le pic d'œstrogènes optimise vos fonctions physiologiques et cognitives.",
            "targetPreferences": ["symptoms"],
            "tone": "professional",
            "phase": "ovulatory",
            "jezaApproval": 3
        },
        {
            "id": "O_symptoms_inspiring_01",
            "content": "✨ Tu es un soleil en pleine gloire. Ton corps danse la symphonie de la vie.",
            "targetPreferences": ["symptoms"],
            "tone": "inspiring",
            "phase": "ovulatory",
            "jezaApproval": 5
        }
    ],
    "moods": [
        {
            "id": "O_moods_friendly_01",
            "content": "Salut ma belle ! 💖 Tu es rayonnante, sociable, magnétique ! Profite de cette énergie !",
            "targetPreferences": ["moods"],
            "tone": "friendly",
            "phase": "ovulatory",
            "jezaApproval": 4
        },
        {
            "id": "O_moods_professional_01",
            "content": "L'équilibre hormonal optimal favorise la confiance en soi et l'expression sociale.",
            "targetPreferences": ["moods"],
            "tone": "professional",
            "phase": "ovulatory",
            "jezaApproval": 3
        },
        {
            "id": "O_moods_inspiring_01",
            "content": "✨ Tu es un aimant de lumière. Tes émotions sont des rayons de soleil qui illuminent tout autour de toi.",
            "targetPreferences": ["moods"],
            "tone": "inspiring",
            "phase": "ovulatory",
            "jezaApproval": 5
        }
    ],
    "phyto": [
        {
            "id": "O_phyto_friendly_01",
            "content": "Coucou ! 🌸 Les fleurs d'hibiscus vont sublimer ton éclat. Une tisane de reine !",
            "targetPreferences": ["phyto"],
            "tone": "friendly",
            "phase": "ovulatory",
            "jezaApproval": 3
        },
        {
            "id": "O_phyto_professional_01",
            "content": "Les plantes adaptogènes peuvent soutenir l'équilibre énergétique optimal de cette phase.",
            "targetPreferences": ["phyto"],
            "tone": "professional",
            "phase": "ovulatory",
            "jezaApproval": 4
        },
        {
            "id": "O_phyto_inspiring_01",
            "content": "✨ Les fleurs sont tes sœurs de lumière. Elles célèbrent avec toi l'apogée de ta féminité.",
            "targetPreferences": ["phyto"],
            "tone": "inspiring",
            "phase": "ovulatory",
            "jezaApproval": 5
        }
    ],
    "phases": [
        {
            "id": "O_phases_friendly_01",
            "content": "Hey ! 🌟 C'est ton moment de gloire ! Tu es au sommet de ton cycle, profite !",
            "targetPreferences": ["phases"],
            "tone": "friendly",
            "phase": "ovulatory",
            "jezaApproval": 4
        },
        {
            "id": "O_phases_professional_01",
            "content": "La phase ovulatoire représente l'apogée énergétique de votre cycle menstruel.",
            "targetPreferences": ["phases"],
            "tone": "professional",
            "phase": "ovulatory",
            "jezaApproval": 3
        },
        {
            "id": "O_phases_inspiring_01",
            "content": "✨ Tu es un soleil à midi. Cette phase est ton apogée, ta pleine lune intérieure.",
            "targetPreferences": ["phases"],
            "tone": "inspiring",
            "phase": "ovulatory",
            "jezaApproval": 5
        }
    ],
    "lithotherapy": [
        {
            "id": "O_lithotherapy_friendly_01",
            "content": "Salut ! 💎 La cornaline va amplifier ton rayonnement. Un petit feu d'artifice minéral !",
            "targetPreferences": ["lithotherapy"],
            "tone": "friendly",
            "phase": "ovulatory",
            "jezaApproval": 3
        },
        {
            "id": "O_lithotherapy_professional_01",
            "content": "La cornaline peut soutenir l'expression de votre énergie créative et sociale.",
            "targetPreferences": ["lithotherapy"],
            "tone": "professional",
            "phase": "ovulatory",
            "jezaApproval": 4
        },
        {
            "id": "O_lithotherapy_inspiring_01",
            "content": "✨ Chaque cristal chante ta lumière. La cornaline danse avec ton feu intérieur.",
            "targetPreferences": ["lithotherapy"],
            "tone": "inspiring",
            "phase": "ovulatory",
            "jezaApproval": 5
        }
    ],
    "rituals": [
        {
            "id": "O_rituals_friendly_01",
            "content": "Coucou ! 🎉 C'est le moment des projets créatifs ! Lance-toi, tu es irrésistible !",
            "targetPreferences": ["rituals"],
            "tone": "friendly",
            "phase": "ovulatory",
            "jezaApproval": 4
        },
        {
            "id": "O_rituals_professional_01",
            "content": "Cette phase favorise la concrétisation de projets et l'expression publique.",
            "targetPreferences": ["rituals"],
            "tone": "professional",
            "phase": "ovulatory",
            "jezaApproval": 3
        },
        {
            "id": "O_rituals_inspiring_01",
            "content": "✨ C'est le temps de l'action sacrée. Tes projets sont des offrandes à la vie.",
            "targetPreferences": ["rituals"],
            "tone": "inspiring",
            "phase": "ovulatory",
            "jezaApproval": 5
        }
    ]
}

# Ajouter luteal
all_insights['luteal'] = {
    "symptoms": [
        {
            "id": "L_symptoms_friendly_01",
            "content": "Coucou ! 💛 Ton corps ralentit doucement. C'est le moment de la douceur avec toi-même !",
            "targetPreferences": ["symptoms"],
            "tone": "friendly",
            "phase": "luteal",
            "jezaApproval": 4
        },
        {
            "id": "L_symptoms_professional_01",
            "content": "La diminution hormonale induit naturellement une période de ralentissement physiologique.",
            "targetPreferences": ["symptoms"],
            "tone": "professional",
            "phase": "luteal",
            "jezaApproval": 3
        },
        {
            "id": "L_symptoms_inspiring_01",
            "content": "✨ Ton corps murmure l'invitation au repos. C'est le temps de l'écoute intérieure profonde.",
            "targetPreferences": ["symptoms"],
            "tone": "inspiring",
            "phase": "luteal",
            "jezaApproval": 5
        }
    ],
    "moods": [
        {
            "id": "L_moods_friendly_01",
            "content": "Hey ! 💕 Un peu plus sensible ? C'est ton cœur qui s'ouvre plus grand. Accueille ça avec tendresse !",
            "targetPreferences": ["moods"],
            "tone": "friendly",
            "phase": "luteal",
            "jezaApproval": 4
        },
        {
            "id": "L_moods_professional_01",
            "content": "Les variations hormonales peuvent intensifier la sensibilité émotionnelle, favorisant l'introspection.",
            "targetPreferences": ["moods"],
            "tone": "professional",
            "phase": "luteal",
            "jezaApproval": 3
        },
        {
            "id": "L_moods_inspiring_01",
            "content": "✨ Tes émotions sont des vagues profondes. Chaque sentiment est une perle de sagesse.",
            "targetPreferences": ["moods"],
            "tone": "inspiring",
            "phase": "luteal",
            "jezaApproval": 5
        }
    ],
    "phyto": [
        {
            "id": "L_phyto_friendly_01",
            "content": "Salut ! 🌿 La verveine va t'apaiser en douceur. Une tisane comme un câlin !",
            "targetPreferences": ["phyto"],
            "tone": "friendly",
            "phase": "luteal",
            "jezaApproval": 4
        },
        {
            "id": "L_phyto_professional_01",
            "content": "Les plantes relaxantes peuvent soutenir l'équilibre émotionnel durant cette phase.",
            "targetPreferences": ["phyto"],
            "tone": "professional",
            "phase": "luteal",
            "jezaApproval": 3
        },
        {
            "id": "L_phyto_inspiring_01",
            "content": "✨ Les plantes sont tes guides vers l'intérieur. Elles t'accompagnent dans ton voyage vers toi-même.",
            "targetPreferences": ["phyto"],
            "tone": "inspiring",
            "phase": "luteal",
            "jezaApproval": 5
        }
    ],
    "phases": [
        {
            "id": "L_phases_friendly_01",
            "content": "Hey ! 🌙 C'est le moment de lever le pied. Ton corps te demande de la douceur !",
            "targetPreferences": ["phases"],
            "tone": "friendly",
            "phase": "luteal",
            "jezaApproval": 4
        },
        {
            "id": "L_phases_professional_01",
            "content": "La phase lutéale favorise naturellement l'introspection et la préparation au nouveau cycle.",
            "targetPreferences": ["phases"],
            "tone": "professional",
            "phase": "luteal",
            "jezaApproval": 3
        },
        {
            "id": "L_phases_inspiring_01",
            "content": "✨ Tu es une lune qui décroît, préparant en secret ta prochaine renaissance.",
            "targetPreferences": ["phases"],
            "tone": "inspiring",
            "phase": "luteal",
            "jezaApproval": 5
        }
    ],
    "lithotherapy": [
        {
            "id": "L_lithotherapy_friendly_01",
            "content": "Coucou ! 💎 L'améthyste va t'aider à rester zen. Un petit cocon minéral !",
            "targetPreferences": ["lithotherapy"],
            "tone": "friendly",
            "phase": "luteal",
            "jezaApproval": 4
        },
        {
            "id": "L_lithotherapy_professional_01",
            "content": "L'améthyste peut favoriser la détente et l'équilibre émotionnel.",
            "targetPreferences": ["lithotherapy"],
            "tone": "professional",
            "phase": "luteal",
            "jezaApproval": 3
        },
        {
            "id": "L_lithotherapy_inspiring_01",
            "content": "✨ Chaque cristal est un gardien de paix. L'améthyste veille sur ton repos intérieur.",
            "targetPreferences": ["lithotherapy"],
            "tone": "inspiring",
            "phase": "luteal",
            "jezaApproval": 5
        }
    ],
    "rituals": [
        {
            "id": "L_rituals_friendly_01",
            "content": "Salut ! 🕯️ Un petit cocooning ? C'est le moment parfait pour te chouchouter !",
            "targetPreferences": ["rituals"],
            "tone": "friendly",
            "phase": "luteal",
            "jezaApproval": 4
        },
        {
            "id": "L_rituals_professional_01",
            "content": "Les pratiques de relaxation et d'introspection sont particulièrement bénéfiques durant cette phase.",
            "targetPreferences": ["rituals"],
            "tone": "professional",
            "phase": "luteal",
            "jezaApproval": 3
        },
        {
            "id": "L_rituals_inspiring_01",
            "content": "✨ Le silence est ton temple. Chaque moment de repos est une prière à ton être.",
            "targetPreferences": ["rituals"],
            "tone": "inspiring",
            "phase": "luteal",
            "jezaApproval": 5
        }
    ]
}

# Calcul et affichage du résumé
print("\n=== RÉSUMÉ FINAL ===")
total_insights = 0
for phase in all_insights:
    phase_total = 0
    print(f"\n{phase.upper()}:")
    for category in all_insights[phase]:
        count = len(all_insights[phase][category])
        phase_total += count
        print(f"  {category}: {count} insights")
    print(f"  TOTAL {phase}: {phase_total}")
    total_insights += phase_total

print(f"\nTOTAL GÉNÉRAL: {total_insights} insights")

# Sauvegarder
with open('data/moodcycle-menstrual-insights-compilation.json', 'w', encoding='utf-8') as f:
    json.dump(all_insights, f, ensure_ascii=False, indent=2)

print('\n✅ Compilation complète terminée et sauvegardée !') 