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
import { ArrowLeft, Phone, User, Mail, Video, MessageCircle, Settings, Clock } from 'lucide-react-native';

interface FormData {
  phoneNumber: string;
  fullName: string;
  email: string;
  organizationName: string;
  eventDescription: string;
  moderationLevel: string;
  recordingDuration: string;
}

export default function PublicWishesDetailsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    fullName: '',
    email: '',
    organizationName: '',
    eventDescription: '',
    moderationLevel: 'moderate',
    recordingDuration: '30',
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
      color: '#E74C3C',
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
    optionContainer: {
      marginBottom: 16,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
    },
    selectedOption: {
      borderColor: '#E74C3C',
      backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2',
    },
    optionText: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
      marginLeft: 12,
      flex: 1,
    },
    optionDescription: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginLeft: 12,
      flex: 1,
    },
    continueButton: {
      backgroundColor: '#E74C3C',
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
    featureHighlight: {
      backgroundColor: '#E74C3C',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    featureText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 12,
      flex: 1,
    },
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['phoneNumber', 'fullName', 'email', 'organizationName'];
    const missing = required.filter(field => !formData[field as keyof FormData].trim());
    
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

  const handleContinue = () => {
    if (validateForm()) {
      router.push({
        pathname: '/public-wishes/confirmation' as any,
        params: {
          ...params,
          ...formData,
        }
      });
    }
  };

  const moderationOptions = [
    { value: 'strict', label: 'Strict Moderation', description: 'All recordings reviewed before display' },
    { value: 'moderate', label: 'Moderate Moderation', description: 'Basic content filtering with quick review' },
    { value: 'minimal', label: 'Minimal Moderation', description: 'Automated filtering only' },
  ];

  const durationOptions = [
    { value: '30', label: '30 seconds', description: 'Quick messages and wishes' },
    { value: '60', label: '1 minute', description: 'Standard video messages' },
    { value: '120', label: '2 minutes', description: 'Detailed messages and stories' },
  ];

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
        <Text style={styles.headerTitle}>Setup Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.featureHighlight}>
          <Video size={20} color="#FFFFFF" />
          <Text style={styles.featureText}>
            Interactive billboard setup for public video recording and display
          </Text>
        </View>

        <View style={styles.bookingSummary}>
          <View style={styles.summaryTitle}>
            <Video size={16} color="#E74C3C" style={{ marginRight: 8 }} />
            <Text style={styles.summaryTitle}>Interactive Billboard Summary</Text>
          </View>
          <Text style={styles.summaryText}>Location: {params.locationName}</Text>
          <Text style={styles.summaryText}>Package: {params.packageName}</Text>
          <Text style={styles.summaryText}>Recording: {params.packageTime}</Text>
          <Text style={styles.summaryText}>Active Duration: {params.packageDuration}</Text>
          <Text style={styles.priceText}>Total Setup Cost: ₹{params.price}</Text>
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

        <Text style={styles.sectionTitle}>Event Setup</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Organization/Event Name *</Text>
          <View style={styles.inputWrapper}>
            <Settings size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter organization or event name"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={formData.organizationName}
              onChangeText={(text) => updateFormData('organizationName', text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Event Description (Optional)</Text>
          <View style={styles.inputWrapper}>
            <MessageCircle size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe the event or purpose for public video wishes..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={formData.eventDescription}
              onChangeText={(text) => updateFormData('eventDescription', text)}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recording Settings</Text>

        <View style={styles.optionContainer}>
          <Text style={styles.inputLabel}>Maximum Recording Duration</Text>
          {durationOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionRow,
                formData.recordingDuration === option.value && styles.selectedOption
              ]}
              onPress={() => updateFormData('recordingDuration', option.value)}
            >
              <Clock size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.optionText}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.inputLabel}>Content Moderation Level</Text>
          {moderationOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionRow,
                formData.moderationLevel === option.value && styles.selectedOption
              ]}
              onPress={() => updateFormData('moderationLevel', option.value)}
            >
              <Settings size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.optionText}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Setup Interactive Billboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}