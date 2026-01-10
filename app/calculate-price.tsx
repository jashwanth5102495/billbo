import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Slider } from '@miblanchard/react-native-slider';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useTheme } from './(tabs)/ThemeContext';

export default function CalculatePriceScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  
  // Parse params
  const basePrice = parseFloat(params.basePrice as string) || 0;
  const billboardName = params.billboardName as string || 'Billboard';
  const selectedPackages = params.selectedPackages ? JSON.parse(params.selectedPackages as string) : [];
  const selectedSlots = selectedPackages.map((p: any) => p.name);
  
  // State for sliders
  const [reputation, setReputation] = useState(40);
  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Constants
  const MIN_REPUTATION = 40;
  const MAX_REPUTATION = 400; // Example max needed
  const REPUTATION_STEP = 40;
  
  const MIN_DAYS = 1;
  const MAX_DAYS = 30; // Example max needed

  useEffect(() => {
    calculateTotal();
  }, [reputation, days]);

  const calculateTotal = () => {
    // Formula: Base Price * Days * (Reputation / BaseReputationUnit)
    // Assuming Base Price provided is for 1 day and 40 repetitions
    const reputationFactor = reputation / MIN_REPUTATION;
    const total = basePrice * days * reputationFactor;
    setTotalPrice(total);
  };

  const handleReputationChange = (value: number) => {
    // Snap to nearest step of 40
    const steps = Math.round(value / REPUTATION_STEP);
    const snappedValue = steps * REPUTATION_STEP;
    // Ensure within bounds
    const finalValue = Math.max(MIN_REPUTATION, Math.min(MAX_REPUTATION, snappedValue));
    setReputation(finalValue);
  };

  const handleBook = () => {
    router.push({
      pathname: '/upload-payment-flow',
      params: {
        totalPrice: totalPrice.toString(),
        basePrice: basePrice.toString(),
        reputation: reputation.toString(),
        days: days.toString(),
        selectedPackages: JSON.stringify(selectedPackages),
        billboardId: params.billboardId,
        billboardName: billboardName,
        date: params.date
      }
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#111' : '#F8FAFC',
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
      backgroundColor: isDarkMode ? '#333' : '#eee',
      borderRadius: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    summaryCard: {
      backgroundColor: isDarkMode ? '#18181b' : '#fff',
      padding: 20,
      borderRadius: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
      marginBottom: 4,
    },
    summarySubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
      marginBottom: 16,
    },
    slotTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#2563eb33' : '#eff6ff',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      alignSelf: 'flex-start',
      marginBottom: 8,
      marginRight: 8,
    },
    slotText: {
      color: '#2563eb',
      fontWeight: 'bold',
      fontSize: 12,
      marginLeft: 6,
    },
    sliderContainer: {
      marginBottom: 32,
    },
    sliderLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sliderLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#222',
    },
    sliderValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2563eb',
    },
    slider: {
      width: '100%',
      height: 40,
    },
    priceContainer: {
      marginTop: 'auto',
      marginBottom: 30,
      backgroundColor: isDarkMode ? '#18181b' : '#fff',
      padding: 24,
      borderRadius: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#eee',
    },
    priceLabel: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    priceValue: {
      fontSize: 42,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
      marginBottom: 24,
    },
    bookButton: {
      backgroundColor: '#2563eb',
      width: '100%',
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    bookButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (params.billboardId && params.date) {
      // If history is lost, we can reconstruct the path back to slots
      router.push({
        pathname: '/book-slot',
        params: {
          billboardId: params.billboardId,
          date: params.date
        }
      });
    } else {
      router.push('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={isDarkMode ? '#fff' : '#222'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Price Calculator</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{billboardName}</Text>
          <Text style={styles.summarySubtitle}>Base Rate: ₹{basePrice} / day (40 reps)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {selectedSlots.map((slot: string, index: number) => (
              <View key={index} style={styles.slotTag}>
                <CheckCircle size={12} color="#2563eb" />
                <Text style={styles.slotText}>{slot}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reputation Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Frequency (Repetitions)</Text>
            <Text style={styles.sliderValue}>{reputation}</Text>
          </View>
          <Slider
            containerStyle={styles.slider}
            minimumValue={MIN_REPUTATION}
            maximumValue={MAX_REPUTATION}
            step={REPUTATION_STEP}
            value={reputation}
            onValueChange={(value) => handleReputationChange(Array.isArray(value) ? value[0] : value)}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor={isDarkMode ? '#333' : '#ddd'}
            thumbTintColor="#2563eb"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ color: isDarkMode ? '#666' : '#999', fontSize: 12 }}>Min: {MIN_REPUTATION}</Text>
            <Text style={{ color: isDarkMode ? '#666' : '#999', fontSize: 12 }}>Max: {MAX_REPUTATION}</Text>
          </View>
        </View>

        {/* Days Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Duration (Days)</Text>
            <Text style={styles.sliderValue}>{days} Days</Text>
          </View>
          <Slider
            containerStyle={styles.slider}
            minimumValue={MIN_DAYS}
            maximumValue={MAX_DAYS}
            step={1}
            value={days}
            onValueChange={(value) => setDays(Array.isArray(value) ? value[0] : value)}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor={isDarkMode ? '#333' : '#ddd'}
            thumbTintColor="#2563eb"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ color: isDarkMode ? '#666' : '#999', fontSize: 12 }}>1 Day</Text>
            <Text style={{ color: isDarkMode ? '#666' : '#999', fontSize: 12 }}>{MAX_DAYS} Days</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Estimated Total Price</Text>
          <Text style={styles.priceValue}>₹{totalPrice.toLocaleString()}</Text>
          
          <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookButtonText}>Proceed to Book</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
