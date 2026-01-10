import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Phone } from 'lucide-react-native';

export default function PhoneAuthScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [phoneNumber, setPhoneNumber] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#F9FAFB',
      paddingHorizontal: 20,
    },
    header: {
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#8B5CF6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      flex: 1,
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
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    countryCode: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
      marginRight: 12,
      fontWeight: '500',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
      paddingVertical: 16,
    },
    sendOtpButton: {
      backgroundColor: '#000000',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    disclaimer: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 18,
    },
  });

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    // Simulate OTP sending
    router.push({
      pathname: '/auth/otp',
      params: { phoneNumber: `+91${phoneNumber}` },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Phone size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Welcome to Billbo</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to get started with digital billboard booking
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <TouchableOpacity style={styles.sendOtpButton} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          You will receive an SMS with verification code.
        </Text>
      </View>
    </SafeAreaView>
  );
}