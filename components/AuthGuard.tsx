import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../app/(tabs)/ThemeContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDarkMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    },
  });

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('AuthGuard: User not authenticated, redirecting to login...');
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  return <>{children}</>;
};