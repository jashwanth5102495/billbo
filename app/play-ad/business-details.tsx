import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, Building2 } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { BusinessDataModal } from '../../components/BusinessDataModal';

export default function BusinessDetailsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  const { businessProfile } = useAuth();
  
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  const goToConfirmation = () => {
    if (!businessProfile) return;

    router.push({
      pathname: '/play-ad/confirmation',
      params: {
        ...params,
        businessName: businessProfile.businessName,
        ownerName: businessProfile.ownerName,
        email: businessProfile.email,
        address: businessProfile.address,
        city: businessProfile.city,
        state: businessProfile.state,
        pincode: businessProfile.pincode,
        videoUri: params.videoUri,
      }
    });
  };

  useEffect(() => {
    // Show business data modal if user doesn't have business profile
    if (!businessProfile) {
      setShowBusinessModal(true);
    }
  }, [businessProfile]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#F9FAFB',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    bookingSummary: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    summaryText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 4,
    },
    priceText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#10B981',
      marginTop: 8,
    },
    businessCard: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    businessHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    businessIcon: {
      width: 48,
      height: 48,
      backgroundColor: '#9333EA',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    businessInfo: {
      flex: 1,
    },
    businessName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    businessType: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    businessDetails: {
      marginTop: 8,
    },
    businessDetail: {
      fontSize: 14,
      color: isDark ? '#D1D5DB' : '#374151',
      marginBottom: 4,
    },
    continueButton: {
      backgroundColor: '#9333EA',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      shadowColor: '#9333EA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    setupPrompt: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    promptIcon: {
      width: 64,
      height: 64,
      backgroundColor: '#9333EA',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    promptTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      textAlign: 'center',
      marginBottom: 8,
    },
    promptText: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  const handleBusinessDataComplete = () => {
    setShowBusinessModal(false);
    goToConfirmation();
  };

  const handleContinue = () => {
    if (!businessProfile) {
      Alert.alert('Business Information Required', 'Please complete your business profile to continue.');
      setShowBusinessModal(true);
      return;
    }

    goToConfirmation();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.replace('/play-ad/booking')}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bookingSummary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.summaryText}>Location: {params.locationName}</Text>
          <Text style={styles.summaryText}>Package: {params.packageName}</Text>
          <Text style={styles.summaryText}>Time Slot: {params.packageTime}</Text>
          <Text style={styles.summaryText}>Duration: {params.packageDuration}</Text>
          <Text style={styles.priceText}>Total: ₹{params.price}</Text>
        </View>

        {businessProfile ? (
          <View style={styles.businessCard}>
            <View style={styles.businessHeader}>
              <View style={styles.businessIcon}>
                <Building2 size={24} color="#FFFFFF" />
              </View>
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{businessProfile.businessName}</Text>
                <Text style={styles.businessType}>{businessProfile.businessType}</Text>
              </View>
              <CheckCircle size={24} color="#10B981" />
            </View>
            <View style={styles.businessDetails}>
              <Text style={styles.businessDetail}>Owner: {businessProfile.ownerName}</Text>
              <Text style={styles.businessDetail}>Email: {businessProfile.email}</Text>
              <Text style={styles.businessDetail}>
                Address: {businessProfile.address}, {businessProfile.city}, {businessProfile.state} - {businessProfile.pincode}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.setupPrompt}>
            <View style={styles.promptIcon}>
              <Building2 size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.promptTitle}>Business Information Required</Text>
            <Text style={styles.promptText}>
              Please provide your business details to complete your first order
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </ScrollView>

      <BusinessDataModal
        visible={showBusinessModal}
        onClose={() => setShowBusinessModal(false)}
        onComplete={handleBusinessDataComplete}
      />
    </SafeAreaView>
  );
}
