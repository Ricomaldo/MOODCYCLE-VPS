import json

# Charger le fichier actuel
with open('data/moodcycle-menstrual-insights-compilation.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("📊 Analyse de la répartition actuelle:")

# Analyser la distribution par phase et ton
for phase in data:
    print(f'\n{phase.upper()}:')
    tone_counts = {'friendly': 0, 'professional': 0, 'inspiring': 0}
    jeza_scores = []
    
    for category in data[phase]:
        for insight in data[phase][category]:
            tone_counts[insight['tone']] += 1
            jeza_scores.append(insight['jezaApproval'])
    
    total = sum(tone_counts.values())
    print(f'  Total: {total} insights')
    for tone, count in tone_counts.items():
        percentage = (count / total) * 100 if total > 0 else 0
        print(f'  {tone}: {count} ({percentage:.1f}%)')
    
    avg_jeza = sum(jeza_scores) / len(jeza_scores) if jeza_scores else 0
    print(f'  Moyenne Jeza: {avg_jeza:.2f}')

print("\n🎯 Objectif d'équilibrage:")
print("- Menstrual: maintenir ~44 insights (déjà équilibrée)")
print("- Follicular: maintenir ~54 insights (bien équilibrée)")
print("- Ovulatory: passer de 18 à ~40 insights")
print("- Luteal: passer de 18 à ~40 insights")
print("- Total visé: ~180 insights")
print("- Répartition tonale visée: 33% friendly, 33% professional, 33% inspiring")
print("- Score Jeza moyen visé: 3.5-4.0") 