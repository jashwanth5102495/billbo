import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Lock, Eye, EyeOff } from 'lucide-react-native';

const ADMIN_PASSWORD = 'admin123';

export default function AdminLoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter the admin password');
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      Alert.alert('Access Denied', 'Invalid admin password');
      setPassword('');
      return;
    }

    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/dashboard');
    }, 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F8FAFC',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    loginCard: {
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 20,
      padding: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginBottom: 32,
    },
    inputContainer: {
      position: 'relative',
      marginBottom: 24,
    },
    input: {
      backgroundColor: isDark ? '#374151' : '#F9FAFB',
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
      paddingRight: 50,
    },
    eyeButton: {
      position: 'absolute',
      right: 16,
      top: 16,
      padding: 4,
    },
    loginButton: {
      backgroundColor: '#3B82F6',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    loginButtonDisabled: {
      backgroundColor: '#9CA3AF',
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    backButton: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    backButtonText: {
      color: isDark ? '#9CA3AF' : '#6B7280',
      fontSize: 14,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginCard}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Lock size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </View>
          <Text style={styles.title}>Admin Access</Text>
          <Text style={styles.subtitle}>Enter admin password to continue</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Admin Password"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            ) : (
              <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            (isLoading || !password.trim()) && styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isLoading || !password.trim()}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}