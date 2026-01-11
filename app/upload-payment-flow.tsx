import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Video, Upload, CheckCircle, Play } from 'lucide-react-native';
import { useTheme } from './(tabs)/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

export default function UploadPaymentFlowScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  
  const totalPrice = parseFloat(params.totalPrice as string) || 0;
  const reputation = parseInt(params.reputation as string) || 40;
  const days = parseInt(params.days as string) || 1;
  const duration = parseInt(params.duration as string) || 5;
  const selectedPackages = params.selectedPackages ? JSON.parse(params.selectedPackages as string) : [];
  const billboardName = params.billboardName as string || 'Billboard';
  
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const handleProceedToPayment = () => {
    if (!videoUri) {
      Alert.alert('Video Required', 'Please upload a video advertisement to proceed.');
      return;
    }

    setLoading(true);
    
    // Construct cart items for Razorpay checkout
    // Calculate per-item price based on consumed time logic (same as calculate-price screen)
    // Formula: Cost = (SlotPrice / SlotDuration) * Consumed Time * Days
    
    const SLOT_DURATION_SECONDS = 21600; // 6 hours * 60 * 60
    const dailyConsumedSeconds = duration * reputation;

    const cartItems = selectedPackages.map((pkg: any) => {
      const costPerSecond = (pkg.price || 0) / SLOT_DURATION_SECONDS;
      const itemPrice = costPerSecond * dailyConsumedSeconds * days;
      
      return {
        id: pkg.id,
        name: `${billboardName} - ${pkg.name}`,
        desc: `Duration: ${days} Day(s), Reputation: ${reputation}, Time: ${pkg.time}, Length: ${duration}s`,
        price: `₹${Math.round(itemPrice).toFixed(2)}`,
        billboardId: params.billboardId,
        billboardName: billboardName,
        location: params.location || 'Unknown Location',
        date: params.date,
        time: pkg.time,
        slotTime: pkg.time,
        videoUri: videoUri, // Pass the local video URI
        reputation: reputation,
        days: days,
        duration: duration
      };
    });

    // Pass as cart param to razorpay-checkout
    router.push({
      pathname: '/razorpay-checkout',
      params: {
        cart: JSON.stringify(cartItems),
        total: totalPrice.toString()
      }
    });
    
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#111' : '#F8FAFC',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: isDarkMode ? '#111' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#222' : '#e5e7eb',
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
      backgroundColor: isDarkMode ? '#18181b' : '#fff',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
      marginBottom: 16,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#222',
    },
    totalRow: {
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#eee',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
    },
    totalValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2563eb',
    },
    uploadArea: {
      borderWidth: 2,
      borderColor: isDarkMode ? '#333' : '#e5e7eb',
      borderStyle: 'dashed',
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#111' : '#f9fafb',
      height: 200,
    },
    uploadIcon: {
      marginBottom: 16,
    },
    uploadText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#222',
      marginBottom: 8,
    },
    uploadSubtext: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
      textAlign: 'center',
    },
    videoPreview: {
      width: '100%',
      alignItems: 'center',
    },
    videoSuccess: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      padding: 12,
      borderRadius: 12,
      marginTop: 16,
    },
    payButton: {
      backgroundColor: '#2563eb',
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    payButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    disabledButton: {
      opacity: 0.6,
      backgroundColor: '#6b7280',
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={isDarkMode ? '#fff' : '#222'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload & Pay</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Billboard</Text>
            <Text style={styles.summaryValue}>{billboardName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{days} Day(s)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Video Length</Text>
            <Text style={styles.summaryValue}>{duration} Seconds</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reputation Score</Text>
            <Text style={styles.summaryValue}>{reputation}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected Slots</Text>
            <View style={{ alignItems: 'flex-end' }}>
              {selectedPackages.map((p: any) => (
                <Text key={p.id} style={styles.summaryValue}>{p.name}</Text>
              ))}
            </View>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Video Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Advertisement</Text>
          <TouchableOpacity style={styles.uploadArea} onPress={pickVideo}>
            {videoUri ? (
              <View style={styles.videoPreview}>
                <CheckCircle size={48} color="#10b981" style={{ marginBottom: 16 }} />
                <Text style={styles.uploadText}>Video Selected</Text>
                <Text style={styles.uploadSubtext} numberOfLines={1}>
                  {videoUri.split('/').pop()}
                </Text>
                <TouchableOpacity 
                    style={{ marginTop: 16, padding: 8, backgroundColor: isDarkMode ? '#333' : '#eee', borderRadius: 8 }}
                    onPress={pickVideo}
                >
                    <Text style={{ color: isDarkMode ? '#fff' : '#222' }}>Change Video</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Upload size={48} color={isDarkMode ? '#666' : '#9ca3af'} style={styles.uploadIcon} />
                <Text style={styles.uploadText}>Tap to Upload Video</Text>
                <Text style={styles.uploadSubtext}>Supports MP4, MOV (Max 100MB)</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Pay Button */}
        <TouchableOpacity 
          style={[styles.payButton, (!videoUri || loading) && styles.disabledButton]}
          onPress={handleProceedToPayment}
          disabled={!videoUri || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay ₹{totalPrice.toFixed(2)}</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
