import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../app/styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    risk_tolerance: '',
    assets: '',
    home_owner: '',
    investment: '',
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await AsyncStorage.getItem('profileData');
        if (data) {
          setFormData(JSON.parse(data));
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      }
    };

    loadProfileData();
  }, []);

  const handleSubmit = async () => {
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify(formData));
      router.back();
    } catch (err) {
      console.error('Error saving profile data:', err);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="years"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    formData.gender === 'Male' && styles.genderButtonSelected
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'Male' })}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.gender === 'Male' && styles.genderButtonTextSelected
                  ]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    formData.gender === 'Female' && styles.genderButtonSelected
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'Female' })}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.gender === 'Female' && styles.genderButtonTextSelected
                  ]}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    formData.gender === 'Other' && styles.genderButtonSelected
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'Other' })}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.gender === 'Other' && styles.genderButtonTextSelected
                  ]}>Other</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Risk Tolerance</Text>
              <TextInput
                style={styles.input}
                placeholder="inches"
                keyboardType="numeric"
                value={formData.risk_tolerance}
                onChangeText={(text) => setFormData({ ...formData, risk_tolerance: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assets</Text>
              <TextInput
                style={styles.input}
                placeholder="lb"
                keyboardType="numeric"
                value={formData.assets}
                onChangeText={(text) => setFormData({ ...formData, assets: text })}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Pressure</Text>
              <View style={styles.bpInputs}>
                <TextInput
                  style={[styles.input, styles.bpInput]}
                  placeholder="HomeOwner"
                  keyboardType="numeric"
                  value={formData.home_owner}
                  onChangeText={(text) => setFormData({ ...formData, home_owner: text })}
                />
                <Text style={styles.bpSeparator}>/</Text>
                <TextInput
                  style={[styles.input, styles.bpInput]}
                  placeholder="Investment"
                  keyboardType="numeric"
                  value={formData.investment}
                  onChangeText={(text) => setFormData({ ...formData, investment: text })}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  bpInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bpInput: {
    flex: 1,
  },
  bpSeparator: {
    color: '#ffffff',
    fontSize: 20,
    marginHorizontal: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  genderButtonText: {
    color: '#000000',
    fontSize: 14,
  },
  genderButtonTextSelected: {
    color: '#ffffff',
  },
});
