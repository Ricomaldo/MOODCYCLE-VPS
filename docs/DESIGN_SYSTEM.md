# Design System - MoodCycle

## 🎨 **Vue d'ensemble**

MoodCycle utilise un Design System centré sur les **phases du cycle menstruel** avec des couleurs spécifiques et un système de **contraste automatique** pour une accessibilité optimale.

---

## 🌈 **Couleurs**

### Palette principale
```js
colors: {
  primary: '#D81B60',      // Framboise Chaleureuse  
  secondary: '#CDDC39',    // Citron Vert Velouté
  background: '#FAFAFA',   // Brume d'Aube (fond)
  text: '#212121',         // Texte principal
  textLight: '#757575',    // Texte secondaire
}
```

### Couleurs des phases du cycle
```js
phases: {
  menstrual: '#F44336',    // Grenat Doux (rouge)
  follicular: '#FFC107',   // Miel Doré (jaune) 
  ovulatory: '#00BCD4',    // Lagune Calme (cyan)
  luteal: '#673AB7',       // Lavande Mystique (violet)
}
```

---

## ♿ **Contraste automatique**

### 🎯 Problème résolu
Le texte blanc sur fond jaune (`#FFC107`) était illisible. Notre solution calcule automatiquement la couleur de texte optimale selon le fond.

### 🔧 Utilisation

**Import** :
```js
import { theme } from '../config/theme';
```

**Usage simple** :
```js
const textColor = theme.getTextColorOn(phase.color);

<Text style={{ color: textColor }}>Mon texte</Text>
```

**Fonctions utilitaires** :
```js
theme.isLightColor('#FFC107') // true (jaune = clair)
theme.isDarkColor('#673AB7')  // true (violet = foncé)
```

### 📊 Résultats

| Couleur de fond | Couleur de texte | Lisibilité |
|-----------------|------------------|------------|
| `#F44336` (rouge) | `#FFFFFF` (blanc) | ✅ Parfaite |
| `#FFC107` (jaune) | `#212121` (noir) | ✅ Parfaite |
| `#00BCD4` (cyan) | `#FFFFFF` (blanc) | ✅ Parfaite |
| `#673AB7` (violet) | `#FFFFFF` (blanc) | ✅ Parfaite |

---

## 🔤 **Typographie**

### Polices utilisées
- **Quintessential** : Titres élégants (H1, H2)
- **Quicksand** : Corps de texte moderne (H3, Body, Small)

### Installation (Expo Google Fonts)
```bash
npx expo install @expo-google-fonts/quintessential @expo-google-fonts/quicksand
```

### Hiérarchie typographique

| Composant | Police | Taille | Usage |
|-----------|--------|--------|-------|
| `<Heading1>` | Quintessential | 24px | Titres principaux |
| `<Heading2>` | Quintessential | 20px | Sous-titres |
| `<Heading3>` | Quicksand Bold | 16px | Sections |
| `<BodyText>` | Quicksand Regular | 14px | Corps de texte |
| `<SmallText>` | Quicksand Regular | 10px | Annotations |

### Composants disponibles
```js
import { Heading1, Heading2, Heading3, BodyText, SmallText } from '../components/Typography';

// Alias pour compatibilité
import { Heading, Caption } from '../components/Typography';
```

---

## 📏 **Spacing & Layout**

### Système d'espacement
```js
spacing: {
  xs: 4,    // Très petit
  s: 8,     // Petit  
  m: 16,    // Moyen (standard)
  l: 24,    // Large
  xl: 32,   // Très large
  xxl: 48   // Extra large
}
```

### Border radius
```js
borderRadius: {
  small: 8,     // Boutons, inputs
  medium: 16,   // Cards, conteneurs
  large: 24,    // Modales, grandes sections
  pill: 999,    // Boutons ronds
}
```

---

## 🛠️ **Guidelines d'utilisation**

### ✅ **À faire**

**1. Contraste dynamique**
```js
// ✅ Bon : contraste automatique
const textColor = theme.getTextColorOn(backgroundColor);
<Text style={{ color: textColor }}>Texte lisible</Text>
```

**2. Hiérarchie claire**
```js
// ✅ Bon : hiérarchie respectée
<Heading1>Titre principal</Heading1>
<Heading2>Sous-titre</Heading2>
<BodyText>Corps de texte</BodyText>
```

**3. Couleurs des phases**
```js
// ✅ Bon : utilise les couleurs du thème
backgroundColor: theme.colors.phases[phase]
```

### ❌ **À éviter**

**1. Couleurs hardcodées**
```js
// ❌ Mauvais : couleur en dur
color: 'white' // Peut être illisible

// ✅ Bon : contraste automatique  
color: theme.getTextColorOn(bgColor)
```

**2. Polices système**
```js
// ❌ Mauvais : police système
fontFamily: 'Arial'

// ✅ Bon : polices du design system
fontFamily: theme.fonts.heading
```

---

## 🔍 **Exemples pratiques**

### Header avec fond coloré
```js
const headerTextColor = theme.getTextColorOn(phase.color);

<View style={{ backgroundColor: phase.color }}>
  <Heading1 style={{ color: headerTextColor }}>
    {phase.name}
  </Heading1>
</View>
```

### Card avec phase dynamique
```js
const phaseColor = theme.colors.phases[phase];
const textColor = theme.getTextColorOn(phaseColor);

<View style={{ backgroundColor: phaseColor }}>
  <BodyText style={{ color: textColor }}>
    {content}
  </BodyText>
</View>
```

### Bouton avec contraste
```js
const buttonColor = theme.colors.primary;
const buttonTextColor = theme.getTextColorOn(buttonColor);

<TouchableOpacity style={{ backgroundColor: buttonColor }}>
  <BodyText style={{ color: buttonTextColor }}>
    Action
  </BodyText>
</TouchableOpacity>
```

---

## 🏗️ **Architecture technique**

### Fichiers clés
- `config/theme.js` - Configuration centralisée
- `utils/colors.js` - Utilitaires de contraste
- `components/Typography/` - Composants texte
- `app/_layout.jsx` - Chargement des polices

### Formule de contraste (W3C)
```js
// Calcul de luminance relative
const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
return luminance > 186 ? '#212121' : '#FFFFFF';
```

---

## 🚀 **Maintenance**

### Ajouter une nouvelle couleur
1. Ajouter dans `theme.colors`
2. Utiliser `theme.getTextColorOn()` automatiquement
3. Tester la lisibilité

### Ajouter un composant Typography
1. Définir le style dans `theme.typography`
2. Créer le composant dans `Typography/index.js`
3. Exporter et documenter

### Problème de contraste
1. Vérifier que `theme.getTextColorOn()` est utilisé
2. Ajuster le seuil de luminance si nécessaire (186)
3. Tester sur device réel

---

**🎉 Design System MoodCycle - Version 1.0**  
*Élégant, accessible et maintenable* 