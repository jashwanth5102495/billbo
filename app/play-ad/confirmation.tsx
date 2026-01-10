import React, { useState } from 'react';
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
import { 
  ArrowLeft, 
  CheckCircle, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building,
  CreditCard,
  Calendar
} from 'lucide-react-native';
import { useBookings } from '../(tabs)/BookingContext';
import { VideoModerationService } from '../../services/videoModerationService';
import { useVideoStorage } from '../../hooks/useVideoStorage';

export default function ConfirmationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const { addBooking } = useBookings();
  const { updateVideoStatus } = useVideoStorage();
  const videoModerationService = new VideoModerationService();

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
    section: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionIcon: {
      marginRight: 8,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    detailLabel: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      flex: 1,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
      flex: 2,
      textAlign: 'right',
    },
    priceBreakdown: {
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#E5E7EB',
      paddingTop: 16,
      marginTop: 16,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    totalAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#10B981',
    },
    paymentButton: {
      backgroundColor: '#10B981',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    paymentButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    processingButton: {
      backgroundColor: '#6B7280',
    },
    termsText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 16,
    },
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Add booking to history
        addBooking({
          type: 'ad',
          title: `${params.businessName} - ${params.packageName}`,
          location: params.locationName as string,
          dateRange: `${new Date().toLocaleDateString()} - ${params.packageDuration}`,
          amount: `₹${parseInt(params.price as string) + Math.round(parseInt(params.price as string) * 0.18)}`,
          status: 'Completed',
          color: '#10B981',
          businessName: params.businessName as string,
          contactPerson: params.contactPerson as string,
          phoneNumber: params.phoneNumber as string,
          email: params.email as string,
          slotTime: params.packageTime as string,
        });
        
        // Start AI moderation after successful payment
        if (params.videoUri) {
          Alert.alert(
            'Payment Successful!',
            'Your payment has been processed. Now analyzing your advertisement content...',
            [{ text: 'OK' }]
          );
          
          const moderationResult = await videoModerationService.moderateVideoSimple(params.videoUri as string);
          
          // Update video status based on moderation result
          await updateVideoStatus(params.videoUri as string, moderationResult.approved ? 'approved' : 'rejected');
          
          setIsProcessing(false);
          
          if (moderationResult.approved) {
            Alert.alert(
              'Advertisement Approved!',
              'Your advertisement has been approved and your booking is confirmed. You will receive a confirmation email shortly.',
              [
                {
                  text: 'OK',
                  onPress: () => router.push('/(tabs)/')
                }
              ]
            );
          } else {
            Alert.alert(
              'Advertisement Rejected',
              `Your advertisement was rejected due to: ${moderationResult.reason}. Please upload a new advertisement that complies with our guidelines.`,
              [
                {
                  text: 'Upload New Ad',
                  onPress: () => router.push('/play-ad/')
                },
                {
                  text: 'Go to Home',
                  onPress: () => router.push('/(tabs)/')
                }
              ]
            );
          }
        } else {
          setIsProcessing(false);
          Alert.alert(
            'Booking Confirmed!',
            'Your billboard booking has been confirmed. You will receive a confirmation email shortly.',
            [
              {
                text: 'OK',
                onPress: () => router.push('/(tabs)/')
              }
            ]
          );
        }
      } catch (error) {
        setIsProcessing(false);
        Alert.alert(
          'Error',
          'There was an error processing your request. Please try again.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/(tabs)/')
            }
          ]
        );
      }
    }, 2000);
  };

  const basePrice = parseInt(params.price as string);
  const gst = Math.round(basePrice * 0.18);
  const total = basePrice + gst;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.replace('/play-ad/business-details')}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Booking Details */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Calendar size={20} color={isDark ? '#FFFFFF' : '#111827'} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Booking Details</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{params.locationName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Package:</Text>
            <Text style={styles.detailValue}>{params.packageName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time Slot:</Text>
            <Text style={styles.detailValue}>{params.packageTime}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{params.packageDuration}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Building size={20} color={isDark ? '#FFFFFF' : '#111827'} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Business Information</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Business Name:</Text>
            <Text style={styles.detailValue}>{params.businessName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact Person:</Text>
            <Text style={styles.detailValue}>{params.contactPerson}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{params.phoneNumber}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{params.email}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>
              {params.address}, {params.city}, {params.state} - {params.pincode}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <CreditCard size={20} color={isDark ? '#FFFFFF' : '#111827'} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Payment Summary</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Base Price:</Text>
            <Text style={styles.detailValue}>₹{basePrice}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>GST (18%):</Text>
            <Text style={styles.detailValue}>₹{gst}</Text>
          </View>
          
          <View style={styles.priceBreakdown}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>₹{total}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.termsText}>
          By proceeding with the payment, you agree to our Terms of Service and Privacy Policy. 
          Your booking will be confirmed once the payment is processed successfully.
        </Text>

        <TouchableOpacity
          style={[styles.paymentButton, isProcessing && styles.processingButton]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.paymentButtonText}>Processing Payment...</Text>
          ) : (
            <>
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.paymentButtonText}>Pay ₹{total} & Confirm Booking</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}