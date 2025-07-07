import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const [portfolioData, setPortfolioData] = useState(null as any);
  const [analysisData, setAnalysisData] = useState({
    forecast: null as string | null,
    advice: null as string | null,
    completeAnalysis: null as string | null,
    scenarioAnalysis: null as string | null
  });
  const [loading, setLoading] = useState({
    forecast: false,
    advice: false,
    completeAnalysis: false,
    scenarioAnalysis: false
  });
  const [refreshMode, setRefreshMode] = useState(false);

  useEffect(() => {
    loadPortfolioData();
    loadStoredAnalysis();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const profileData = await AsyncStorage.getItem('profileData');
      if (profileData) {
        const parsed = JSON.parse(profileData);
        setPortfolioData(parsed.investments);
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    }
  };

  const loadStoredAnalysis = async () => {
    try {
      let forecast = await AsyncStorage.getItem('analysis_forecast');
      // If forecast looks like a JSON string, parse it
      if (forecast && (forecast.startsWith('"') || forecast.startsWith('{'))) {
        try {
          forecast = JSON.parse(forecast);
        } catch (e) {
          // If parsing fails, keep as is
        }
      }
      const advice = await AsyncStorage.getItem('analysis_advice');
      const completeAnalysis = await AsyncStorage.getItem('analysis_completeAnalysis');
      const scenarioAnalysis = await AsyncStorage.getItem('analysis_scenarioAnalysis');

      setAnalysisData({
        forecast,
        advice,
        completeAnalysis,
        scenarioAnalysis
      });
    } catch (error) {
      console.error('Error loading stored analysis:', error);
    }
  };

  const cleanContent = (content: string | null | undefined): string => {
    if (!content || typeof content !== 'string') return '';
    
    // Remove control characters, escape sequences, and clean up formatting
    let cleaned = content
      .replace(/\\n/g, '\n')           // Convert \n to actual newlines
      .replace(/\\t/g, '  ')           // Convert \t to spaces
      .replace(/\\"/g, '"')            // Convert \" to "
      .replace(/^\{|\}$/g, '')         // Remove leading { and trailing }
      .replace(/^"|"$/g, '')           // Remove leading and trailing quotes
      .replace(/\\\\/g, '\\')          // Convert \\ to \
      .trim();                         // Remove leading/trailing whitespace
    
    // Remove "Let me know if you..." and everything after it
    const letMeKnowIndex = cleaned.search(/Let me know if you\s/i);
    if (letMeKnowIndex !== -1) {
      cleaned = cleaned.substring(0, letMeKnowIndex).trim();
    }
    
    // Remove everything before "**PORTFOLIO ANALYSIS**" for forecast content
    const portfolioAnalysisIndex = cleaned.search(/\*\*PORTFOLIO ANALYSIS\*\*/i);
    if (portfolioAnalysisIndex !== -1) {
      cleaned = cleaned.substring(portfolioAnalysisIndex).trim();
    }
    
    // Remove JSON metadata and technical fields
    cleaned = cleaned
      .replace(/,"success":\s*true/gi, '')           // Remove success indicators
      .replace(/,"success":\s*false/gi, '')          // Remove failure indicators
      .replace(/,"status":\s*"[^"]*"/gi, '')         // Remove status fields
      .replace(/,"code":\s*\d+/gi, '')               // Remove status codes
      .replace(/,"timestamp":\s*"[^"]*"/gi, '')      // Remove timestamps
      .replace(/,"id":\s*"[^"]*"/gi, '')             // Remove IDs
      .replace(/,"requestId":\s*"[^"]*"/gi, '')      // Remove request IDs
      .replace(/,"version":\s*"[^"]*"/gi, '')        // Remove version info
      .replace(/,"metadata":\s*\{[^}]*\}/gi, '')     // Remove metadata objects
      .replace(/^,+|,+$/g, '')                       // Remove leading/trailing commas
      .replace(/,\s*,/g, ',')                        // Remove double commas
      .trim();
    
    return cleaned;
  };

  const generateDummyMarketData = (portfolioData: any[]) => {
    const marketData: { [key: string]: any } = {};
    
    portfolioData.forEach(stock => {
      marketData[stock.symbol] = {
        price: Math.round((Math.random() * 400 + 100) * 100) / 100, // Random price between 100-500
        trend_7d: ['up', 'down', 'flat'][Math.floor(Math.random() * 3)],
        trend_90d: ['up', 'down', 'volatile'][Math.floor(Math.random() * 3)]
      };
    });
    
    return marketData;
  };

  const makeApiCall = async (endpoint: string, analysisType: string) => {
    // console.log('makeApiCall called with:', { endpoint, analysisType });
    if (!portfolioData) {
      // console.log('Early return: portfolioData is null');
      Alert.alert('Error', 'Please upload a portfolio in the Profile tab first');
      return;
    }

    // Check if we already have data and refresh is not enabled
    if (analysisData[analysisType as keyof typeof analysisData] && !refreshMode) {
      // console.log('Early return: data already exists and refreshMode is not enabled');
      return; // Data already exists, no need to fetch again
    }

    setLoading(prev => ({ ...prev, [analysisType]: true }));

    try {
      let requestBody: any = {};

      // For forecast endpoint, include market data
      const marketData = generateDummyMarketData(portfolioData);
      if (endpoint === 'generate-forecast') {
        requestBody = {
          portfolio: portfolioData,
          market_data: marketData
        };
        // console.log('Forecast requestBody:', requestBody);
      } else if (endpoint === 'generate-advice') {
        // For advice endpoint, we need the forecast data
        let forecastDataRaw = analysisData.forecast;
        if (!forecastDataRaw) {
          // console.log('Early return: forecastDataRaw is null');
          Alert.alert('Error', 'Please generate a forecast first before requesting advice');
          return;
        }
        requestBody = {
          forecast: forecastDataRaw, // send as-is
          portfolio: portfolioData
        };
        // console.log('Advice requestBody:', requestBody);
      } else {
        // For other endpoints (complete-analysis, scenario-analysis)
        requestBody = {
          portfolio: portfolioData,
          market_data: marketData
        };
        // console.log('Other endpoint requestBody:', requestBody);
      }

      console.log('About to fetch:', `https://fintra-i4e0.onrender.com/${endpoint}`);
      const response = await fetch(`https://fintra-i4e0.onrender.com/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      // console.log('Fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (analysisType === 'forecast') {
        const data = await response.json();
        // console.log('Fetch response data (forecast):', data);
        setAnalysisData(prev => ({ ...prev, forecast: data.forecast }));
        await AsyncStorage.setItem('analysis_forecast', data.forecast);
      } else {
        const data = await response.text();
        // console.log('Fetch response data:', data);
        setAnalysisData(prev => ({ ...prev, [analysisType]: data }));
        await AsyncStorage.setItem(`analysis_${analysisType}`, data);
      }

    } catch (error) {
      console.error('API call failed:', error);
      Alert.alert('Error', 'Failed to fetch analysis. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [analysisType]: false }));
    }
  };

  const renderAnalysisContent = (analysisType: string, title: string) => {
    const content = analysisData[analysisType as keyof typeof analysisData];
    const cleanedContent = cleanContent(content);
    
    return (
      <View style={styles.analysisContentSection}>
        <Text style={styles.analysisContentTitle}>{title}</Text>
        <ScrollView style={styles.analysisContentScrollView} nestedScrollEnabled={true}>
          <Text style={styles.analysisContentText}>
            {cleanedContent || 'No content available. Click the button above to generate analysis.'}
          </Text>
        </ScrollView>
      </View>
    );
  };

  const renderPortfolioOverview = () => {
    if (!portfolioData) {
      return (
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Profile Overview</Text>
          <Text style={styles.noPortfolioText}>No portfolio data available. Please upload a portfolio in the Profile tab first.</Text>
        </View>
      );
    }
    
    const totalValue = portfolioData.reduce((sum: number, stock: any) => 
      sum + (stock.quantity * stock.price), 0
    );
    
    return (
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Profile Overview</Text>
        <View style={styles.portfolioOverview}>
          <Text style={styles.portfolioValue}>Total Portfolio Value: ${totalValue.toLocaleString()}</Text>
          <Text style={styles.portfolioStocks}>{portfolioData.length} stocks in portfolio</Text>
          
          <View style={styles.stocksList}>
            {portfolioData.map((stock: any, index: number) => (
              <View key={index} style={styles.stockOverviewItem}>
                <Text style={styles.stockSymbolSmall}>{stock.symbol}</Text>
                <Text style={styles.stockValueSmall}>${(stock.quantity * stock.price).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Overview Section */}
        {renderPortfolioOverview()}

        {/* Analysis Buttons Section */}
        {portfolioData && (
          <View style={styles.analysisSection}>
            <Text style={styles.sectionTitle}>Portfolio Analysis</Text>
            
            {/* Refresh Checkbox */}
            <View style={styles.refreshContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setRefreshMode(!refreshMode)}
              >
                {refreshMode && <Ionicons name="checkmark" size={16} color="#4CAF50" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Refresh data on next request</Text>
            </View>

            {/* Forecast Button and Content */}
            <TouchableOpacity
              style={[styles.analysisButton, loading.forecast && styles.buttonLoading]}
              onPress={() => makeApiCall('generate-forecast', 'forecast')}
              disabled={loading.forecast}
            >
              {loading.forecast ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="trending-up" size={20} color="#ffffff" />
              )}
              <Text style={styles.analysisButtonText}>Forecast</Text>
            </TouchableOpacity>
            {renderAnalysisContent('forecast', 'Forecast Analysis')}

            {/* Advice Button and Content */}
            <TouchableOpacity
              style={[styles.analysisButton, loading.advice && styles.buttonLoading]}
              onPress={() => makeApiCall('generate-advice', 'advice')}
              disabled={loading.advice}
            >
              {loading.advice ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="bulb" size={20} color="#ffffff" />
              )}
              <Text style={styles.analysisButtonText}>Advice</Text>
            </TouchableOpacity>
            {renderAnalysisContent('advice', 'Investment Advice')}

            {/* Complete Analysis Button and Content */}
            <TouchableOpacity
              style={[styles.analysisButton, loading.completeAnalysis && styles.buttonLoading]}
              onPress={() => makeApiCall('complete-analysis', 'completeAnalysis')}
              disabled={loading.completeAnalysis}
            >
              {loading.completeAnalysis ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="analytics" size={20} color="#ffffff" />
              )}
              <Text style={styles.analysisButtonText}>Complete Analysis</Text>
            </TouchableOpacity>
            {renderAnalysisContent('completeAnalysis', 'Complete Portfolio Analysis')}

            {/* Scenario Analysis Button and Content */}
            <TouchableOpacity
              style={[styles.analysisButton, loading.scenarioAnalysis && styles.buttonLoading]}
              onPress={() => makeApiCall('scenario-analysis', 'scenarioAnalysis')}
              disabled={loading.scenarioAnalysis}
            >
              {loading.scenarioAnalysis ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="git-branch" size={20} color="#ffffff" />
              )}
              <Text style={styles.analysisButtonText}>Scenario Analysis</Text>
            </TouchableOpacity>
            {renderAnalysisContent('scenarioAnalysis', 'Scenario Analysis')}
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
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  overviewSection: {
    backgroundColor: '#ffffff10',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  portfolioOverview: {
    backgroundColor: '#ffffff20',
    borderRadius: 8,
    padding: 12,
  },
  portfolioValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  portfolioStocks: {
    fontSize: 14,
    color: '#ffffff80',
    marginBottom: 12,
  },
  stocksList: {
    marginTop: 8,
  },
  stockOverviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  stockSymbolSmall: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  stockValueSmall: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  noPortfolioText: {
    fontSize: 16,
    color: '#ffffff80',
    textAlign: 'center',
    marginVertical: 20,
  },
  analysisSection: {
    backgroundColor: '#ffffff10',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  refreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
  analysisButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  analysisButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  analysisContentSection: {
    backgroundColor: '#ffffff20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  analysisContentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  analysisContentScrollView: {
    maxHeight: 200,
    backgroundColor: '#ffffff10',
    borderRadius: 6,
    padding: 12,
  },
  analysisContentText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
});
