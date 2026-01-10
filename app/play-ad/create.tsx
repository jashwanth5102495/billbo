import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Building, FileText, Phone, User } from 'lucide-react-native';

export default function CreateAdScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');

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
    infoCard: {
      backgroundColor: '#10B981',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9,
      lineHeight: 20,
    },
    formSection: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#111827' : '#F9FAFB',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      paddingHorizontal: 16,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
      paddingVertical: 16,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
      paddingTop: 16,
    },
    submitButton: {
      backgroundColor: '#000000',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleSubmit = () => {
    if (!businessName || !description || !contactPerson || !contactNumber) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Request Submitted',
      'Thank you! Our creative team will contact you within 24 hours to discuss your ad requirements.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Advertisement</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Professional Ad Creation</Text>
            <Text style={styles.infoText}>
              Our creative team will design a professional advertisement for your business. 
            Fill in the details below and we&apos;ll get back to you with a custom quote.
            </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Name *</Text>
            <View style={styles.inputContainer}>
              <Building size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your business name"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Description *</Text>
            <View style={[styles.inputContainer, styles.textArea]}>
              <FileText size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your business, products, or services..."
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Person *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter contact person name"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={contactPerson}
                onChangeText={setContactPerson}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Number *</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter contact number"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
