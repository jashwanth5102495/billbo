import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Building2, User, Mail, MapPin, Phone, FileText } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../app/(tabs)/ThemeContext';

interface BusinessDataModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const BusinessDataModal: React.FC<BusinessDataModalProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const { isDarkMode } = useTheme();
  const { updateBusinessProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    ownerName: '',
    email: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    businessDescription: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 20,
      width: '90%',
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#374151' : '#E5E7EB',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    closeButton: {
      padding: 8,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginBottom: 24,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    requiredLabel: {
      color: '#EF4444',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingBottom: 24,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
    },
    saveButton: {
      flex: 2,
      backgroundColor: '#9333EA',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: '#9333EA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    saveButtonDisabled: {
      backgroundColor: isDarkMode ? '#374151' : '#D1D5DB',
      shadowOpacity: 0,
      elevation: 0,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['businessName', 'businessType', 'ownerName', 'email', 'address', 'city', 'pincode'];
    return required.every(field => formData[field as keyof typeof formData].trim() !== '');
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateBusinessProfile(formData);
      if (success) {
        Alert.alert('Success', 'Business information saved successfully!', [
          { text: 'OK', onPress: onComplete }
        ]);
      } else {
        Alert.alert('Error', 'Failed to save business information. Please try again.');
      }
    } catch (error) {
      console.error('Save business data error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Business Information</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              Please provide your business details to complete your first order
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>
                Business Name *
              </Text>
              <View style={styles.inputContainer}>
                <Building2 size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your business name"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.businessName}
                  onChangeText={(value) => handleInputChange('businessName', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>
                Business Type *
              </Text>
              <View style={styles.inputContainer}>
                <Building2 size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Restaurant, Retail, Services"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.businessType}
                  onChangeText={(value) => handleInputChange('businessType', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>
                Owner Name *
              </Text>
              <View style={styles.inputContainer}>
                <User size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter owner's full name"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.ownerName}
                  onChangeText={(value) => handleInputChange('ownerName', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>
                Email Address *
              </Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>
                Business Address *
              </Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter complete business address"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  multiline
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>
                City *
              </Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter city"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.city}
                  onChangeText={(value) => handleInputChange('city', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>
                Pincode *
              </Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter pincode"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.pincode}
                  onChangeText={(value) => handleInputChange('pincode', value)}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>GST Number (Optional)</Text>
              <View style={styles.inputContainer}>
                <FileText size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter GST number"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.gstNumber}
                  onChangeText={(value) => handleInputChange('gstNumber', value)}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PAN Number (Optional)</Text>
              <View style={styles.inputContainer}>
                <FileText size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter PAN number"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.panNumber}
                  onChangeText={(value) => handleInputChange('panNumber', value)}
                  autoCapitalize="characters"
                  maxLength={10}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Description (Optional)</Text>
              <View style={styles.inputContainer}>
                <FileText size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your business"
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={formData.businessDescription}
                  onChangeText={(value) => handleInputChange('businessDescription', value)}
                  multiline
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Skip for Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!validateForm() || isLoading) && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={!validateForm() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save & Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};