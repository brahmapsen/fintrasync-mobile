import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function IndicatorsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.heading}>Economic and General Indicators</Text>

      {/* Section 1: Modeling Human Behavior */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Modeling Human Behavior</Text>
        <Text style={styles.sectionText}>
          Researchers have developed models to predict economic trends by analyzing patterns in human behavior, such as spending, saving, and investing. These models often use data from social media, transaction records, and surveys to understand and forecast market movements.
        </Text>
      </View>

      {/* Section 2: Sentiment Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Sentiment Analysis</Text>
        <Text style={styles.sectionText}>
          Sentiment analysis uses natural language processing to gauge public mood from news, social media, and financial reports. This helps investors and policymakers anticipate market shifts and economic changes.
        </Text>
      </View>

      {/* Section 3: Current News */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Current News</Text>
        <Text style={styles.sectionText}>
          • The US economy added 147,000 jobs in June 2025, with unemployment falling to 4.1%, signaling a healthier labor market. (Source: MarketPulse)
        </Text>
        <Text style={styles.sectionText}>
          • Despite high interest rates and inflation, the US economy grew by over 3% in late 2024, but many Americans remain concerned about the cost of living. (Source: NPR)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#001F3F',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1565C0',
  },
  sectionText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
});
