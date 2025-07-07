import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      {/* Map Section (placeholder image for now) */}
      <View style={styles.mapContainer}>
        {/* You can replace this with a real map later */}
        <Image
          source={require('../../assets/images/fintrasync.png')}
          style={styles.mapImage}
          resizeMode="cover"
        />
        {/* Clinic markers (absolute positioned) */}
        <View style={[styles.marker, { top: 40, left: 60 }]}><Ionicons name="add" size={24} color="#fff" /></View>
        <View style={[styles.marker, { top: 80, left: 120 }]}><Ionicons name="add" size={24} color="#fff" /></View>
        <View style={[styles.marker, { top: 120, left: 40 }]}><Ionicons name="add" size={24} color="#fff" /></View>
      </View>

      {/* Clinic Info Card */}
      <View style={styles.card}>
        <Text style={styles.clinicName}>Assets</Text>
        <Text style={styles.distance}>Stocks</Text>
        <Text style={styles.openStatus}><Text style={{ color: '#4CAF50' }}>●</Text> Home Ownership</Text>
        <TouchableOpacity style={styles.directionsButton}>
          <Text style={styles.directionsButtonText}>Get recommendation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 16,
  },
  mapContainer: {
    width: '90%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  marker: {
    position: 'absolute',
    backgroundColor: '#1565C0',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  distance: {
    color: '#1565C0',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  openStatus: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    color: '#222',
    marginBottom: 2,
  },
  hours: {
    color: '#666',
    marginBottom: 12,
  },
  directionsButton: {
    backgroundColor: '#1565C0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 8,
  },
  directionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
