import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { globalStyles } from '../styles/global';

const messages = [
  { from: 'FinanceNews', text: 'US Stock market is up 20% in the last quarter' },
  { from: 'EconomicIndicators', text: 'Job market is improving.' },
  { from: 'PolicticalEvents', text: 'Global markets are immunue to local political events' },
];

const options = ['Stocks', 'Futures', 'Indexes'];

export default function NewsScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.bubble,
              msg.from === 'user' ? styles.userBubble : styles.coachBubble,
            ]}
          >
            <Text style={msg.from === 'user' ? styles.userText : styles.coachText}>{msg.text}</Text>
          </View>
        ))}
        <View style={styles.optionsRow}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionButton,
                selected === opt && styles.selectedOptionButton,
              ]}
              onPress={() => setSelected(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selected === 'Yes' && (
          <View style={styles.bubble}>
            <Text style={styles.coachText}>
              That's great. Remember to check your blood pressure regularly
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
    padding: 16,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
  },
  coachBubble: {
    backgroundColor: '#F2F2F2',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  coachText: {
    color: '#222',
    fontSize: 16,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  selectedOptionButton: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#222',
    fontWeight: 'bold',
  },
}); 