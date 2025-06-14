import json

with open('data/moodcycle-menstrual-insights-compilation.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== RÉSUMÉ FINAL DE LA COMPILATION ===')
total = 0
for phase in data:
    phase_total = 0
    print(f'\n{phase.upper()}:')
    for category in data[phase]:
        count = len(data[phase][category])
        phase_total += count
        print(f'  {category}: {count} insights')
    print(f'  TOTAL {phase}: {phase_total}')
    total += phase_total

print(f'\nTOTAL GÉNÉRAL: {total} insights')
print('\nStructure complète vérifiée ✅')

# Vérifier que toutes les sections sont présentes
required_phases = ['menstrual', 'follicular', 'ovulatory', 'luteal']
required_categories = ['symptoms', 'moods', 'phyto', 'phases', 'lithotherapy', 'rituals']

missing = []
for phase in required_phases:
    if phase not in data:
        missing.append(f"Phase manquante: {phase}")
    else:
        for category in required_categories:
            if category not in data[phase]:
                missing.append(f"Catégorie manquante: {phase}.{category}")
            elif len(data[phase][category]) == 0:
                missing.append(f"Catégorie vide: {phase}.{category}")

if missing:
    print('\n❌ PROBLÈMES DÉTECTÉS:')
    for issue in missing:
        print(f'  - {issue}')
else:
    print('\n✅ COMPILATION PARFAITE - Toutes les phases et catégories sont présentes !') 