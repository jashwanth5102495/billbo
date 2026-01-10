import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, Video, MapPin, Clock, Settings, Users, Share2 } from 'lucide-react-native';

export default function PublicWishesConfirmationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();

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
    successSection: {
      backgroundColor: '#10B981',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      alignItems: 'center',
    },
    successIcon: {
      marginBottom: 16,
    },
    successTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
      textAlign: 'center',
    },
    successSubtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      textAlign: 'center',
      opacity: 0.9,
    },
    detailsCard: {
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
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    detailIcon: {
      marginRight: 12,
    },
    detailText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      flex: 1,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#E5E7EB',
    },
    priceLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    priceValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#E74C3C',
    },
    instructionsCard: {
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
    instructionStep: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    stepNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#E74C3C',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    stepNumberText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    stepText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      flex: 1,
      lineHeight: 20,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    shareButton: {
      flex: 1,
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    shareButtonText: {
      color: isDark ? '#FFFFFF' : '#111827',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    homeButton: {
      flex: 1,
      backgroundColor: '#E74C3C',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    homeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleGoHome = () => {
    router.push('/(tabs)/');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share interactive billboard setup');
  };

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
        <Text style={styles.headerTitle}>Setup Complete</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successSection}>
          <CheckCircle size={64} color="#FFFFFF" style={styles.successIcon} />
          <Text style={styles.successTitle}>Interactive Billboard Setup Complete!</Text>
          <Text style={styles.successSubtitle}>
            Your public video wishes billboard is now ready for community interaction
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.cardTitle}>
            <Video size={20} color="#E74C3C" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Billboard Details</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={16} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.detailIcon} />
            <Text style={styles.detailText}>Location:</Text>
            <Text style={styles.detailValue}>{params.locationName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Settings size={16} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.detailIcon} />
            <Text style={styles.detailText}>Package:</Text>
            <Text style={styles.detailValue}>{params.packageName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Clock size={16} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.detailIcon} />
            <Text style={styles.detailText}>Recording Duration:</Text>
            <Text style={styles.detailValue}>{params.recordingDuration} seconds max</Text>
          </View>

          <View style={styles.detailRow}>
            <Users size={16} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.detailIcon} />
            <Text style={styles.detailText}>Moderation:</Text>
            <Text style={styles.detailValue}>{params.moderationLevel}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Setup Cost</Text>
            <Text style={styles.priceValue}>₹{params.price}</Text>
          </View>
        </View>

        <View style={styles.instructionsCard}>
          <View style={styles.cardTitle}>
            <Settings size={20} color="#E74C3C" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>What Happens Next</Text>
          </View>

          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Our team will set up the interactive recording station at your chosen location within 24 hours
            </Text>
          </View>

          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              The public can start recording video messages using the touch screen interface or QR code
            </Text>
          </View>

          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              All recordings go through your selected moderation process before being displayed
            </Text>
          </View>

          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepText}>
              Approved videos will be displayed on the billboard during the active duration period
            </Text>
          </View>

          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <Text style={styles.stepText}>
              You&apos;ll receive a dashboard link to monitor recordings and manage the interactive experience
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color={isDark ? '#FFFFFF' : '#111827'} />
            <Text style={styles.shareButtonText}>Share Setup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
