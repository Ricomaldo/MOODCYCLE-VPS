import json
import glob
import os
import re

# Dictionnaire pour stocker tous les insights par phase et catégorie
all_insights = {}

# Lire tous les fichiers JSON dans le dossier data
files = glob.glob('data/moodcycle-menstrual-insights*.json')

for file_path in files:
    if 'compilation' in file_path:
        continue
    
    print(f"Traitement de {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Nettoyer les commentaires JSON invalides
            content = re.sub(r'//.*', '', content)
            content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
            content = content.replace('/* Existing insights */', '')
            content = content.replace('/* Existing insights */,', '')
            content = content.replace('[...]', '[]')
            content = content.replace('[/* Existing insights */]', '[]')
            content = content.replace(',...', '')
            
            # Séparer les objets JSON multiples
            objects = []
            depth = 0
            start = 0
            
            for i, char in enumerate(content):
                if char == '{':
                    if depth == 0:
                        start = i
                    depth += 1
                elif char == '}':
                    depth -= 1
                    if depth == 0:
                        try:
                            obj_str = content[start:i+1]
                            obj = json.loads(obj_str)
                            objects.append(obj)
                        except json.JSONDecodeError as e:
                            print(f"Erreur JSON dans {file_path}: {e}")
            
            # Traiter chaque objet JSON
            for data in objects:
                for phase, categories in data.items():
                    if phase not in all_insights:
                        all_insights[phase] = {}
                    
                    if isinstance(categories, dict):
                        for category, insights in categories.items():
                            if category not in all_insights[phase]:
                                all_insights[phase][category] = []
                            
                            if isinstance(insights, list):
                                # Ajouter les insights s'ils n'existent pas déjà
                                existing_ids = {insight['id'] for insight in all_insights[phase][category] if isinstance(insight, dict) and 'id' in insight}
                                
                                for insight in insights:
                                    if isinstance(insight, dict) and 'id' in insight and insight['id'] not in existing_ids:
                                        all_insights[phase][category].append(insight)
                                        existing_ids.add(insight['id'])
    
    except Exception as e:
        print(f'Erreur avec {file_path}: {e}')

# Compter les insights par phase et catégorie
print("\n=== RÉSUMÉ ===")
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

# Écrire le fichier consolidé
with open('data/moodcycle-menstrual-insights-compilation.json', 'w', encoding='utf-8') as f:
    json.dump(all_insights, f, ensure_ascii=False, indent=2)

print('\nConsolidation terminée et sauvegardée !') 