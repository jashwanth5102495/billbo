import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Building2, User, Mail, MapPin, FileText, Globe, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../(tabs)/ThemeContext';

export default function BusinessSetupScreen() {
  const { isDarkMode } = useTheme();
  const { updateBusinessProfile, user } = useAuth();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    ownerName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    businessDescription: '',
    website: '',
    facebook: '',
    instagram: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2; // Reduced from 3 to 2 steps

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      lineHeight: 24,
    },
    progressContainer: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    progressStep: {
      flex: 1,
      height: 4,
      backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
      marginHorizontal: 2,
      borderRadius: 2,
    },
    progressStepActive: {
      backgroundColor: '#9333EA',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    requiredLabel: {
      color: '#EF4444',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
      paddingHorizontal: 16,
      minHeight: 56,
    },
    inputWrapperFocused: {
      borderColor: '#9333EA',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#111827',
      paddingVertical: 16,
      marginLeft: 12,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingBottom: 32,
      gap: 12,
    },
    button: {
      flex: 1,
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    primaryButton: {
      backgroundColor: '#9333EA',
      shadowColor: '#9333EA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    secondaryButton: {
      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
      borderWidth: 1,
      borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
    },
    buttonDisabled: {
      backgroundColor: isDarkMode ? '#374151' : '#D1D5DB',
      shadowOpacity: 0,
      elevation: 0,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginRight: 8,
    },
    secondaryButtonText: {
      color: isDarkMode ? '#D1D5DB' : '#6B7280',
    },
    helperText: {
      fontSize: 12,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginTop: 4,
      lineHeight: 16,
    },

  });

  const businessTypes = [
    'Retail Store', 'Restaurant', 'Service Provider', 'Manufacturing',
    'Technology', 'Healthcare', 'Education', 'Real Estate', 'Other'
  ];

  const validateStep1 = () => {
    return formData.businessName.trim() && formData.businessType.trim() && 
           formData.ownerName.trim() && formData.email.trim();
  };

  const validateStep2 = () => {
    return formData.address.trim() && formData.city.trim() && 
           formData.state.trim() && formData.pincode.trim() &&
           /^\d{6}$/.test(formData.pincode.trim());
  };

  const validateSubmit = () => {
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();
    
    console.log('🔍 Validation Debug:');
    console.log('  Step 1 valid:', step1Valid);
    console.log('  Step 2 valid:', step2Valid);
    console.log('  Business Name:', formData.businessName.trim());
    console.log('  Business Type:', formData.businessType.trim());
    console.log('  Owner Name:', formData.ownerName.trim());
    console.log('  Email:', formData.email.trim());
    console.log('  Address:', formData.address.trim());
    console.log('  City:', formData.city.trim());
    console.log('  State:', formData.state.trim());
    console.log('  PIN Code:', formData.pincode.trim());
    
    return step1Valid && step2Valid;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate all required fields
      if (!validateSubmit()) {
        Alert.alert('Validation Error', 'Please fill in all required fields correctly');
        setIsLoading(false);
        return;
      }
      
      // Additional validation for business type (allow any type)
      if (!formData.businessType.trim()) {
        Alert.alert('Validation Error', 'Business type is required');
        setIsLoading(false);
        return;
      }

      const profileData = {
        businessName: formData.businessName.trim(),
        businessType: formData.businessType,
        ownerName: formData.ownerName.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        gstNumber: formData.gstNumber?.trim() || undefined,
        panNumber: formData.panNumber?.trim() || undefined,
        businessDescription: formData.businessDescription?.trim() || undefined,
        website: formData.website?.trim() || undefined,
        socialMedia: {
          facebook: formData.facebook?.trim() || undefined,
          instagram: formData.instagram?.trim() || undefined,
        },
      };

      console.log('🔧 Submitting business profile:', profileData);
      console.log('🔧 Form validation passed');

      const success = await updateBusinessProfile(profileData);
      console.log('🔧 Update result:', success);
      
      if (success) {
        console.log('✅ Business profile created successfully');
        
        // Navigate directly to home screen without showing alert
        console.log('🚀 Navigating to home screen...');
        router.replace('/(tabs)');
      } else {
        console.log('❌ Failed to create profile');
        
        // Fallback: Try to save locally and continue
        try {
          console.log('🔄 Trying fallback: Saving locally...');
          // Store in AsyncStorage as fallback
          const fallbackProfile = {
            id: `profile_${Date.now()}`,
            userId: user?.id || 'fallback_user',
            ...profileData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Save to AsyncStorage directly as fallback
          await AsyncStorage.setItem('businessProfile', JSON.stringify(fallbackProfile));
          
          console.log('🚀 Navigating to home screen (fallback)...');
          router.replace('/(tabs)');
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
          Alert.alert('Error', 'Failed to create profile. Please try again.');
        }
      }
    } catch (error) {
      console.error('Business setup error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const renderStep1 = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.requiredLabel]}>
          Business Name *
        </Text>
        <View style={styles.inputWrapper}>
          <Building2 size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter your business name"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.businessName}
            onChangeText={(text) => setFormData({...formData, businessName: text})}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.requiredLabel]}>
          Business Type *
        </Text>
        <View style={styles.inputWrapper}>
          <Building2 size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter your business type (e.g., Retail Store)"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.businessType}
            onChangeText={(text) => setFormData({...formData, businessType: text})}
          />
        </View>
        <Text style={styles.helperText}>
          Examples: Retail Store, Restaurant, Service Provider, Manufacturing, Technology, Healthcare, Education, Real Estate, Other
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.requiredLabel]}>
          Owner Name *
        </Text>
        <View style={styles.inputWrapper}>
          <User size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter owner's full name"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.ownerName}
            onChangeText={(text) => setFormData({...formData, ownerName: text})}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.requiredLabel]}>
          Email Address *
        </Text>
        <View style={styles.inputWrapper}>
          <Mail size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter business email"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.requiredLabel]}>
          Business Address *
        </Text>
        <View style={styles.inputWrapper}>
          <MapPin size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter complete business address"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
            multiline
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.requiredLabel]}>
          City *
        </Text>
        <View style={styles.inputWrapper}>
          <MapPin size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.city}
            onChangeText={(text) => setFormData({...formData, city: text})}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.requiredLabel]}>
          State *
        </Text>
        <View style={styles.inputWrapper}>
          <MapPin size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter state"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.state}
            onChangeText={(text) => setFormData({...formData, state: text})}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, styles.requiredLabel]}>
          PIN Code *
        </Text>
        <View style={styles.inputWrapper}>
          <MapPin size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter PIN code"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.pincode}
            onChangeText={(text) => setFormData({...formData, pincode: text})}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          GST Number (Optional)
        </Text>
        <View style={styles.inputWrapper}>
          <FileText size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter GST number"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.gstNumber}
            onChangeText={(text) => setFormData({...formData, gstNumber: text})}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          PAN Number (Optional)
        </Text>
        <View style={styles.inputWrapper}>
          <FileText size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter PAN number"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.panNumber}
            onChangeText={(text) => setFormData({...formData, panNumber: text})}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Business Description (Optional)
        </Text>
        <View style={styles.inputWrapper}>
          <FileText size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your business"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.businessDescription}
            onChangeText={(text) => setFormData({...formData, businessDescription: text})}
            multiline
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Website (Optional)
        </Text>
        <View style={styles.inputWrapper}>
          <Globe size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter website URL"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.website}
            onChangeText={(text) => setFormData({...formData, website: text})}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Facebook Page (Optional)
        </Text>
        <View style={styles.inputWrapper}>
          <Globe size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter Facebook page URL"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.facebook}
            onChangeText={(text) => setFormData({...formData, facebook: text})}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Instagram Handle (Optional)
        </Text>
        <View style={styles.inputWrapper}>
          <Globe size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={styles.input}
            placeholder="Enter Instagram handle"
            placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
            value={formData.instagram}
            onChangeText={(text) => setFormData({...formData, instagram: text})}
            autoCapitalize="none"
          />
        </View>
      </View>
    </ScrollView>
  );



  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={isDarkMode ? '#FFFFFF' : '#111827'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {currentStep === 1 ? 'Business Information' : 'Business Address'}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            {currentStep === 1 ? 'Tell us about your business' : 'Where is your business located?'}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          {[1, 2].map((step) => (
            <View
              key={step}
              style={[
                styles.progressStep,
                step <= currentStep && styles.progressStepActive
              ]}
            />
          ))}
        </View>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}

        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleBack}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              isLoading && styles.buttonDisabled
            ]}
            onPress={currentStep === 2 ? handleSubmit : handleNext}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {currentStep === 2 ? 'Complete Setup' : 'Next'}
                </Text>
                {currentStep < 2 && <ArrowRight size={20} color="#FFFFFF" />}
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}