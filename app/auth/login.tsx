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
  Image,
  useWindowDimensions,
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
  const [ownerStep, setOwnerStep] = useState<'username' | 'password'>('username');
  const [userType, setUserType] = useState<'business' | 'billboard'>('business');
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState<string | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const logoSize = Math.min(screenWidth * 0.9, 360);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'flex-end',
      paddingBottom: 16,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
      marginTop: -64,
      position: 'relative',
    },
    logoContainer: {
      width: logoSize,
      height: logoSize,
      borderRadius: logoSize / 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    logoImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
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
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 10,
    },
    userTypeContainer: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(243, 244, 246, 0.9)',
      borderRadius: 16,
      padding: 4,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.35)' : 'rgba(148, 163, 184, 0.25)',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 10,
    },
    userTypeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 8,
      gap: 8,
    },
    userTypeButtonActive: {
      backgroundColor: 'rgba(168, 85, 247, 0.9)',
    },
    userTypeButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
    },
    userTypeButtonTextActive: {
      color: '#FFFFFF',
    },
    form: {
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 15,
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
      paddingHorizontal: 14,
      height: 50,
      marginBottom: 10,
    },
    inputWrapperFocused: {
      borderColor: '#9333EA',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    },
    countryCode: {
      fontSize: 15,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: isDarkMode ? '#FFFFFF' : '#111827',
      paddingVertical: 0,
    },
    continueButton: {
      backgroundColor: 'rgba(168, 85, 247, 0.95)',
      borderRadius: 10,
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#A855F7',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    continueButtonDisabled: {
      backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(209, 213, 219, 0.95)',
      shadowOpacity: 0,
      elevation: 0,
    },
    continueButtonText: {
      fontSize: 15,
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
      color: '#A855F7',
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
        if (ownerStep === 'username') {
          if (!username.trim()) {
            Alert.alert('Missing Username', 'Please enter your username to continue');
            setIsLoading(false);
            return;
          }
          setOwnerStep('password');
          setIsLoading(false);
          return;
        }

        if (!password) {
          Alert.alert('Missing Password', 'Please enter your password to login');
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
            <View style={styles.logoContainer}>
              <Image source={require('../../public/logo.png')} style={styles.logoImage} />
            </View>

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
              onPress={() => {
                setUserType('business');
                setOwnerStep('username');
              }}
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
              onPress={() => {
                setUserType('billboard');
                setOwnerStep('username');
              }}
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
                <View
                  style={[
                    styles.inputWrapper,
                    inputFocused === 'phone' && styles.inputWrapperFocused,
                  ]}
                >
                  <Phone
                    size={20}
                    color={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    style={{ marginRight: 12 }}
                  />
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
            ) : ownerStep === 'username' ? (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    inputFocused === 'username' && styles.inputWrapperFocused,
                  ]}
                >
                  <UserIcon
                    size={20}
                    color={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    style={{ marginRight: 12 }}
                  />
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
            ) : (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    inputFocused === 'password' && styles.inputWrapperFocused,
                  ]}
                >
                  <Lock
                    size={20}
                    color={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    style={{ marginRight: 12 }}
                  />
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
                    {userType === 'business'
                      ? 'Send OTP'
                      : ownerStep === 'username'
                      ? 'Next'
                      : 'Login'}
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
