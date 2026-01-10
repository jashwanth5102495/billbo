import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../(tabs)/ThemeContext';

export default function OTPVerificationScreen() {
  const { isDarkMode } = useTheme();
  const { login, sendOTP, skipOTPLogin } = useAuth();
  const { phoneNumber, userType } = useLocalSearchParams<{ phoneNumber: string, userType: 'business' | 'billboard' }>();
  
  // Helper to ensure userType is a string
  const getUserType = (): 'business' | 'billboard' => {
    const type = Array.isArray(userType) ? userType[0] : userType;
    return (type === 'billboard' ? 'billboard' : 'business');
  };

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<TextInput[]>([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    icon: {
      width: 80,
      height: 80,
      backgroundColor: '#9333EA',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 8,
    },
    phoneNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: '#9333EA',
      textAlign: 'center',
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 32,
      paddingHorizontal: 16,
    },
    otpInput: {
      width: 48,
      height: 56,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
      backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    otpInputFocused: {
      borderColor: '#9333EA',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    },
    otpInputFilled: {
      borderColor: '#9333EA',
      backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
    },
    verifyButton: {
      backgroundColor: '#9333EA',
      borderRadius: 12,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      shadowColor: '#9333EA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    verifyButtonDisabled: {
      backgroundColor: isDarkMode ? '#374151' : '#D1D5DB',
      shadowOpacity: 0,
      elevation: 0,
    },
    verifyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    resendContainer: {
      alignItems: 'center',
    },
    resendText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginBottom: 8,
    },
    resendButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    resendButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#9333EA',
    },
    resendButtonDisabled: {
      opacity: 0.5,
    },
    timerText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
    },
    skipButton: {
      alignItems: 'center',
      paddingVertical: 12,
      marginTop: 16,
    },
    skipButtonText: {
      fontSize: 14,
      color: '#9333EA',
      fontWeight: '600',
    },
    devNote: {
      backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
      alignItems: 'center',
    },
    devNoteText: {
      fontSize: 12,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Default to business if no userType provided (backward compatibility)
      const type = getUserType();
      console.log('Verifying OTP with userType:', type);
      
      const success = await login(phoneNumber!, otpString, type);
      
      if (success) {
        if (type === 'billboard') {
          router.replace('/billboard-owner/welcome');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Invalid OTP', 'Please check your OTP and try again');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      const success = await sendOTP(phoneNumber!);
      if (success) {
        setResendTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        Alert.alert('OTP Sent', 'A new OTP has been sent to your mobile number');
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipOTP = async () => {
    if (!__DEV__) return;
    
    setIsLoading(true);
    try {
      const type = getUserType();
      console.log('Skipping OTP with userType:', type);
      
      const success = await skipOTPLogin(phoneNumber!, type);
      if (success) {
        if (type === 'billboard') {
          router.replace('/billboard-owner/welcome');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Error', 'Failed to skip OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={isDarkMode ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Phone Number</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            <Shield size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a 6-digit code to
          </Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOtpComplete || isLoading) && styles.verifyButtonDisabled
          ]}
          onPress={handleVerify}
          disabled={!isOtpComplete || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn&apos;t receive the code?</Text>
          {canResend ? (
            <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP}>
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
          )}
        </View>

        {__DEV__ && (
          <>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipOTP}>
              <Text style={styles.skipButtonText}>Skip OTP (Development)</Text>
            </TouchableOpacity>
            
            <View style={styles.devNote}>
              <Text style={styles.devNoteText}>
                Development Mode: Use OTP 123456 or skip verification
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
