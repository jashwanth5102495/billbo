import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
// import 'react-native-reanimated/lib/reanimated2/js-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './(tabs)/ThemeContext';
import { CartProvider } from './(tabs)/cart-context';
import { BookingProvider } from './(tabs)/BookingContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({});

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <BookingProvider>
          <CustomThemeProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="intro" />
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/otp-verification" />
                <Stack.Screen name="auth/business-setup" />
                <Stack.Screen name="profile/index" />
                <Stack.Screen name="personal-wishes/index" />
                <Stack.Screen name="personal-wishes/booking" />
                <Stack.Screen name="personal-wishes/details" />
                <Stack.Screen name="public-wishes/index" />
                <Stack.Screen name="public-wishes/booking" />
                <Stack.Screen name="public-wishes/details" />
                <Stack.Screen name="public-wishes/confirmation" />
                <Stack.Screen name="play-ad/booking" />
                <Stack.Screen name="play-ad/business-details" />
                <Stack.Screen name="play-ad/confirmation" />
                <Stack.Screen name="billboard-owner/welcome" />
                <Stack.Screen name="billboard-owner/bookings" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </CustomThemeProvider>
        </BookingProvider>
      </CartProvider>
    </AuthProvider>
  );
}
