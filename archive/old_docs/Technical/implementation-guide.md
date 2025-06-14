# Guide d'Implémentation - Algorithme de Mapping Personas
## Spécifications Techniques et Plan de Développement

### Objectif Technique

Développer un algorithme déterministe qui transforme les données collectées durant l'onboarding MoodCycle en assignation précise d'un persona utilisateur. Cette fonction constituera le socle technique de la personnalisation des insights quotidiens et du contexte conversationnel transmis à l'API Claude.

### Architecture des Données d'Entrée

#### Variables Actuellement Collectées

L'onboarding capture actuellement quatre catégories de données exploitables pour le calcul algorithmique. Le choix de voyage propose trois options révélant la motivation profonde de l'utilisatrice. Les six préférences quantifiées sur une échelle de zéro à cinq mesurent l'expertise et les centres d'intérêt spécifiques. Le style de communication sélectionné et l'avatar choisi complètent le profil comportemental.

#### Variable Supplémentaire Requise

L'ajout d'un indicateur de tranche d'âge s'avère nécessaire pour distinguer efficacement entre personas présentant des caractéristiques techniques similaires. Cette variable facilitera particulièrement la discrimination entre Emma et Clara, toutes deux potentiellement intéressées par les aspects techniques mais à des niveaux de maturité différents.

### Profils Persona Référence

#### Emma - Novice Curieuse
Emma privilégiera le voyage de reconnexion corporelle avec des préférences modérées et équilibrées reflétant sa phase d'exploration. Son choix s'orientera vers un ton amical et un avatar classique rassurant. Sa tranche d'âge se situera entre dix-huit et vingt-cinq ans.

#### Laure - Professionnelle Équilibrée
Laure sélectionnera le voyage de révélation de sa vraie nature avec des préférences élevées concernant l'énergie des phases et les rituels bien-être. Elle privilégiera un ton professionnel ou inspirant avec un avatar moderne. Sa tranche d'âge s'établira entre vingt-six et quarante-cinq ans.

#### Sylvie - Femme en Transition
Sylvie choisira le voyage de maîtrise émotionnelle avec des préférences marquées pour les symptômes physiques et la phytothérapie. Son ton restera amical ou professionnel avec un avatar classique. Sa tranche d'âge se situera entre quarante-six et cinquante-cinq ans.

#### Christine - Sage Épanouie
Christine optera pour le voyage de révélation avec des préférences maximales concernant l'énergie des phases et la lithothérapie. Elle privilégiera un ton inspirant avec un avatar mystique. Sa tranche d'âge dépassera cinquante-cinq ans.

#### Clara - Enthousiaste Connectée
Clara présentera des préférences uniformément élevées dans toutes les dimensions avec un ton professionnel et un avatar moderne. Sa tranche d'âge se situera entre vingt-six et trente-cinq ans. Son profil se distinguera par l'expertise généralisée plutôt que par des spécialisations particulières.

### Algorithme de Scoring

#### Variables Dérivées

Le système calculera automatiquement plusieurs indicateurs synthétiques à partir des données brutes. La moyenne des préférences révélera le niveau de sophistication général. Le nombre de préférences supérieures à quatre indiquera l'étendue de l'expertise. La préférence maximale signalera les domaines de spécialisation privilégiés.

#### Formules de Calcul

Chaque persona bénéficiera d'une formule de scoring spécifique pondérant différemment les variables selon leur capacité discriminante. Emma obtiendra des points élevés pour les choix novices et les préférences modérées. Laure sera favorisée par les selections professionnelles et l'expertise ciblée. Sylvie bénéficiera des choix orientés transition et solutions naturelles. Christine sera privilégiée par les selections spirituelles et l'expertise maximale. Clara obtiendra des scores élevés pour l'expertise généraliste et les choix techniques.

#### Fonction de Décision

L'algorithme calculera les cinq scores persona et retournera celui présentant la valeur la plus élevée. Des mécanismes de gestion des égalités et de validation de la confiance assureront la robustesse du système face aux cas limites.

### Plan de Validation Empirique

#### Phase de Simulation

La thérapeute conseil réalisera l'onboarding complet en incarnant successivement chaque persona selon leurs caractéristiques documentées. Cette simulation produira cinq jeux de données de référence correspondant aux réponses typiques attendues pour chaque profil utilisateur.

#### Calibrage des Coefficients

Les données simulées permettront de tester et d'ajuster les coefficients des formules de scoring. L'objectif consistera à obtenir une assignation correcte pour chaque persona simulé avec un écart significatif par rapport aux autres scores, garantissant ainsi la fiabilité de la discrimination algorithmique.

#### Validation Croisée

Des profils utilisateur mixtes seront testés pour vérifier la robustesse de l'algorithme face aux cas atypiques et aux combinaisons inattendues de réponses. Cette phase identifiera les ajustements nécessaires pour gérer les profils intermédiaires.

### Implémentation Technique

#### Intégration au Store Zustand

L'algorithme sera implémenté dans le store `useOnboardingStore` avec une fonction `calculatePersona()` appelée à la finalisation de l'onboarding. Le persona assigné sera persisté dans le storage local et utilisé pour toutes les interactions ultérieures.

#### Interface avec les Insights

Le système de sélection des insights quotidiens intégrera le persona comme critère principal de filtrage, complété par la phase cyclique et les préférences spécifiques. Cette approche multicritères garantira une personnalisation sophistiquée tout en maintenant la pertinence temporelle.

#### Contexte Conversationnel

Le persona déterminé constituera l'élément central du prompt système transmis à l'API Claude via le middleware VPS. Cette information permettra d'adapter automatiquement le comportement conversationnel de Melune selon le profil utilisateur identifié.

### Évolution des Insights Existants

#### Stratégie d'Enrichissement

La base actuelle de cent soixante-dix insights validés sera enrichie par l'ajout de variants persona plutôt que remplacée. Chaque insight conservera sa version de base et recevra cinq adaptations correspondant aux caractéristiques spécifiques de chaque persona.

#### Processus de Création

La thérapeute conseil utilisera l'outil d'édition existant pour créer les variants persona en s'appuyant sur les caractéristiques documentées de chaque profil. Cette approche préservera l'expertise thérapeutique tout en démultipliant la capacité de personnalisation.

#### Système de Sélection

L'algorithme de sélection quotidienne intégrera la dimension persona en priorité, filtrera selon la phase cyclique, puis affinera selon les préférences utilisateur. Le système anti-répétition existant sera adapté pour fonctionner au niveau des insights de base.

### Métriques de Performance

Le système devra atteindre une précision d'assignation de quatre-vingt-cinq pour cent avec un écart minimal de quinze points entre le persona assigné et le second choix. La robustesse face aux données incomplètes et la stabilité des résultats constitueront des critères de validation additionnels.

### Considérations de Maintenance

L'évolution du système nécessitera des processus de réévaluation périodique des coefficients selon les retours utilisateur et les données d'usage. La gestion de l'évolution des profils utilisateur dans le temps constituera un défi technique et expérientiel à anticiper dans les versions futures.