import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Shield, ArrowLeft } from 'lucide-react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

export default function OtpVerificationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#F9FAFB',
      paddingHorizontal: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    header: {
      alignItems: 'center',
      paddingTop: 40,
      paddingBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#000000',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
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
    phoneText: {
      fontWeight: '600',
      color: '#000000',
    },
    otpContainer: {
      paddingHorizontal: 20,
      marginBottom: 40,
    },
    otpInput: {
      width: '100%',
      height: 200,
    },
    pinCodeContainer: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderColor: isDark ? '#374151' : '#E5E7EB',
      borderWidth: 2,
      borderRadius: 12,
    },
    pinCodeText: {
      fontSize: 20,
      color: isDark ? '#FFFFFF' : '#111827',
      fontWeight: '600',
    },
    focusStick: {
      backgroundColor: '#000000',
    },
    verifyButton: {
      backgroundColor: '#000000',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 24,
      opacity: otp.length === 6 ? 1 : 0.5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    resendContainer: {
      alignItems: 'center',
    },
    resendText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 8,
    },
    resendButton: {
      paddingVertical: 8,
    },
    resendButtonText: {
      fontSize: 14,
      color: canResend ? '#000000' : isDark ? '#6B7280' : '#9CA3AF',
      fontWeight: '600',
    },
  });

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP.');
      return;
    }

    // Simulate OTP verification
    if (otp === '123456') {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP.');
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      setTimer(30);
      setCanResend(false);
      setOtp('');
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#111827'} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.logo}>
          <Shield size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          We&apos;ve sent a 6-digit code to{'\n'}
          <Text style={styles.phoneText}>{phoneNumber}</Text>
        </Text>
      </View>

      <View style={styles.otpContainer}>
        <OTPInputView
          style={styles.otpInput}
          pinCount={6}
          code={otp}
          onCodeChanged={setOtp}
          autoFocusOnLoad
          codeInputFieldStyle={styles.pinCodeContainer}
          codeInputHighlightStyle={styles.focusStick}
          onCodeFilled={handleVerifyOtp}
        />
      </View>

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleVerifyOtp}
        disabled={otp.length !== 6}
      >
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          {canResend ? 'Didn\'t receive the code?' : `Resend OTP in ${timer}s`}
        </Text>
        <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp} disabled={!canResend}>
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
