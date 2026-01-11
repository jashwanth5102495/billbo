import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Phone, ArrowRight, Sun, Moon, Briefcase, Monitor, User as UserIcon, Lock } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../(tabs)/ThemeContext';

export default function LoginScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { sendOTP, login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'business' | 'billboard'>('business');
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
      position: 'relative',
    },
    themeToggle: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 80,
      height: 80,
      backgroundColor: '#9333EA',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    logoText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    title: {
      fontSize: 28,
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
    },
    userTypeContainer: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
    },
    userTypeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      gap: 8,
    },
    userTypeButtonActive: {
      backgroundColor: '#9333EA',
    },
    userTypeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
    },
    userTypeButtonTextActive: {
      color: '#FFFFFF',
    },
    form: {
      marginBottom: 32,
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
      paddingHorizontal: 16,
      height: 56,
      marginBottom: 16,
    },
    inputWrapperFocused: {
      borderColor: '#9333EA',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    },
    countryCode: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#111827',
      paddingVertical: 0,
    },
    continueButton: {
      backgroundColor: '#9333EA',
      borderRadius: 12,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#9333EA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    continueButtonDisabled: {
      backgroundColor: isDarkMode ? '#374151' : '#D1D5DB',
      shadowOpacity: 0,
      elevation: 0,
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginRight: 8,
    },
    footer: {
      alignItems: 'center',
      paddingBottom: 32,
    },
    footerText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 20,
    },
    termsText: {
      color: '#9333EA',
      fontWeight: '600',
    },
  });

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleContinue = async () => {
    console.log('🔘 Button pressed:', userType);
    setIsLoading(true);
    try {
      if (userType === 'business') {
        // Business Owner Flow (Phone + OTP)
        console.log('📱 Validating phone number:', phoneNumber);
        if (!validatePhoneNumber(phoneNumber)) {
          console.log('❌ Invalid phone number');
          Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit mobile number');
          setIsLoading(false);
          return;
        }

        console.log('📤 Sending OTP to:', `+91${phoneNumber}`);
        const success = await sendOTP(`+91${phoneNumber}`);
        console.log('✅ Send OTP result:', success);
        
        if (success) {
          console.log('🚀 Navigating to verification screen');
          router.push(`/auth/otp-verification?phoneNumber=${encodeURIComponent('+91' + phoneNumber)}&userType=${userType}`);
        } else {
          console.log('❌ Failed to send OTP');
          Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
      } else {
        // Billboard Owner Flow (Username + Password)
        if (!username || !password) {
          Alert.alert('Missing Fields', 'Please enter both username and password');
          setIsLoading(false);
          return;
        }

        const success = await login(username, password, 'billboard');
        if (success) {
          router.replace('/billboard-owner/welcome');
        } else {
          Alert.alert('Login Failed', 'Invalid username or password');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              {isDarkMode ? <Sun size={24} color="#FDB813" /> : <Moon size={24} color="#1F2937" />}
            </TouchableOpacity>
            
            <View style={styles.logo}>
              <Text style={styles.logoText}>BB</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              {userType === 'business' 
                ? 'Enter your mobile number to continue'
                : 'Login to manage your billboards'}
            </Text>
          </View>

          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'business' && styles.userTypeButtonActive
              ]}
              onPress={() => setUserType('business')}
            >
              <Briefcase 
                size={20} 
                color={userType === 'business' ? '#FFFFFF' : (isDarkMode ? '#9CA3AF' : '#6B7280')} 
              />
              <Text style={[
                styles.userTypeButtonText,
                userType === 'business' && styles.userTypeButtonTextActive
              ]}>Business</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'billboard' && styles.userTypeButtonActive
              ]}
              onPress={() => setUserType('billboard')}
            >
              <Monitor 
                size={20} 
                color={userType === 'billboard' ? '#FFFFFF' : (isDarkMode ? '#9CA3AF' : '#6B7280')} 
              />
              <Text style={[
                styles.userTypeButtonText,
                userType === 'billboard' && styles.userTypeButtonTextActive
              ]}>Billboard Owner</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {userType === 'business' ? (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={[
                  styles.inputWrapper,
                  inputFocused === 'phone' && styles.inputWrapperFocused
                ]}>
                  <Phone size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={{ marginRight: 12 }} />
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                    onFocus={() => setInputFocused('phone')}
                    onBlur={() => setInputFocused(null)}
                  />
                </View>
              </View>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <View style={[
                    styles.inputWrapper,
                    inputFocused === 'username' && styles.inputWrapperFocused
                  ]}>
                    <UserIcon size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={{ marginRight: 12 }} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter username"
                      placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                      autoCapitalize="none"
                      value={username}
                      onChangeText={setUsername}
                      onFocus={() => setInputFocused('username')}
                      onBlur={() => setInputFocused(null)}
                    />
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[
                    styles.inputWrapper,
                    inputFocused === 'password' && styles.inputWrapperFocused
                  ]}>
                    <Lock size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={{ marginRight: 12 }} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter password"
                      placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setInputFocused('password')}
                      onBlur={() => setInputFocused(null)}
                    />
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity
              style={[
                styles.continueButton,
                isLoading && styles.continueButtonDisabled
              ]}
              onPress={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.continueButtonText}>
                    {userType === 'business' ? 'Send OTP' : 'Login'}
                  </Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsText}>Terms of Service</Text> and{' '}
              <Text style={styles.termsText}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
