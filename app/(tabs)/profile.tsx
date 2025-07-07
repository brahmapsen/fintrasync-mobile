import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Portfolio data
const PORTFOLIO_1 = [
  { symbol: 'AAPL', quantity: 15, price: 195.0, sector: 'Technology' }
];

const PORTFOLIO_2 = [
  { symbol: 'AAPL', quantity: 15, price: 195.0, sector: 'Technology' },
  { symbol: 'TSLA', quantity: 8, price: 265.0, sector: 'Automotive' },
  { symbol: 'VOO', quantity: 20, price: 405.0, sector: 'Index Fund' },
  { symbol: 'MSFT', quantity: 10, price: 330.0, sector: 'Technology' },
  { symbol: 'NVDA', quantity: 5, price: 850.0, sector: 'Technology' }
];

export default function ProfileScreen() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    home_owner: '',
    risk_tolerance: '',
    investments: null as any
  });
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showViewPortfolioModal, setShowViewPortfolioModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showHomeOwnerModal, setShowHomeOwnerModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);

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
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile data:', err);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  const selectPortfolio = async (portfolioNumber: number) => {
    const selectedPortfolio = portfolioNumber === 1 ? PORTFOLIO_1 : PORTFOLIO_2;
    const updatedFormData = { ...formData, investments: selectedPortfolio };
    setFormData(updatedFormData);
    
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify(updatedFormData));
      await AsyncStorage.setItem('portfolioData', JSON.stringify(selectedPortfolio));
    } catch (err) {
      console.error('Error saving portfolio data:', err);
    }
    
    setShowPortfolioModal(false);
    Alert.alert('Success', `Portfolio ${portfolioNumber} loaded successfully!`);
  };

  const renderPortfolioSummary = () => {
    if (!formData.investments) return null;
    
    const totalValue = formData.investments.reduce((sum: number, stock: any) => 
      sum + (stock.quantity * stock.price), 0
    );
    
    return (
      <View style={styles.portfolioSummary}>
        <Text style={styles.portfolioTitle}>Current Portfolio</Text>
        <Text style={styles.portfolioValue}>Total Value: ${totalValue.toLocaleString()}</Text>
        <Text style={styles.portfolioStocks}>{formData.investments.length} stocks</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Age and Gender Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.inputShort}
                placeholder="Age"
                keyboardType="numeric"
                maxLength={3}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
              />
            </View>

            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={styles.dropdownText}>
                  {formData.gender || 'Select Gender'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Home Owner and Risk Tolerance Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>Home Owner</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowHomeOwnerModal(true)}
              >
                <Text style={styles.dropdownText}>
                  {formData.home_owner || 'Select'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>Risk Tolerance</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowRiskModal(true)}
              >
                <Text style={styles.dropdownText}>
                  {formData.risk_tolerance || 'Select'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Investments Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Investments (Stocks)</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => setShowPortfolioModal(true)}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="#ffffff" />
                <Text style={styles.uploadButtonText}>Upload Portfolio</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => setShowViewPortfolioModal(true)}
                disabled={!formData.investments}
              >
                <Ionicons name="eye-outline" size={20} color="#ffffff" />
                <Text style={styles.viewButtonText}>View Portfolio</Text>
              </TouchableOpacity>
            </View>
            {renderPortfolioSummary()}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Portfolio Selection Modal */}
      <Modal
        visible={showPortfolioModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPortfolioModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Portfolio</Text>
            
            <TouchableOpacity
              style={styles.portfolioOption}
              onPress={() => selectPortfolio(1)}
            >
              <Text style={styles.portfolioOptionTitle}>Portfolio 1</Text>
              <Text style={styles.portfolioOptionDesc}>1 stock - AAPL</Text>
              <Text style={styles.portfolioOptionValue}>Value: $2,925</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.portfolioOption}
              onPress={() => selectPortfolio(2)}
            >
              <Text style={styles.portfolioOptionTitle}>Portfolio 2</Text>
              <Text style={styles.portfolioOptionDesc}>5 stocks - Diversified</Text>
              <Text style={styles.portfolioOptionValue}>Value: $25,295</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPortfolioModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            
            {['Male', 'Female'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={styles.optionButton}
                onPress={() => {
                  setFormData({ ...formData, gender });
                  setShowGenderModal(false);
                }}
              >
                <Text style={styles.optionButtonText}>{gender}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Home Owner Selection Modal */}
      <Modal
        visible={showHomeOwnerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHomeOwnerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Home Owner</Text>
            
            {['Yes', 'No'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => {
                  setFormData({ ...formData, home_owner: option });
                  setShowHomeOwnerModal(false);
                }}
              >
                <Text style={styles.optionButtonText}>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowHomeOwnerModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Risk Tolerance Selection Modal */}
      <Modal
        visible={showRiskModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRiskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Risk Tolerance</Text>
            
            {['Aggressive', 'Moderate', 'Low'].map((risk) => (
              <TouchableOpacity
                key={risk}
                style={styles.optionButton}
                onPress={() => {
                  setFormData({ ...formData, risk_tolerance: risk });
                  setShowRiskModal(false);
                }}
              >
                <Text style={styles.optionButtonText}>{risk}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRiskModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View Portfolio Modal */}
      <Modal
        visible={showViewPortfolioModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowViewPortfolioModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.portfolioModalContent}>
            <Text style={styles.modalTitle}>Portfolio Details</Text>
            
            {formData.investments ? (
              <ScrollView style={styles.portfolioScrollView}>
                {formData.investments.map((stock: any, index: number) => (
                  <View key={index} style={styles.stockItem}>
                    <View style={styles.stockHeader}>
                      <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                      <Text style={styles.stockValue}>
                        ${(stock.quantity * stock.price).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.stockDetails}>
                      <Text style={styles.stockDetailText}>
                        Quantity: {stock.quantity} shares
                      </Text>
                      <Text style={styles.stockDetailText}>
                        Price: ${stock.price}
                      </Text>
                      <Text style={styles.stockDetailText}>
                        Sector: {stock.sector}
                      </Text>
                    </View>
                  </View>
                ))}
                
                <View style={styles.portfolioTotal}>
                  <Text style={styles.totalText}>
                    Total Portfolio Value: ${formData.investments.reduce((sum: number, stock: any) => 
                      sum + (stock.quantity * stock.price), 0
                    ).toLocaleString()}
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.noPortfolioText}>No portfolio data available</Text>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowViewPortfolioModal(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  form: {
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputShort: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  dropdownButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000000',
  },
  optionButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginRight: 6,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginLeft: 6,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  portfolioSummary: {
    backgroundColor: '#ffffff20',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  portfolioTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  portfolioValue: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  portfolioStocks: {
    color: '#ffffff80',
    fontSize: 14,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  portfolioOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  portfolioOptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  portfolioOptionDesc: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  portfolioOptionValue: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  portfolioModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '95%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  portfolioScrollView: {
    maxHeight: 400,
  },
  stockItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  stockDetails: {
    gap: 4,
  },
  stockDetailText: {
    fontSize: 14,
    color: '#666666',
  },
  portfolioTotal: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  noPortfolioText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 20,
  },
});
