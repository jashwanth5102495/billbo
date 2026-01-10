import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone, User, Mail, Heart, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../(tabs)/ThemeContext';
import { useVideoModeration } from '../../hooks/useVideoModeration';
import { VideoModerationModal } from '../../components/VideoModerationModal';
import { videoStorageService } from '../../services/videoStorageService';

export default function PersonalDetailsScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const { analyzeVideo, resetState, ...moderationState } = useVideoModeration();
  const [showModerationModal, setShowModerationModal] = useState(false);
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    fullName: '',
    email: '',
    recipientName: '',
    personalMessage: '',
    occasion: params.category || 'Personal Wish',
  });

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
      flexDirection: 'row',
      alignItems: 'center',
    },
    summaryText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 4,
    },
    priceText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FF6B6B',
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
    },
    inputIcon: {
      marginRight: 12,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    continueButton: {
      backgroundColor: '#FF6B6B',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    requiredText: {
      fontSize: 12,
      color: '#EF4444',
      marginTop: 4,
    },
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['phoneNumber', 'fullName', 'email', 'recipientName'];
    const missing = required.filter(field => !formData[field].trim());
    
    if (missing.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return false;
    }

    // Validate email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (validateForm()) {
      // Store video temporarily and proceed to payment
      try {
        const bookingDetails = {
          id: Date.now().toString(),
          locationName: params.locationName,
          packageName: params.packageName,
          packageTime: params.packageTime,
          packageDuration: params.packageDuration,
          price: params.price,
        };

        // Store video in local folder for later processing
        console.log('📁 Storing video locally...');
        const storageResult = await videoStorageService.storeVideo(
          params.mediaUri as string,
          formData.phoneNumber, // Using phone as user ID
          bookingDetails.id,
          `${formData.recipientName}_wish_video`
        );

        if (!storageResult.success) {
          Alert.alert('Storage Error', storageResult.error || 'Failed to store video');
          return;
        }

        console.log('✅ Video stored at:', storageResult.localPath);

        // Proceed directly to confirmation/payment screen
        router.push({
          pathname: '/personal-wishes/confirmation' as any,
          params: {
            ...params,
            ...formData,
            bookingId: bookingDetails.id,
            storedVideoPath: storageResult.localPath,
            videoFileName: storageResult.fileName,
          }
        });
        
      } catch (error) {
        console.error('Video storage failed:', error);
        Alert.alert('Error', 'Failed to store video. Please try again.');
      }
    }
  };

  const handleModerationClose = () => {
    setShowModerationModal(false);
    resetState();
  };

  const handleRetry = () => {
    setShowModerationModal(false);
    resetState();
    // User can upload a new video or modify current one
    Alert.alert(
      'Upload New Video',
      'Please go back and upload a different video that complies with our content guidelines.',
      [
        { text: 'Go Back', onPress: () => router.back() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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
        <Text style={styles.headerTitle}>Personal Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bookingSummary}>
          <View style={styles.summaryTitle}>
            <Heart size={16} color="#FF6B6B" style={{ marginRight: 8 }} />
            <Text style={styles.summaryTitle}>Wish Summary</Text>
          </View>
          <Text style={styles.summaryText}>Location: {params.locationName}</Text>
          <Text style={styles.summaryText}>Package: {params.packageName}</Text>
          <Text style={styles.summaryText}>Display: {params.packageTime}</Text>
          <Text style={styles.summaryText}>Duration: {params.packageDuration}</Text>
          <Text style={styles.priceText}>Total: ₹{params.price}</Text>
        </View>

        <Text style={styles.sectionTitle}>Your Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Your Phone Number *</Text>
          <View style={styles.inputWrapper}>
            <Phone size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone number"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={formData.phoneNumber}
              onChangeText={(text) => updateFormData('phoneNumber', text)}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Your Full Name *</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={formData.fullName}
              onChangeText={(text) => updateFormData('fullName', text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Your Email Address *</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email address"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Wish Details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Recipient Name *</Text>
          <View style={styles.inputWrapper}>
            <Heart size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Who is this wish for?"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={formData.recipientName}
              onChangeText={(text) => updateFormData('recipientName', text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Personal Message (Optional)</Text>
          <View style={styles.inputWrapper}>
            <MessageCircle size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Add a personal message to display with your wish..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={formData.personalMessage}
              onChangeText={(text) => updateFormData('personalMessage', text)}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </ScrollView>

      <VideoModerationModal
        visible={showModerationModal}
        moderationState={moderationState}
        onClose={handleModerationClose}
        onRetry={handleRetry}
      />
    </SafeAreaView>
  );
}