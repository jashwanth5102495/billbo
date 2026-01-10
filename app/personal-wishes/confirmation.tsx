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
  Heart,
  CreditCard,
  Calendar
} from 'lucide-react-native';
import { useBookings } from '../(tabs)/BookingContext';
import { useVideoModeration } from '../../hooks/useVideoModeration';
import { VideoModerationModal } from '../../components/VideoModerationModal';
import { videoStorageService } from '../../services/videoStorageService';

export default function PersonalWishesConfirmationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  const { addBooking } = useBookings();
  const { analyzeVideo, ...moderationState } = useVideoModeration();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);

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
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 12,
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
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#111827',
      flex: 1,
      textAlign: 'right',
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#E5E7EB',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderTopWidth: 2,
      borderTopColor: isDark ? '#374151' : '#E5E7EB',
      marginTop: 8,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#10B981',
    },
    termsText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 16,
    },
    paymentButton: {
      backgroundColor: '#10B981',
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    processingButton: {
      backgroundColor: '#6B7280',
    },
    paymentButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      setIsProcessing(false);
      
      // Payment successful - now start AI moderation
      setShowModerationModal(true);
      
      try {
        const bookingDetails = {
          id: params.bookingId as string,
          locationName: params.locationName,
          packageName: params.packageName,
          packageTime: params.packageTime,
          packageDuration: params.packageDuration,
          price: params.price,
        };

        // Analyze the stored video after payment
        const result = await analyzeVideo(
          params.storedVideoPath as string,
          {
            recipientName: params.recipientName,
            phoneNumber: params.phoneNumber,
            email: params.email,
            message: params.message,
          },
          bookingDetails
        );

        // Update video status based on moderation result
        const videoMetadata = await videoStorageService.getVideoByBooking(bookingDetails.id);
        if (videoMetadata) {
          await videoStorageService.updateVideoStatus(
            videoMetadata.id,
            result.status === 'approved' ? 'approved' : 'rejected',
            result.analysisResult
          );
        }

        setTimeout(() => {
          setShowModerationModal(false);
          
          if (result.status === 'approved') {
            // Add booking to history only if approved
            addBooking({
              type: 'wish',
              title: `Personal Wish for ${params.recipientName}`,
              location: params.locationName as string,
              dateRange: `${new Date().toLocaleDateString()} - ${params.packageDuration}`,
              amount: `₹${parseInt(params.price as string) + Math.round(parseInt(params.price as string) * 0.18)}`,
              status: 'Approved & Scheduled',
              color: '#10B981',
              recipientName: params.recipientName as string,
              phoneNumber: params.phoneNumber as string,
              email: params.email as string,
              slotTime: params.packageTime as string,
            });
            
            Alert.alert(
              'Content Approved! 🎉',
              'Your personal wish video has been approved and will be displayed on the billboard. You will receive a confirmation email shortly.',
              [
                {
                  text: 'OK',
                  onPress: () => router.push('/(tabs)/')
                }
              ]
            );
          } else {
            // Content rejected - show rejection message
            Alert.alert(
              'Content Rejected',
              `Your video was rejected: ${result.message}\n\nYour payment will be refunded within 3-5 business days. Please upload a new video that complies with our content guidelines.`,
              [
                {
                  text: 'Upload New Video',
                  onPress: () => router.back()
                },
                {
                  text: 'Go Home',
                  onPress: () => router.push('/(tabs)/')
                }
              ]
            );
          }
        }, 2000);
        
      } catch (error) {
        console.error('AI moderation failed:', error);
        setShowModerationModal(false);
        Alert.alert(
          'Processing Error',
          'There was an error processing your video. Your payment will be refunded. Please try again later.',
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
          onPress={() => router.back()}
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
        </View>

        {/* Personal Details */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Heart size={20} color={isDark ? '#FFFFFF' : '#111827'} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Personal Wish Details</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Recipient:</Text>
            <Text style={styles.detailValue}>{params.recipientName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Your Phone:</Text>
            <Text style={styles.detailValue}>{params.phoneNumber}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{params.email}</Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <CreditCard size={20} color={isDark ? '#FFFFFF' : '#111827'} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Payment Summary</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.detailLabel}>Package Price:</Text>
            <Text style={styles.detailValue}>₹{basePrice}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.detailLabel}>GST (18%):</Text>
            <Text style={styles.detailValue}>₹{gst}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>₹{total}</Text>
          </View>
        </View>

        <Text style={styles.termsText}>
          By proceeding with the payment, you agree to our Terms of Service and Privacy Policy. 
          Your video will be reviewed by our AI system after payment completion for content compliance.
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

      <VideoModerationModal
        visible={showModerationModal}
        moderationState={moderationState}
        onClose={() => setShowModerationModal(false)}
      />
    </SafeAreaView>
  );
}