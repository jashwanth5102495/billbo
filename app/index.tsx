import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from './(tabs)/ThemeContext';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, userType } = useAuth();
  const { isDarkMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isLoading) {
      console.log('Index: Auth state changed - isAuthenticated:', isAuthenticated);
      console.log('Index: User Type:', userType);
      
      if (isAuthenticated) {
        if (userType === 'billboard') {
          console.log('Index: Redirecting to billboard owner welcome');
          router.replace('/billboard-owner/welcome');
        } else {
          console.log('Index: User authenticated, navigating to tabs');
          router.replace('/(tabs)');
        }
      } else {
        console.log('Index: User not authenticated, navigating to login');
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, userType]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#9333EA" />
    </View>
  );
}
