import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { sendAskMessage } from '../../components/askApi';

const initialMessages = [
  { from: 'bot', text: "Hi! I am here to help with any financial questions you may have." },
];

const exampleFollowUp = [
  { from: 'bot', text: 'Got. It. Is your stock.' },
  { from: 'bot', text: 'Do you have any of the following?' },
];

const followUpOptions = [
  { label: 'long-term' },
  { label: 'short-term' },
  { label: 'volatility' },
];

export default function AskScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [showYesNo, setShowYesNo] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    try {
      const data = await sendAskMessage(currentInput, 'test123');
      let botText = '';
      if (typeof data === 'string') {
        botText = data;
      } else if (data.response) {
        botText = data.response.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      } else if (data.message) {
        botText = data.message;
      } else {
        botText = JSON.stringify(data);
      }
      setMessages((prev) => [...prev, { from: 'bot', text: botText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Encountered a problem connecting to the server.'+ error },
      ]);
    }
    setShowYesNo(false);
    setShowFollowUp(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.bubble,
                msg.from === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={msg.from === 'user' ? styles.userText : styles.botText}>{msg.text}</Text>
            </View>
          ))}
          {showYesNo && (
            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.optionButton}><Text style={styles.optionText}>Yes</Text></TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}><Text style={styles.optionText}>No</Text></TouchableOpacity>
            </View>
          )}
          {showFollowUp && (
            <View style={styles.optionsRow}>
              {followUpOptions.map((opt) => (
                <TouchableOpacity key={opt.label} style={styles.optionButton}><Text style={styles.optionText}>{opt.label}</Text></TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type your symptom or question..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
  },
  botBubble: {
    backgroundColor: '#F2F2F2',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#1565C0',
    alignSelf: 'flex-end',
  },
  botText: {
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
    backgroundColor: '#E3ECF8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  optionText: {
    color: '#1565C0',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#F2F2F2',
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#F2F2F2',
    borderRadius: 24,
    fontSize: 16,
    color: '#222',
  },
  sendButton: {
    backgroundColor: '#1565C0',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
