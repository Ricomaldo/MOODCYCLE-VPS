import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../../config/theme';
import phases from '../../../../data/phases.json';
import { Heading, BodyText, Caption } from '../../../../components/Typography';

export default function PhaseDetailScreen() {
  const { id } = useLocalSearchParams();
  const phase = phases[id];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (!phase) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <BodyText>Phase non trouvée</BodyText>
      </View>
    );
  }

  // Calcul automatique de la couleur de texte selon le fond de la phase
  const headerTextColor = theme.getTextColorOn(phase.color);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header unifié avec contraste automatique */}
      <View style={[styles.unifiedHeader, { backgroundColor: phase.color }]}>
        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={headerTextColor} />
          </TouchableOpacity>
          <BodyText style={[styles.breadcrumb, { color: headerTextColor }]}>Mon cycle</BodyText>
        </View>
        <Heading style={[styles.title, { color: headerTextColor }]}>{phase.name}</Heading>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Ligne avec icône et durée */}
          <View style={styles.durationRow}>
            <BodyText style={styles.symbolSmall}>{phase.symbol}</BodyText>
            <Caption style={styles.duration}>{phase.duration}</Caption>
          </View>
          
          <BodyText style={styles.description}>{phase.description}</BodyText>

          <Heading style={styles.sectionTitle}>Caractéristiques</Heading>
          <View style={styles.section}>
            {phase.characteristics.physical.map((item, index) => (
              <BodyText key={index} style={styles.listItem}>• {item}</BodyText>
            ))}
          </View>

          <Heading style={styles.sectionTitle}>Conseils</Heading>
          <View style={styles.section}>
            {phase.advice.nutrition.map((item, index) => (
              <BodyText key={index} style={styles.listItem}>• {item}</BodyText>
            ))}
          </View>

          <BodyText style={styles.affirmation}>"{phase.affirmation}"</BodyText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  unifiedHeader: {
    padding: theme.spacing.l,
    paddingTop: theme.spacing.s,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  backButton: {
    marginRight: theme.spacing.m,
  },
  breadcrumb: {
    fontSize: 16,
    opacity: 0.9,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.m,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  symbolSmall: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  duration: {
    fontSize: 18,
    color: theme.colors.text,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  section: {
    marginBottom: theme.spacing.m,
  },
  listItem: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  affirmation: {
    fontSize: 18,
    fontStyle: 'italic',
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
  },
}); 