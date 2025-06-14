import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';
import InsightsV2Debug from '../../components/DevNavigation/InsightsV2Debug';

export default function InsightsDebugPage() {
  return (
    <SafeAreaView style={styles.container}>
      <InsightsV2Debug />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
}); 