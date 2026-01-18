import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../app/(tabs)/ThemeContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
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
    console.log(
      'AuthGuard: State update - isLoading:',
      isLoading,
      'isAuthenticated:',
      isAuthenticated,
      'user:',
      user?.id
    );

    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        if (!isAuthenticated) {
          console.log(
            'AuthGuard: Delayed redirect to login - isAuthenticated:',
            isAuthenticated
          );
          router.replace('/auth/login');
        } else {
          console.log('AuthGuard: User authenticated - allowing access');
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isLoading, user]);

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
